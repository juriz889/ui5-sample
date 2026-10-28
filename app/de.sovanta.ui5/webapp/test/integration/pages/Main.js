sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/actions/Press", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/matchers/Properties"], function (
	Opa5,
	Press,
	AggregationFilled,
	Properties
) {
	"use strict";

	const sViewName = "de.sovanta.ui5.view.Main";

	Opa5.createPageObjects({
		onTheMainPage: {
			actions: {
				iPressTheSayHelloButton: function () {
					return this.waitFor({
						id: "helloButton",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the 'Say Hello With Dialog' button on the App view"
					});
				},

				iPressTheOkButtonInTheDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Button",
						searchOpenDialogs: true,
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the 'OK' button in the Dialog"
					});
				},

				iPressOnTheBook: function (sTitle) {
					return this.waitFor({
						controlType: "sap.m.ObjectIdentifier",
						viewName: sViewName,
						matchers: new Properties({ title: sTitle }),
						actions: new Press(),
						errorMessage: "Did not find the book '" + sTitle + "' in the table"
					});
				},

				iPressTheCreateButton: function () {
					return this.waitFor({
						id: "createButton",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the 'Create' button"
					});
				}
			},

			assertions: {
				iShouldSeeTheHelloDialog: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						success: function () {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(true, "The dialog is open");
						},
						errorMessage: "Did not find the dialog control"
					});
				},

				iShouldNotSeeTheHelloDialog: function () {
					return this.waitFor({
						controlType: "sap.m.App", // dummy, I just want a check function, where I can search the DOM. Probably there is a better way for a NEGATIVE test (NO dialog).
						check: function () {
							return document.querySelectorAll(".sapMDialog").length === 0;
						},
						success: function () {
							Opa5.assert.ok(true, "No dialog is open");
						}
					});
				},

				iShouldSeeTheBooksTable: function () {
					return this.waitFor({
						id: "booksTable",
						viewName: sViewName,
						matchers: new AggregationFilled({ name: "items" }),
						success: function () {
							Opa5.assert.ok(true, "The table shows books");
						},
						errorMessage: "The books table is not shown or has no items"
					});
				}
			}
		}
	});
});
