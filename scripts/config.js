// Kang's ESP
const iotHubConnectionString = "HostName=amatti-iot-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=/iXuuvWTNvxhOCNz3ISFUpVYTUfbgPL76EAY/1wOcXM=";
// Mike's AZ3166
// const iotHubConnectionString = "HostName=ENEE101IOTHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=JwJEwPs2pwr2my/5kR7ZbmpOuVqL7xOdfGFKyZ8zMc8="
const eventHubConsumerGroup = "$Default";

module.exports = {
    iotHubConnectionString: iotHubConnectionString,
    eventHubConsumerGroup: eventHubConsumerGroup
}