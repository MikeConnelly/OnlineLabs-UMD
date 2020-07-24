# enee101online-webapp

Website created with the goal of moving University of Maryland lab classes online. Currently set up to send motor control commmands to an ESP32 microprocessor over the internet via the Microsoft Azure IOT Hub, and return ultrasonic sensor data to the user.

Live website: https://enee101online-webapp.herokuapp.com/  
Device code repo: https://github.com/mattinglyas/enee101-esp  

# Example

![Demo gif](demo/demo.gif)

# Setup

### Environment Variables
Clone the repo and create a file named ".env" in the base directory.

#### IOT Hub Connection
Create and IOT Hub instance on Microsoft Azure and add the following variables:  
CONNECTIONSTRING=[Your primary connection string]  
CONSUMERGROUP=[Your consumer group, probable $Default]  

#### MongoDB Connection
Create a mongodb instance on Azure CosmosDB or another database provider and enter the variable:  
DBCONN=[Your database connection string]  

#### Cookie key
Add the variable:  
COOKIEKEY=[Any string you want to use as a key to encrypt your cookies]  

#### Google authentication
To use Google authentication, create an app at [console.developers.google.com](console.developers.google.com) and enter variables:  
AUTHID=[Your app id]  
AUTHSECRET=[Your app secret]  


### Running the app
Ensure [Node.js and npm](https://nodejs.org/en/) are installed and enter the following commands.
```
npm install
npm run build && npm start
```
