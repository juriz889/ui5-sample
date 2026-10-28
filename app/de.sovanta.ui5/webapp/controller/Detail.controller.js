sap.ui.define(["./BaseController"], function (BaseController) {
	"use strict";

	return BaseController.extend("de.sovanta.ui5.controller.Detail", {
		onInit: function () {
			this.getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);
		},

		/**
		 * Binds the view to the book given in the route.
		 * @param {sap.ui.base.Event} oEvent The patternMatched event
		 */
		_onRouteMatched: function (oEvent) {
			const sBookId = oEvent.getParameter("arguments").bookId;
			this.getView().bindElement("/Books(" + sBookId + ")");
		}
	});
});
