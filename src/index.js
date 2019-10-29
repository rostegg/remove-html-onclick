const eventHandler = (document.body || document.documentElement);
// cursor image - https://www.flaticon.com/authors/those-icons
const cursorIconUrl = browser.runtime.getURL('icons/cursor.png');

let removedObjects = [];

const mainPort = browser.runtime.connect({name:"main-port"});

class RemovedObjectMetadata {
  constructor(target, parent, sibling) {
    this.target = target;
    this.parent = parent;
    this.sibling = sibling;
  }
}

mainPort.onMessage.addListener(function(message) {
  switch (message) {
    case "enable-remove-mode": 
      enableRemoveMode();
      break;
    case "disable-remove-mode":
      disableRemoveMode();
      break;
    case "restore-from-cache":
      restoreFromCache();
      break;
    case "enable-scrolling":
      enablePageScrolling();
      break;
    default:
        mainPort.postMessage("Unknown command")
  }
});

function enableRemoveMode() {
  eventHandler.addEventListener('click', onClickEventHandler, true);
  eventHandler.style.cursor = `url('${cursorIconUrl}'), pointer`;
}

function disableRemoveMode() {
  eventHandler.removeEventListener('click', onClickEventHandler, true);
  eventHandler.style.cursor = `default`;
}

function restoreFromCache() {
  const elem = removedObjects.pop();
  // if sibling eq null, insert at the end
  elem && elem.parent.insertBefore(elem.target, elem.sibling);
}

function enablePageScrolling() {
  eventHandler.style.overflow = "visible";
}

function onClickEventHandler(event) {
  event = event || window.event;
  let target = event.target || event.srcElement,
    parent = target.parentElement,
    sibling = target.nextSibling;
  removedObjects.push(new RemovedObjectMetadata(target,parent,sibling));
  target.remove();
  // stop propagation for click events
  event.stopPropagation();
  event.preventDefault();
}
