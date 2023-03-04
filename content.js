// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      for (let node of mutation.addedNodes) {
        if (node.tagName == "CIB-SERP") {
          handle_cib(node.shadowRoot);
          observer.disconnect();
        }
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

const handle_cib = (root_node) => {
  let background = root_node.querySelector("cib-background");
  let conversation = root_node.querySelector("cib-conversation");
  let actionBar = root_node.querySelector("cib-action-bar");
  let serpFeedback = root_node.querySelector("cib-serp-feedback");
  let hoverCard = root_node.querySelector("cib-hover-card");
  let hover = root_node.querySelector("cib-hover");

  change_background(root_node, background);
  handle_conversation(root_node, conversation);
  handle_action_bar(root_node, actionBar);
}

const change_background = (rootNode, backgroundNode) => {
  rootNode.removeChild(backgroundNode);
}

const handle_conversation = (rootNode, conversationNode) => {
  
}

const handle_action_bar = (rootNode, actionBarNode) => {
  
}