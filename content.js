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

// ----------------------------- manipulate DOM -----------------------------

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
  disable_fade(conversationNode);
  handle_welcome_message(conversationNode);
  handle_messages(conversationNode);
}

const handle_action_bar = (rootNode, actionBarNode) => {
  let shadow = actionBarNode.shadowRoot;
  // let main_container = shadow.querySelector("div.main-container");
  let style = document.createElement("style");

  style.innerHTML = `
    .main-container {
      background-color: #4a4a4a !important;
    }
    #searchbox {
      color: #eee !important;
    }
    ::placeholder {
      color: #aaa !important;
    }
    svg {
      color: #aaa !important;
    }
  `;

  let root = shadow.querySelector("div.root");
  root.appendChild(style);
}

// ----------------------------- helper functions -----------------------------

const disable_fade = (conversationNode) => {
  let shadow = conversationNode.shadowRoot;

  let scroller_div = shadow.querySelector("div.scroller");

  let fade_bottom = scroller_div.querySelector(".fade.bottom");
  let fade_top = scroller_div.querySelector(".fade.top");
  scroller_div.removeChild(fade_bottom);
  scroller_div.removeChild(fade_top);
}

const handle_welcome_message = (conversationNode) => {
  let shadow = conversationNode.shadowRoot;

  let welcome_container = shadow.querySelector("cib-welcome-container").shadowRoot;

  let style = document.createElement("style");
  style.innerHTML = `
  .container-title {
    color: #eee !important;
  }
  .learn-tog-item>span {
    color: #ccc !important;
  }
  a {
    color: #2b93ff !important;
  }
  `;
  welcome_container.appendChild(style);

  let container_item = welcome_container.querySelector("div.container-item");
  let welcome_items = container_item.getElementsByTagName("cib-welcome-item");
  
  for (let item of welcome_items) {
    let item_shadow = item.shadowRoot;
    let container = item_shadow.querySelector("button.container");
    let item_style = document.createElement("style");
    item_style.innerHTML = `
    .item-title {
      color: #ddd !important;
    }
    .item-content {
      background-color: #111 !important;
    }
    .item-body {
      color: #ccc !important;
    }
    `;
    container.appendChild(item_style);
  }
}

const handle_messages = (conversationNode) => {
  let shadow = conversationNode.shadowRoot;
  let cib_chat_main = shadow.querySelector("#cib-chat-main");
  
  const chat_callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for (let node of mutation.addedNodes) {
          if (node.tagName == "CIB-CHAT-TURN") {
            let shadow = node.shadowRoot;
            new MutationObserver(message_group_callback)
              .observe(shadow, { childList: true, subtree: true });
          }
        }
      }
    }
  };

  // Create an observer instance linked to the callback function
  new MutationObserver(chat_callback).observe(cib_chat_main, config);
}

const message_group_callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      for (let node of mutation.addedNodes) {
        if (node.tagName == "CIB-MESSAGE-GROUP") {
          let stylesheet = document.createElement("style");
          stylesheet.innerHTML =
          `
            cib-message[type='text'] {
              background-color: #252525 !important;
            }
          `;
          node.shadowRoot.appendChild(stylesheet);
          // handle_message_group(node);
        }
      }
    }
  }
}

// const handle_message_group = (messageGroupNode) => {
//   let is_bot = messageGroupNode.getAttribute("source") == "bot";
//   let shadow = messageGroupNode.shadowRoot;
//   // console.log("new message group:", shadow);

//   if (is_bot) {
//     new MutationObserver(bot_message_callback).observe(shadow, config);
//   }
// }

// const bot_message_callback = (mutationList, observer) => {
//   for (const mutation of mutationList) {
//     if (mutation.type === "childList") {
//       for (let node of mutation.addedNodes) {
//         if (node.tagName == "CIB-MESSAGE") {
//           if (node.getAttribute("type") == "text") {
//             console.log("new bot text", node);
            
//             // each turn only on bot text is generated
//             observer.disconnect();
//           }
//         }
//       }
//     }
//   }
// }
