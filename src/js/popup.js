import "../css/popup.css";

window.addEventListener("DOMContentLoaded", function () {
  var enableInput = document.getElementById("enable-extension");

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "setPopupState") {
      enableInput.checked = message.value.enable;
    }
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: "getPopupState",
    });
  });

  function sendEnable(e) {
    var enable = e.target.checked;

    var message = {
      type: "enable",
      value: enable,
    };

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }

  enableInput.addEventListener("change", sendEnable);
});
