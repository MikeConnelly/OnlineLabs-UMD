class Queue {

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
   * Checks if user is already in the queue and adds them if they are not.
   * If they are the only user they skip the queue and are made the current user
   * @param {object} user The user to enqueue
   */
  addUser(user) {
    if (this.queue.length === 0 && !this.currentUser) { this.currentUser = user; }
    else if (!userInQueue(user)) { this.queue.push(user); }
  }

  /**
   * Checks if user is in the queue
   * @param {object} user the user to check
   * @returns {boolean} true if user is in the queue
   */
  userInQueue(user) {
    return this.queue.some(u => u.googleId === user.googleId)
  }

  /**
   * Removes next user from the queue and replaces the current user with them
   * @returns {object} the user that was removed
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
    return (this.queue.findIndex(u => u.googleId === user.googleId) + 1);
  }

  /**
   * Checks if user is the current user
   * @param {User} user being compared
   * @returns {boolean} true if user is the current user
   */
  isCurrentUser(user) {
    if (!this.currentUser) { return false; }
    return (this.currentUser.googleId === user.googleId);
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
   * @param {User} user 
   */
  userDisconnected(user) {
    if (this.userInQueue(user)) {
      this.queue = this.queue.filter(u => u.googleId !== user.googleId);
    } else if (this.isCurrentUser(user)) {
      this.replaceCurrentUser();
    }
  }
}

module.exports = Queue;
