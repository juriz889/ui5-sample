sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/actions/Press", "sap/ui/test/actions/EnterText", "sap/ui/test/matchers/Properties"], function (
	Opa5,
	Press,
	EnterText,
	Properties
) {
	"use strict";

	const sViewName = "de.sovanta.ui5.view.Create";

	Opa5.createPageObjects({
		onTheCreatePage: {
			actions: {
				iEnterTheTitle: function (sTitle) {
					return this.waitFor({
						id: "titleInput",
						viewName: sViewName,
						actions: new EnterText({ text: sTitle }),
						errorMessage: "Did not find the title input"
					});
				},

				iSelectTheAuthor: function (sName) {
					return this.waitFor({
						id: "authorInput",
						viewName: sViewName,
						actions: new Press({ idSuffix: "arrow" }),
						success: function () {
							this.waitFor({
								controlType: "sap.m.StandardListItem",
								searchOpenDialogs: true,
								matchers: new Properties({ title: sName }),
								actions: new Press(),
								errorMessage: "Did not find the author '" + sName + "' in the list"
							});
						},
						errorMessage: "Did not find the author combo box"
					});
				},

				iEnterTheStock: function (sStock) {
					return this.waitFor({
						id: "stockInput",
						viewName: sViewName,
						// the value is bound in the controller once the metadata is loaded
						matchers: (oInput) => !!oInput.getBinding("value"),
						actions: new EnterText({ text: sStock }),
						errorMessage: "Did not find the bound stock input"
					});
				},

				iPressSave: function () {
					return this.waitFor({
						id: "saveButton",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the 'Save' button"
					});
				},

				iPressCancel: function () {
					return this.waitFor({
						id: "cancelButton",
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Did not find the 'Cancel' button"
					});
				}
			},

			assertions: {
				iShouldSeeTheCreatePage: function () {
					return this.waitFor({
						id: "createPage",
						viewName: sViewName,
						success: function () {
							Opa5.assert.ok(true, "The create page is shown");
						},
						errorMessage: "The create page is not shown"
					});
				},

				iShouldSeeTheStockValueState: function (sValueState) {
					return this.waitFor({
						id: "stockInput",
						viewName: sViewName,
						matchers: new Properties({ valueState: sValueState }),
						success: function () {
							Opa5.assert.ok(true, "The stock input has value state " + sValueState);
						},
						errorMessage: "The stock input does not have value state " + sValueState
					});
				},

				iShouldSeeTheMessagePopover: function () {
					return this.waitFor({
						id: "messagePopover",
						viewName: sViewName,
						matchers: (oPopover) => oPopover.isOpen(),
						success: function () {
							Opa5.assert.ok(true, "The message popover is open");
						},
						errorMessage: "The message popover is not open"
					});
				}
			}
		}
	});
});
