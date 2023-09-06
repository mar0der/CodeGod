const Dispatcher = (function() {
  
    // Function to handle the 'createFile' command
    function createFile(filePath, code) {
      chrome.runtime.sendMessage({
        action: 'createFile',
        filePath: filePath,
        code: code
      }, function(response) {
        console.log(response.message);
      });
    }

    // Function to handle the 'readFile' command
    function readFile(filePath) {
      chrome.runtime.sendMessage({
        action: 'readFile',
        filePath: filePath
      }, function(response) {
        console.log(response.message);
      });
    }

    // Function to handle the 'getProjectStructure' command
    function getProjectStructure() {
      console.log('Getting project structure');
    }

    // Main function to dispatch commands
    function dispatchCommand(command) {
      if (command.command === 'createFile') {
        createFile(command.filePath, command.code);
      } else if (command.command === 'readFile') {
        readFile(command.filePath);
      } else if (command.command === 'getProjectStructure') {
        getProjectStructure();
      } else {
        console.log('Unknown command');
      }
    }

    return {
      dispatchCommand
    };
  
})();