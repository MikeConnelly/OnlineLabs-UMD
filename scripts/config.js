const iotHubConnectionString = "HostName=amatti-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=/iXuuvWTNvxhOCNz3ISFUpVYTUfbgPL76EAY/1wOcXM=";
// const iotHubConnectionString = "HostName=amatti-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=zEyEkUkz2L7CsgH74O7K+w7ktq6sr/DC6majfrgAaDs="
const eventHubConsumerGroup = "$Default";

module.exports = {
    iotHubConnectionString: iotHubConnectionString,
    eventHubConsumerGroup: eventHubConsumerGroup
}