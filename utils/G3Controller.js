class G3Controller {

  constructor(iotClient) {
    this.iotClient = iotClient;
  }

  sendResistance(payload, cb) {
    const data = getDataObject('res', payload);
    this.deviceMethod(data, cb);
  }

  sendBrightness(payload, cb) {
    const data = getDataObject('brightness', payload);
    this.deviceMethod(data, cb);
  }

  sendData(payload, cb) {
    const data = getDataObject('data', payload);
    this.deviceMethod(data, cb);
  }

  deviceMethod(data, cb) {
    this.iotClient.invokeDeviceMethod('gizmo3', data, (err, result) => {
      if (err && !(err instanceof SyntaxError)) {
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

module.exports = G3Controller;
