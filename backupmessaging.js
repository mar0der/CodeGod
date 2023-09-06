// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log("hello from background create file function");

//     if (request.action === 'createFile') {
//       // Connect to native application
//       const port = chrome.runtime.connectNative('com.BoldChimp.NativeWarrior');
      
//       // Send message to native application
//       port.postMessage({text: 'createFile', code: request.code, filePath: request.filePath});
//       console.log("Posted the message");
      
//       // Listen for a message back from the native application
//       port.onMessage.addListener((response) => {
//         console.log("Received: ", response);
//         if (response && response.success) {
//           sendResponse({message: 'File has been created'});
//         } else {
//           sendResponse({message: 'Failed to create file'});
//         }
//       });
      
//       // Listen for disconnect
//       port.onDisconnect.addListener(() => {
//         if (chrome.runtime.lastError) {
//             console.log(`Disconnected due to: ${chrome.runtime.lastError.message}`);
//         }
//         console.log("Disconnected");
//       });
//     }

//     return true; // Keeps the message channel open for the response
//   }
// );