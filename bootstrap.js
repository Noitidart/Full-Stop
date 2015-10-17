// Imports
const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource:///modules/CustomizableUI.jsm');

// Globals
const core = {
	addon: {
		name: 'Full-Stop',
		id: 'Full-Stop@jetpack',
		path: {
			name: 'fullstop',
			content: 'chrome://fullstop/content/',
			images: 'chrome://fullstop/content/resources/images/',
			locale: 'chrome://fullstop/locale/',
			resources: 'chrome://fullstop/content/resources/',
			scripts: 'chrome://fullstop/content/resources/scripts/',
			styles: 'chrome://fullstop/content/resources/styles/',
		},
		cache_key: Math.random() // set to version on release
	},
	// os: {
	// 	name: OS.Constants.Sys.Name.toLowerCase(),
	// 	toolkit: Services.appinfo.widgetToolkit.toLowerCase(),
	// 	xpcomabi: Services.appinfo.XPCOMABI
	// },
	// firefox: {
	// 	pid: Services.appinfo.processID,
	// 	version: Services.appinfo.version
	// }
};

const cui_cssUri = Services.io.newURI(core.addon.path.styles + 'cui.css', null, null);

// Lazy Imports
const myServices = {};
XPCOMUtils.defineLazyGetter(myServices, 'sb', function () { return Services.strings.createBundle(core.addon.path.locale + 'bootstrap.properties?' + core.addon.cache_key); /* Randomize URI during development to avoid caching - bug 719376 */ });

// START - Addon Functionalities					
var myWidgetListener = {
	onWidgetAfterDOMChange: function(aNode, aNextNode, aContainer, aWasRemoval) {
		if (aNode.id != 'cui_fullstop') {
			return;
		}
		console.log('onWidgetAfterDOMChange:', arguments);
		var aDOMWindow = aNode.ownerDocument.defaultView;
		var domWinUtils = aDOMWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
		if (aWasRemoval) {
			// remove css
			console.log('remove css');			
			domWinUtils.removeSheet(cui_cssUri, domWinUtils.AUTHOR_SHEET);
		} else {
			// add css
			console.log('add css');
			domWinUtils.loadSheet(cui_cssUri, domWinUtils.AUTHOR_SHEET);
		}
	},
	onWidgetDestroyed: function(aWidgetId) {
		console.log('a widget destroyed so removing listener, arguments:', arguments);
		if (aWidgetId != 'cui_fullstop') {
			return
		}
		console.log('my widget destoryed');
		CustomizableUI.removeListener(myWidgetListener);
	}
};
// END - Addon Functionalities

function install() {}

function uninstall(aData, aReason) {
	if (aReason == ADDON_UNINSTALL) {
		// delete prefs
	}
}

function startup(aData, aReason) {
	// core.addon.aData = aData;
	// extendCore();
	
	CustomizableUI.addListener(myWidgetListener);
	CustomizableUI.createWidget({
		id: 'cui_fullstop',
		defaultArea: CustomizableUI.AREA_NAVBAR,
		label: myServices.sb.GetStringFromName('cui_fullstop_lbl'),
		tooltiptext: myServices.sb.GetStringFromName('cui_fullstop_tip'),
		onCommand: function(aEvent) {
			var aDOMWin = aEvent.target.ownerDocument.defaultView;
			console.log('ok button clicked load framescript into current tab');
			
			var browserMM = aDOMWin.gBrowser.selectedBrowser.messageManager;
			browserMM.loadFrameScript(core.addon.path.scripts + 'framescript.js?' + core.addon.cache_key, false);
		}
	});
	
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) { return }
	
	CustomizableUI.destroyWidget('cui_fullstop');
}