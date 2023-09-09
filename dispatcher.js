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

  function readFile(filePath) {
    console.log("Dispatcher: Inside readFile function");
    chrome.runtime.sendMessage({
      action: 'readFile',
      filePath: filePath
    }, function(response) {
      globalState.pendingReads--;  // Decrement the counter
      globalState.readResults.push({
        fileName: filePath.split('/').pop(),
        content: response.content
      });
      if (globalState.pendingReads === 0) {
        // Trigger sending all readResults back
        FeedbackProvider.provideFeedbackToGPT(globalState.readResults);
        globalState.readResults = [];  // Clear the results
      }
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
