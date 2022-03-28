let enable = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "getPopupState":
      chrome.runtime.sendMessage({
        type: "setPopupState",
        value: {
          enable,
        },
      });
      break;
    case "enable":
      processEnable(message.value);
      break;
    default:
      break;
  }
});

function processEnable(flag) {
  enable = flag || false;
  if (!enable) {
    var elt = document.createElement("script");
    elt.innerHTML = `window.disableGrabluExtension();`;
    document.head.appendChild(elt);
  } else {
    var elt = document.createElement("script");
    elt.innerHTML = `window.enableGrabluExtension();`;
    document.head.appendChild(elt);
  }
}

var scriptContent = `
var grabluTargetMS = 32;

var raf = window.requestAnimationFrame;
var nextRAFTime = Date.now() + grabluTargetMS;

var mockedRaf = (callback) => {
    var now = Date.now();
    if (now >= nextRAFTime) {
        nextRAFTime = now + grabluTargetMS;
        callback();
    } else {
        skipRaf(callback);
    }
}

var skipRaf = (callback) => {
    setTimeout(callback, 1);
}


window.enableGrabluExtension = function () {
    window.requestAnimationFrame = mockedRaf;
}

window.disableGrabluExtension = function () {
    window.requestAnimationFrame = raf;
}
`;

var elt = document.createElement("script");
elt.innerHTML = scriptContent;
document.head.appendChild(elt);
