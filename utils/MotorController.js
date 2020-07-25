/**
 * Handles sending all direct methods to the IOT device
 */
class MotorController {

  constructor(iotClient) {
    this.iotClient = iotClient;
  }

  /**
   * Moves the motors by a single xy vector, not used in favor of moveArray
   * @param {number} x x distance
   * @param {number} y y distance
   * @param {Function} cb optional callback function
   */
  move(x, y, cb) {
    const data = getDataObject('move', { "x": x, "y": y });
    this.deviceMethod(data, cb);
  }

  /**
   * Adds an array of xy vectors to the device's motor queue
   * @param {[number]} xArr array of x vectors
   * @param {[number]} yArr array of y vectors
   * @param {Function} cb optional callback function
   */
  moveArray(xArr, yArr, cb) {
    const data = getDataObject('moveArray', { "x": xArr, "y": yArr });
    this.deviceMethod(data, cb);
  }
  
  /**
   * Calls device method to reset motor position
   * Doesn't get used anymore in favor of resetMotorsAndClear
   * @param {Function} cb optional callback function
   */
  resetMotors(cb) {
    const data = getDataObject('reset', {});
    this.deviceMethod(data, cb);
  }

  /**
   * Calls device method to reset motor position and clear motor queue.
   * Should be called whenever a user clicks reset or is finished.
   * @param {Function} cb optional callback function
   */
  resetMotorsAndClear(cb) {
    const data = getDataObject('clearReset', {});
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

/**
 * gets the data payload in the format for Azure direct methods
 * @param {string} methodName the method on the device that should be called
 * @param {Object} payload the data to send the device
 * @returns {Object} data payload to invoke direct method with
 */
function getDataObject(methodName, payload) {
  return {
    "methodName": methodName,
    "responseTimeoutInSeconds": 60,
    "payload": payload
  };
}

module.exports = MotorController;
