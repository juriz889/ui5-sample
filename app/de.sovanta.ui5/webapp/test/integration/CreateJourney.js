/* global QUnit */
sap.ui.define(["sap/ui/test/opaQunit", "./pages/Main", "./pages/Detail", "./pages/Create"], function (opaTest) {
	"use strict";

	QUnit.module("Create Journey");

	opaTest("Should create a book and open its detail page", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "de.sovanta.ui5"
			}
		});

		// Actions
		When.onTheMainPage.iPressTheCreateButton();
		Then.onTheCreatePage.iShouldSeeTheCreatePage();
		When.onTheCreatePage.iEnterTheTitle("OPA Test Book");
		When.onTheCreatePage.iSelectTheAuthor("Emily Brontë");
		When.onTheCreatePage.iEnterTheStock("5");
		When.onTheCreatePage.iPressSave();

		// Assertions
		// the catalog mock data does not know books created via the admin mock service, so only the page is checked
		Then.onTheDetailPage.iShouldSeeTheDetailPage();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should discard the book on cancel", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "de.sovanta.ui5"
			}
		});

		// Actions
		When.onTheMainPage.iPressTheCreateButton();
		When.onTheCreatePage.iEnterTheTitle("Discarded Book");
		When.onTheCreatePage.iPressCancel();

		// Assertions
		Then.onTheMainPage.iShouldSeeTheBooksTable();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should show an error for a stock outside the annotated range", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "de.sovanta.ui5"
			},
			hash: "books/new"
		});

		// Actions
		When.onTheCreatePage.iEnterTheTitle("Out of Range");
		When.onTheCreatePage.iSelectTheAuthor("Emily Brontë");
		When.onTheCreatePage.iEnterTheStock("10001");

		// Assertions
		Then.onTheCreatePage.iShouldSeeTheStockValueState("Error");

		// Actions
		When.onTheCreatePage.iPressSave();

		// Assertions
		Then.onTheCreatePage.iShouldSeeTheMessagePopover();

		// Actions
		When.onTheCreatePage.iEnterTheStock("10000");

		// Assertions
		Then.onTheCreatePage.iShouldSeeTheStockValueState("None");

		// Cleanup
		Then.iTeardownMyApp();
	});
});
