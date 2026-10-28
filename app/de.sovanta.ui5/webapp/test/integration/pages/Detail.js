sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/actions/Press", "sap/ui/test/matchers/Properties"], function (Opa5, Press, Properties) {
	"use strict";

	const sViewName = "de.sovanta.ui5.view.Detail";

	Opa5.createPageObjects({
		onTheDetailPage: {
			actions: {
				iPressTheBackButton: function () {
					return this.waitFor({
						id: "detailPage",
						viewName: sViewName,
						actions: new Press({ idSuffix: "navButton" }),
						errorMessage: "Did not find the back button on the detail page"
					});
				}
			},

			assertions: {
				iShouldSeeTheDetailPage: function () {
					return this.waitFor({
						id: "detailPage",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The detail page is shown");
						},
						errorMessage: "The detail page is not shown"
					});
				},

				iShouldSeeTheBook: function (sTitle) {
					return this.waitFor({
						id: "bookHeader",
						viewName: sViewName,
						matchers: new Properties({ title: sTitle }),
						success: function () {
							Opa5.assert.ok(true, "The detail page shows '" + sTitle + "'");
						},
						errorMessage: "The detail page does not show '" + sTitle + "'"
					});
				}
			}
		}
	});
});
