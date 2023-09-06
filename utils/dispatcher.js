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

// Inside dispatcher.js
let lastCommandResult = null;

// Function to handle the 'readFile' command
function readFile(filePath) {
  console.log("Dispatcher: Inside readFile function");
  chrome.runtime.sendMessage({
    action: 'readFile',
    filePath: filePath
  }, function(response) {
    console.log("Dispatcher: Received response in readFile:", response);
    lastCommandResult = response.content;  // Store the content

    // Inject the content into GPT textfield
    const textField = document.querySelector('textarea#prompt-textarea[data-id][placeholder="Send a message"]'); // Replace 'SELECTOR_FOR_GPT_TEXTFIELD' with the actual CSS selector
    if (textField && lastCommandResult) {
      textField.value = lastCommandResult;
    }

    // Optionally, automatically click the 'Send' button
    const sendButton = document.querySelector('button[data-testid="send-button"][disabled] > span > svg'); // Replace 'SELECTOR_FOR_GPT_SEND_BUTTON' with the actual CSS selector
    if (sendButton) {
      sendButton.click();
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

})();
