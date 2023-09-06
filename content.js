// content.js

// Function to hash strings
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
  }
  return hash;
}

let lastHash = null;

// Main Module -> starts here
function x(x){
    console.log(x);
}

(function(Parser, Dispatcher) {
    let typingLoaderWasPresent = false;

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
                    console.log("Content: Commands Dispatched:" + commands.length);
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
