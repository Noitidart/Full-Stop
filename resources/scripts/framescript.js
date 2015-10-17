// FRAMESCRIPT
const {classes: Cc, interfaces: Ci, results: Cr, utils: Cu} = Components;

// start - addon functionalities
console.log('ok framescript injected and stopping executions, content:', content);

console.log('docShell', docShell);

var webNavigation = content.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
console.log('webNavigation:', webNavigation);
var rezStop = webNavigation.stop(Ci.nsIWebNavigation.STOP_ALL);

console.error('should have stopped, rezStop:', rezStop);


// vars now prevent future server requests
var myWebProgressListener = {
	init: function() {
		var webProgress = docShell.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebProgress);
		webProgress.addProgressListener(this, Ci.nsIWebProgress.NOTIFY_STATE_WINDOW | Ci.nsIWebProgress.NOTIFY_LOCATION);
	},
	uninit: function() {
		if (!docShell) {
			return;
		}
		var webProgress = docShell.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebProgress);
		webProgress.removeProgressListener(this);
	},

	onStateChange: function(webProgress, aRequest, stateFlags, status) {
		console.log('onStateChange:', arguments);
		if (aRequest) {
			aRequest.cancel(Cr.NS_BINDING_ABORTED)
		}
		// var data = {
		// 	requestURL: request.QueryInterface(Ci.nsIChannel).URI.spec,
		// 	windowId: webProgress.DOMWindowID,
		// 	parentWindowId: getParentWindowId(webProgress.DOMWindow),
		// 	status,
		// 	stateFlags,
		// };

		// if (webProgress.DOMWindow.top != webProgress.DOMWindow) {
		// 	// this is a frame element
		// 	var webNav = webProgress.QueryInterface(Ci.nsIWebNavigation);
		// 	if (!webNav.canGoBack) {
		// 		// For some reason we don't fire onLocationChange for the
		// 		// initial navigation of a sub-frame. So we need to simulate
		// 		// it here.
		// 	}
		// }
	},
	onLocationChange: function(webProgress, aRequest, locationURI, flags) {
		console.log('onLocationChange:', arguments);
		if (aRequest) {
			aRequest.cancel(Cr.NS_BINDING_ABORTED)
		}
		// var data = {
		// 	location: locationURI ? locationURI.spec : '',
		// 	windowId: webProgress.DOMWindowID,
		// 	parentWindowId: getParentWindowId(webProgress.DOMWindow),
		// 	flags,
		// };
	},
	QueryInterface: function QueryInterface(aIID) {
		if (aIID.equals(Ci.nsIWebProgressListener) || aIID.equals(Ci.nsISupportsWeakReference) || aIID.equals(Ci.nsISupports)) {
			return this;
		}

		throw Components.results.NS_ERROR_NO_INTERFACE;
	}
};

myWebProgressListener.init();
// end - addon functionalities

// start - common helper functions
function getWindowId(aWindow)
{
	return aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
				  .getInterface(Ci.nsIDOMWindowUtils)
				  .outerWindowID;
}

function getParentWindowId(aWindow) {
	return getWindowId(aWindow.parent);
}
// end - common helper functions