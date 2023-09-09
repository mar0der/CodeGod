// Main Module -> starts here
function x(x){
    console.log(x);
}

// Function to hash strings
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
  }
  return hash;
}

// Global state object
const globalState = {
    pendingReads: 0,
    readResults: []
};

let lastHash = null;

(function(Parser, Dispatcher) {
    let typingLoaderWasPresent = false;
    // Global state object

    // Utility function to count the number of 'readFile' commands in an array of commands
    function countReadCommands(commands) {
        return commands.filter(command => command.command === 'readFile').length;
        }

    // Checks if loader is present
    function isTypingLoaderPresent() {
        const divs = document.querySelectorAll('div.text-2xl');
        for (let div of divs) {
            const spans = div.querySelectorAll('span:not(.invisible)');
            for (let span of spans) {
                if (span.textContent === '·') {
                    return true;
                }
            }
        }
        return false;
    }

    // Finds all gpt responses and returns the last one. Should be called after GPT stopped typing.
    function getLastGPTMessage() {
        const messages = document.querySelectorAll('.markdown.prose.w-full.break-words');
        if (messages.length === 0) {
            return null;
        }
        const lastMessageNode = messages[messages.length - 1];
        return lastMessageNode;
    }

    // Triggered when GPT stops typing. We get the last message and send it to the parser.
    function onTypingLoaderDisappeared() {
        console.log("Content: Inside Typing Dissapear");
        const lastMessageNode = getLastGPTMessage();
        if (lastMessageNode) {
            console.log("Content: Last node excists");
            const newHash = hashString(lastMessageNode.textContent);
            if (newHash !== lastHash) {
                console.log("Content: Parse message sent");
                const commands = Parser.parseMessage(lastMessageNode);
                if (commands) {
                  globalState.pendingReads = countReadCommands(commands);  // Set the number of pending reads
                  for (const command of commands) {
                    Dispatcher.dispatchCommand(command);
                  }
                }
                lastHash = newHash;
            }
        }
    }

    // Create an observer instance
    const observer = new MutationObserver(mutations => {
        //console.log("Observer: Mutations", mutations[1]);
        const typingLoader = isTypingLoaderPresent();
        if (!typingLoader && typingLoaderWasPresent) {
            onTypingLoaderDisappeared();
        }
        typingLoaderWasPresent = typingLoader;
    });

    // Configuration of the observer
    const config = { childList: true, subtree: true };

    // Application starting point. Start observing the entire body for DOM changes.
    observer.observe(document.body, config);

})(Parser, Dispatcher);
