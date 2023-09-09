// Modified FeedbackProvider Module
const FeedbackProvider = (function() {

  // Function to populate GPT's text area with feedback message
  function provideFeedbackToGPT(messages) {
    console.log("FeedbackProvider: Inside provideFeedbackToGPT function"); // Debugging message

    // Find the text area element where the GPT messages are typed
    const textArea = document.querySelector('#prompt-textarea');

    // Populate the text area with the message(s)
    if (textArea) {
      console.log("FeedbackProvider: Found textArea"); // Debugging message

      let fullMessage = "";

      if (Array.isArray(messages)) {
        // Handle multiple messages
        for (const [index, message] of messages.entries()) {
          fullMessage += `//${message.fileName}\n${message.content}\n`;
        }
      } else {
        // Handle single message
        fullMessage = messages;
      }

      textArea.value += fullMessage;

      // Trigger a DOM event to notify that the textarea's content has changed
      textArea.dispatchEvent(new Event('input', {'bubbles': true, 'cancelable': true}));
    } else {
      console.log("FeedbackProvider: textArea not found"); // Debugging message
    }

    // Find the send button
    const sendButton = document.querySelector('[data-testid="send-button"]');

    // Enable the send button
    if (sendButton) {
      console.log("FeedbackProvider: Found sendButton"); // Debugging message
      sendButton.removeAttribute('disabled');
      
      // Click the send button programmatically
      sendButton.click();
    } else {
      console.log("FeedbackProvider: sendButton not found"); // Debugging message
    }
  }

  return {
    provideFeedbackToGPT
  };

})();
