class G2Controller {

  constructor(iotClient) {
    this.iotClient = iotClient;
  }

  sendResistance(data, cb) {
    this.deviceMethod(data, cb);
  }

  deviceMethod(data, cb) {
    this.iotClient.invokeDeviceMethod('esp', data, (err, result) => {
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

module.exports = G2Controller;
