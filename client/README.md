The Client folder servers the frontend and UI

The folder has the following heirarchy of files:
1. PUBLIC: Consists the entry file for the frontend i.e index.html
2. src
    |---> Chat: Contains all the .jsx file for the stateful components: chatbox, rooms etc
    |---> Home: Contains all the components for login page
    |---> Services: Makes all the fetch call i.e post/get requests for messaging, login and registration
    |---> Utilities: Contains all the file to handle response from server (bot, room, chat response)
    |---> App.js, index.css, index.js: Renders the main REACTDOM
3. .env: contains URL for the backend server
4. package.json (all required node packages)

    


