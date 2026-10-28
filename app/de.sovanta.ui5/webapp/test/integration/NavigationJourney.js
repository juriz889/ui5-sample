/* global QUnit */
sap.ui.define(["sap/ui/test/opaQunit", "./pages/Main", "./pages/Detail"], function (opaTest) {
	"use strict";

	QUnit.module("Navigation Journey");

	opaTest("Should open the detail page of a book and navigate back", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "de.sovanta.ui5"
			}
		});
		Then.onTheMainPage.iShouldSeeTheBooksTable();

		// Actions
		When.onTheMainPage.iPressOnTheBook("Jane Eyre");

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheBook("Jane Eyre");

		// Actions
		When.onTheDetailPage.iPressTheBackButton();

		// Assertions
		Then.onTheMainPage.iShouldSeeTheBooksTable();

		// Cleanup
		Then.iTeardownMyApp();
	});
});
