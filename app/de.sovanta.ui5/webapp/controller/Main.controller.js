sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
	"use strict";

	return BaseController.extend("de.sovanta.ui5.controller.Main", {
		sayHello: function () {
			MessageBox.show("Hello World!");
		},

		/**
		 * Navigates to the detail page of the pressed book.
		 * @param {sap.ui.base.Event} oEvent The press event of the list item
		 */
		onBookPress: function (oEvent) {
			const oContext = oEvent.getSource().getBindingContext();
			this.navTo("detail", {
				bookId: oContext.getProperty("ID")
			});
		},

		/**
		 * Navigates to the create page for a new book.
		 */
		onCreatePress: function () {
			this.navTo("create");
		}
	});
});
