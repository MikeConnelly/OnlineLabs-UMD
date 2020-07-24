/**
 * Handles the state of the queue and current user
 */
class UserManager {

  constructor(io, iotClient) {
    this.io = io;
    this.iotClient = iotClient;
    this.queue = [];
    this.currentUser = null;
    this.currentUserInactiveInterval = null;
    this.minutesIdle = 0;
  }
    
  /**
   * Get length of the queue
   * @returns {number} queue length
   */
  getLength() {
    return this.queue.length;
  }

  /**
   * Checks if user is in the queue
   * @param {User} user the user to check
   * @returns {boolean} true if user is in the queue
   */
  userInQueue(user) {
    return this.queue.some(u => u.siteId === user.siteId);
  }

  /**
   * Get user's place in queue
   * @param {User} user user to check place
   * @returns {number} user's place in queue or 0 if the user does not exist in the queue
   */
  getPlaceInQueue(user) {
    return (this.queue.findIndex(u => u.siteId === user.siteId) + 1);
  }

  /**
   * Checks if user is the current user
   * @param {User} user being compared
   * @returns {boolean} true if user is the current user
   */
  isCurrentUser(user) {
    if (!this.currentUser) { return false; }
    return (this.currentUser.siteId === user.siteId);
  }

  /**
   * Get the current user
   * @returns {User} current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Set the current user and begin a new inactivity timer for the current user.
   * Updates all clients when finished.
   * @param {User} user user or null
   */
  setCurrentUser(user) {
    if (this.currentUserInactiveInterval) {
      this.currentUserInactiveInterval = clearInterval(this.currentUserInactiveInterval);
      this.refreshCurrentUserTimer();
    }
    this.currentUser = user;
    if (user) {
      this.currentUserInactiveInterval = setInterval(() => {
        this.currentUserTimoutCheck();
      }, 1000*60); // 1 min
    }
    this.updateAllClients();
  }

  /**
   * Checks if user is already in the queue and adds them if they are not.
   * If they are the only user they skip the queue and are made the current user.
   * Updates all clients when finished.
   * @param {User} user The user to enqueue
   */
  addUser(user) {
    if (this.queue.length === 0 && !this.currentUser) {
      this.setCurrentUser(user);
    } else if (!this.userInQueue(user)) {
      this.queue.push(user);
      this.updateAllClients();
    }
  }

  /**
   * Removes next user from the queue and replaces the current user with them
   */
  replaceCurrentUser() {
    const shifted = this.queue.shift();
    this.setCurrentUser((shifted ? shifted : null));
  }

  /**
   * Called from current user api routes to refresh inactivity timer
   */
  refreshCurrentUserTimer() {
    this.minutesIdle = 0;
  }

  /**
   * Increments minutesIdle and calls replaceCurrentUser if >= 4.
   */
  currentUserTimoutCheck() {
    this.minutesIdle++;
    if (this.minutesIdle >= 4) {
      this.currentUserInactiveInterval = clearInterval(this.currentUserInactiveInterval);
      this.refreshCurrentUserTimer();
      this.resetMotorsAndClear();
      this.replaceCurrentUser();
    }
  }

  /**
   * Remove the disconnected user from the queue or current user position.
   * Updates all clients when finished.
   * @param {User} user the user that disconnected
   */
  userDisconnected(user) {
    if (this.userInQueue(user)) {
      this.queue = this.queue.filter(u => u.siteId !== user.siteId);
      this.updateAllClients();
    } else if (this.isCurrentUser(user)) {
      this.replaceCurrentUser();
    }
  }

  /**
   * Get info about a about the queue and a user's place in it
   * @param {User} user the user to get information about
   * @returns {Object} queue info
   */
  getQueueState(user) {
    const placeInQueue = user ? this.getPlaceInQueue(user) : 0; // 0 if user not there
    const queueLength = this.getLength();
    const currentUserName = this.currentUser ? this.currentUser.name : 'None'
    const isCurrentUser = user ? this.isCurrentUser(user) : false;
    const inQueue = (placeInQueue > 0);
 
    return {
      'inQueue': inQueue,
      'isCurrentUser': isCurrentUser,
      'placeInQueue': placeInQueue,
      'queueLength': queueLength,
      'currentUserName': currentUserName
    };
  }

  /**
   * send queue state to clients
   * @param {SocketIO.Socket} socket socket the information is being sent to
   */
  updateClient(socket) {
    let user;
    if (!socket.request.user.logged_in) {
      user = undefined;
    } else {
      user = socket.request.user;
    }
  
    const queueState = this.getQueueState(user);
    socket.emit('queueState', queueState);
  }

  /**
   * send queue state to all clients
   */
  updateAllClients() {
    const self = this;
    Object.keys(this.io.sockets.sockets).forEach(id => {
      self.updateClient(this.io.sockets.connected[id]);
    });
  }

  /**
   * Calls device method to reset motor position
   * Doesn't get used anymore in favor of resetMotorsAndClear
   * @param {Function} cb optional callback function
   */
  resetMotors(cb) {
    const data = {
      "methodName": "reset",
      "responseTimeoutInSeconds": 60,
      "payload": {}
    };
    this.deviceMethod(data, cb);
  }

  /**
   * Calls device method to reset motor position and clear motor queue.
   * Should be called whenever a user clicks reset or is finished.
   * @param {Function} cb optional callback function
   */
  resetMotorsAndClear(cb) {
    const data = {
      "methodName": "clearReset",
      "responseTimeoutInSeconds": 60,
      "payload": {}
    };
    this.deviceMethod(data, cb);
  }
  
  /**
   * Wrapper for getting SAS key and sending a post request to our device
   * @param {Object} data direct method parameters
   * @param {Function} cb optional callback function
   * Device name should be MyNodeESP32 for Kang's esp or MyNodeDevice for Mike's AZ3166
   */
  deviceMethod(data, cb) {
    this.iotClient.invokeDeviceMethod('MyNodeESP32', data, (err, result) => {
      if (err && !(err instanceof SyntaxError)) {
        // this gets called with a syntax error whenever invoking
        // a device method, despite the device method actually working
        // should look into this later but for now it can be ignored
        console.log('failed to invoke device method...');
        if (cb) { cb(err); }
      } else {
        console.log('successfully invoked device method');
        if (cb) { cb(); }
      }
    });
  }
}

module.exports = UserManager;
