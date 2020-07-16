class UserManager {

  constructor() {
    this.queue = [];
    this.currentUser = null;
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
    // return this.queue.some(u => u.googleId === user.googleId);
    return this.queue.some(u => u.name === user.name);
  }

  /**
   * Checks if user is already in the queue and adds them if they are not.
   * If they are the only user they skip the queue and are made the current user
   * @param {User} user The user to enqueue
   */
  addUser(user) {
    if (this.queue.length === 0 && !this.currentUser) { this.currentUser = user; }
    else if (!this.userInQueue(user)) { this.queue.push(user); }
  }

  /**
   * Removes next user from the queue and replaces the current user with them
   * @returns {Object} the user that was removed
   */
  replaceCurrentUser() {
    const shifted = this.queue.shift();
    this.currentUser = shifted ? shifted : null;
  }

  /**
   * Get user's place in queue
   * @param {User} user user to check place
   * @returns {number} user's place in queue or 0 if the user does not exist in the queue
   */
  getPlaceInQueue(user) {
    // return (this.queue.findIndex(u => u.googleId === user.googleId) + 1);
    return (this.queue.findIndex(u => u.name === user.name) + 1);
  }

  /**
   * Checks if user is the current user
   * @param {User} user being compared
   * @returns {boolean} true if user is the current user
   */
  isCurrentUser(user) {
    if (!this.currentUser) { return false; }
    // return (this.currentUser.googleId === user.googleId);
    return (this.currentUser.name === user.name);
  }

  /**
   * Get the current user
   * @returns {User} current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Remove the disconnected user from the queue or current user position
   * @param {User} user the user that disconnected
   */
  userDisconnected(user) {
    if (this.userInQueue(user)) {
      // this.queue = this.queue.filter(u => u.googleId !== user.googleId);
      this.queue = this.queue.filter(u => u.name !== user.name);
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
}

module.exports = UserManager;
