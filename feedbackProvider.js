// FeedbackProvider Module
const FeedbackProvider = (function() {

  // Function to populate GPT's text area with feedback message
  function provideFeedbackToGPT(message, autoSend = false, prefix = "", suffix = "") {
    console.log("FeedbackProvider: Inside provideFeedbackToGPT function"); // Debugging message

    // Find the text area element where the GPT messages are typed
    const textArea = document.querySelector('#prompt-textarea');
    
    // Find the send button
    const sendButton = document.querySelector('[data-testid="send-button"]');
    
    // Populate the text area with the message
    if (textArea) {
      console.log("FeedbackProvider: Found textArea"); // Debugging message
      let fullMessage = prefix ? prefix + "\\n" : "";
      fullMessage += message + "\\n";
      fullMessage += suffix ? suffix + "\\n" : "";
      textArea.value = fullMessage;

      // Trigger a DOM event to notify that the textarea's content has changed
      textArea.dispatchEvent(new Event('input', {'bubbles': true, 'cancelable': true}));
    } else {
      console.log("FeedbackProvider: textArea not found"); // Debugging message
    }
    
    // Enable the send button
    if (sendButton) {
      console.log("FeedbackProvider: Found sendButton"); // Debugging message
      sendButton.removeAttribute('disabled');
    } else {
      console.log("FeedbackProvider: sendButton not found"); // Debugging message
    }

    // If autoSend is true, click the send button programmatically
    if (autoSend && sendButton) {
      console.log("FeedbackProvider: Auto-sending message"); // Debugging message
      sendButton.click();
    }
  }

  return {
    provideFeedbackToGPT
  };

})();
