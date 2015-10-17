// FRAMESCRIPT
const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

// start - addon functionalities
console.log('ok framescript injected and stopping executions, content:', content);

console.log('docShell', docShell);

var webNavigation = content.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
console.log('webNavigation:', webNavigation);
var rezStop = webNavigation.stop(Ci.nsIWebNavigation.STOP_ALL);

console.error('should have stopped, rezStop:', rezStop);
// end - addon functionalities