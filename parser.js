// Parser Module
const Parser = (function() {
    // Regex patterns for the commands
    const patterns = {
      createFile: /@createFile\("(.+?)"\)/,
      readFile: /@readFile\("(.+?)"\)/,
      getProjectStructure: /@getProjectStructure\(\)/
    };

    function parseMessage(lastMessageNode) {
        // Initialize an array to store the detected commands
        let detectedCommands = [];

        // Try to find a command in the text content of the lastMessageNode
        const textContent = lastMessageNode.textContent;
        const createFileMatch = textContent.match(/@createFile\("(.+?)"\)/);

        // Parser: Checking for "createFile" command
        if (createFileMatch) {
            console.log("Parser: Detected 'createFile' command");  // Debugging comment

            const command = {
                command: 'createFile',
                filePath: createFileMatch[1]
            };

            // Trying to find a code snippet that follows the 'createFile' command
            const codeSnippetElement = lastMessageNode.querySelector('.bg-black.rounded-md.mb-4');
            if (codeSnippetElement) {
                console.log("Parser: Found code snippet element");  // Debugging comment
                const code = codeSnippetElement.querySelector('code');
                if (code) {
                    command.code = code.textContent.trim();
                }
            }

            detectedCommands.push(command);
        }

        // Tries to find "readFile" command
        const readFileRegex = new RegExp(patterns.readFile, 'g');
        const readFileMatches = lastMessageNode.textContent.matchAll(readFileRegex);
        console.log("Parser: readFileMatch array:");

        for (const match of readFileMatches) {
            const filePath = match[1]; // The captured group containing the file path
            console.log("Parser: Read File detected: " + filePath);
            detectedCommands.push({
                command: 'readFile',
                filePath: filePath
            });
        }

        // Search for 'getProjectStructure' commands
        const getProjectStructureRegex = new RegExp(patterns.getProjectStructure);
        const getProjectStructureMatch = lastMessageNode.textContent.match(getProjectStructureRegex);

        if (getProjectStructureMatch) {
            detectedCommands.push({
                command: 'getProjectStructure'
            });
        }

        // Return the array of detected commands
        return detectedCommands.length > 0 ? detectedCommands : null;
    }

    // Expose the parseMessage function
    return {
      parseMessage: parseMessage
    };

})();
