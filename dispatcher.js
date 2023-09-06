// Importing the FeedbackProvider module
// Assuming FeedbackProvider is in the same directory
// import { provideFeedbackToGPT } from './FeedbackProvider'; // Uncomment this line if you are using ES6 modules

const Dispatcher = (function() {

  // Function to handle the 'createFile' command
  function createFile(filePath, code) {
    console.log("Dispatcher: Inside createFile function");
    chrome.runtime.sendMessage({
      action: 'createFile',
      filePath: filePath,
      code: code
    }, function(response) {
      console.log("Dispatcher: Received response in createFile:", response.message);
    });
  }

  // Function to handle the 'readFile' command
  function readFile(filePath) {
    console.log("Dispatcher: Inside readFile function");
    chrome.runtime.sendMessage({
      action: 'readFile',
      filePath: filePath
    }, function(response) {
      console.log("Dispatcher: Received response in readFile:", response);

      // Use FeedbackProvider's function to populate GPT's text area
      FeedbackProvider.provideFeedbackToGPT(response.content, true);
    });
  }

  // Function to handle the 'getProjectStructure' command
  function getProjectStructure() {
    console.log('Dispatcher: Getting project structure');
  }

  // Main function to dispatch commands
  function dispatchCommand(command) {
    console.log("Dispatcher: Inside dispatchCommand function, command:", command.command);
    if (command.command === 'createFile') {
      createFile(command.filePath, command.code);
    } else if (command.command === 'readFile') {
      readFile(command.filePath);
    } else if (command.command === 'getProjectStructure') {
      getProjectStructure();
    } else {
      console.log('Dispatcher: Unknown command');
    }
  }

  return {
    dispatchCommand
  };

})(FeedbackProvider);