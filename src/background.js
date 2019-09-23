let mainPort;

function connected(port) {
  mainPort = port;
  mainPort.onMessage.addListener(function(message) {
    console.log(`Recieved response from connection script: ${message}`);
  });
}

browser.runtime.onConnect.addListener(connected);

browser.commands.onCommand.addListener(function(command) {
    mainPort.postMessage(command)
});