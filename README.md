# TrackGols: Back-end Layer

TrackGols is a personalized web application designed for users to effectively track and manage their goals. This web application provides users with customizable goal tracking capabilities, enabling them to set a goal, create columns and tasks, and visually track their progress by seamlessly dragging and dropping tasks across different columns. With TrackGols, achieving your goals has never been easier and fun! 


## Technology Stack

-   Database: Mongodb
-   Backend: Node.js & Express
-   Front-end: React
  
## Dependencies

-   brew
-   npm
-   node
-   express
-   mongodb
-   docker

## How To Set Up TrackGols's Back-end Layer
-   Install docker and run these commands in the terminal:
    -   docker pull mongodb/mongodb-community-server
    -   docker run --name mongo -d mongodb/mongodb-community-server:latest
    -   docker container ls
    -   docker run -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root -p 27017:27017 mongo
-   Install mongo
    -   brew tap mongodb/brew
    -   brew install mongodb-community@6.0
-   Run this code on the root directory to restore database:
    -   mongorestore -d trackgols -u root -p root --authenticationDatabase admin --drop --stopOnError --gzip dataBackup/trackgols
-   From the root directory do "npm install"
-   Create a .env file on the root directory and add these variables:
    -   PORT = 3001
    -   CONNECTION_STRING = "mongodb://root:root@localhost:27017/"
    -   DB_NAME = "trackgols"
-   Do "npm start" to run the back-end server

### Potential Future Enhancements

-   Deployment
-   Users can rearrange columns
-   Users can create multiple boards
-   Users can sign in/create an account to save progress
-   Users can add a due date to a goal
-   Users can change the color theme of the board