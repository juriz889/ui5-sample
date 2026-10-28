sap.ui.define(["sap/ui/test/Opa5", "./HelloJourney", "./NavigationJourney", "./CreateJourney"], function (Opa5) {
	"use strict";

	// wait for pending requests, timeouts and rendering before each action/assertion
	Opa5.extendConfig({
		autoWait: true
	});
});
