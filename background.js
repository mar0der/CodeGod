let isListenerAdded = false;
let msgId = 0;  // Initialize a message identifier
let processedMsgIds = new Set();  // To keep track of processed message IDs

if (!isListenerAdded) {
  isListenerAdded = true;
  console.log("Background: Adding listener");

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      msgId++;  // Increment the message identifier
      console.log(`Background: Message received`);
      console.log(`Background: Processing request, MsgId: ${msgId}`);

      if (processedMsgIds.has(msgId)) {
        console.log(`Background: Message ${msgId} already processed, skipping.`);
        return true;
      }

      if (request.action === 'readFile') {
        console.log(`Background: Inside readFile action`);
        
        // Prepare data
        const data = {
          filePath: request.filePath
        };

        // Sending HTTP POST request to Flask server
        fetch('http://localhost:5000/read_file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            console.log("Background: File read successful");
          } else {
            console.log("Background: File read failed");
          }
          console.log("Background: Sending response back to dispatcher.js for readFile");
          sendResponse({message: 'File has been read', content: data.content});
        });

        processedMsgIds.add(msgId);  // Mark this message as processed
        return true;  // Keep the message channel open for asynchronous operation
      }

      if (request.action === 'createFile') {
        console.log(`Background: Inside createFile action`);
        
        // Prepare data
        const data = {
          filePath: request.filePath,
          code: request.code
        };

        // Sending HTTP POST request to Flask server
        fetch('http://localhost:5000/create_file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            console.log("Background: File created successfully");
          } else {
            console.log("Background: File creation failed");
          }
          console.log("Background: Sending response back to dispatcher.js for createFile");
          sendResponse({message: 'File has been created'});
        })
        .catch(error => {
          console.log("Background: Error in file creation:", error);
          sendResponse({message: 'File creation failed', error: error});
        });

        processedMsgIds.add(msgId);  // Mark this message as processed
        return true;  // Keep the message channel open for asynchronous operation
      }
    }
  );
}
