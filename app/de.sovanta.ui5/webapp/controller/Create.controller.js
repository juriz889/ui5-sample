sap.ui.define([
	"./BaseController",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Element",
	"sap/ui/core/Messaging",
	"sap/ui/model/type/Integer"
], function (BaseController, MessageBox, MessageToast, Element, Messaging, Integer) {
	"use strict";

	const sGroupId = "bookCreate";

	return BaseController.extend("de.sovanta.ui5.controller.Create", {
		onInit: function () {
			this._oListBinding = this.getOwnerComponent()
				.getModel("admin")
				.bindList("/Books", undefined, undefined, undefined, {
					$$updateGroupId: sGroupId
				});
			// fired for every response to the POST, successful or not
			this._oListBinding.attachCreateCompleted(this._onCreateCompleted, this);
			// backend and validation messages are collected centrally and shown in the message popover
			this.setModel(Messaging.getMessageModel(), "message");
			this._bindStock();
			this.getRouter().getRoute("create").attachPatternMatched(this._onRouteMatched, this);
		},

		/**
		 * Binds the stock input with the range annotated in CDS (@assert.range), which CAP exposes as
		 * Validation.Minimum/Maximum. The V4 model only applies these to Edm.Decimal, not to Edm.Int32,
		 * so the simple Integer type with minimum/maximum constraints is used instead.
		 */
		_bindStock: async function () {
			const oMetaModel = this.getOwnerComponent().getModel("admin").getMetaModel();
			const [iMinimum, iMaximum] = await Promise.all([
				oMetaModel.requestObject("/Books/stock@Org.OData.Validation.V1.Minimum"),
				oMetaModel.requestObject("/Books/stock@Org.OData.Validation.V1.Maximum")
			]);
			this.byId("stockInput").bindValue({
				path: "admin>stock",
				// emptyString: null lets the user clear the field instead of getting a parse error
				type: new Integer({ emptyString: null }, { minimum: iMinimum, maximum: iMaximum })
			});
		},

		/**
		 * Creates a new transient book and binds the view to it.
		 */
		_onRouteMatched: function () {
			this._discardBook();
			const oContext = this._oListBinding.create({});
			// rejects when the new book is discarded, which needs no handling
			oContext.created().catch(() => {});
			this.getView().setBindingContext(oContext, "admin");
		},

		/**
		 * Sends the new book to the backend; the outcome is handled in _onCreateCompleted.
		 */
		onSave: async function () {
			const oResourceBundle = await this.getResourceBundle();
			const oContext = this.getView().getBindingContext("admin");
			if (!oContext.getProperty("title") || !oContext.getProperty("author_ID")) {
				MessageBox.error(oResourceBundle.getText("createMissingFields"));
				return;
			}
			// invalid input (e.g. text in a number field) is not written to the model, so don't send the stale value
			if (this._getInputMessages().length) {
				this._openMessagePopover();
				return;
			}

			// backend messages of a previous attempt are replaced by the model with the new response
			this.getModel("admin").submitBatch(sGroupId);
		},

		/**
		 * Opens the detail page of the new book, or the message popover if the POST failed.
		 * @param {sap.ui.base.Event} oEvent The createCompleted event of the list binding
		 */
		_onCreateCompleted: async function (oEvent) {
			if (!oEvent.getParameter("success")) {
				// the book stays transient, so Save can simply be pressed again after fixing the input
				this._openMessagePopover();
				return;
			}

			const oContext = oEvent.getParameter("context");
			// resolves once the created book is fully available, including its key
			await oContext.created();

			this._removeMessages(oContext);
			const oResourceBundle = await this.getResourceBundle();
			MessageToast.show(oResourceBundle.getText("createSuccess", [oContext.getProperty("title")]));
			this.navTo("detail", { bookId: oContext.getProperty("ID") }, true);
		},

		/**
		 * Discards the new book and navigates back.
		 */
		onCancel: function () {
			this._discardBook();
			this.onNavBack();
		},

		onMessageButtonPress: function () {
			this._openMessagePopover();
		},

		/**
		 * Focuses the input field a message belongs to.
		 * @param {sap.ui.base.Event} oEvent The activeTitlePress event of the message popover
		 */
		onMessageActiveTitlePress: function (oEvent) {
			const oMessage = oEvent.getParameter("item").getBindingContext("message").getObject();
			Element.getElementById(oMessage.getControlIds()[0])?.focus();
		},

		_openMessagePopover: function () {
			this.byId("messagePopover").openBy(this.byId("messageButton"));
		},

		_discardBook: function () {
			const oContext = this.getView().getBindingContext("admin");
			if (!oContext) {
				return;
			}
			// read the messages before deleting, as they are looked up by the context's path
			this._removeMessages(oContext);
			if (oContext.isTransient()) {
				oContext.delete();
			}
			this.getView().setBindingContext(null, "admin");
		},

		/**
		 * Returns the validation messages of this page's input fields, e.g. for text in a number field.
		 * They are created by Messaging itself and target the control, not the model.
		 * @returns {sap.ui.core.message.Message[]} The messages
		 */
		_getInputMessages: function () {
			const sIdPrefix = this.getView().getId() + "--";
			// backend messages for bound fields carry control IDs too, so check isValidation as well
			return Messaging.getMessages().filter(
				(oMessage) => oMessage.isValidation() && oMessage.getControlIds().some((sId) => sId.startsWith(sIdPrefix))
			);
		},

		/**
		 * Removes the backend messages of the given book and the validation messages of the input fields.
		 * Backend messages without a target are not associated with the book and therefore kept.
		 * @param {sap.ui.model.odata.v4.Context} oContext The book's context
		 */
		_removeMessages: function (oContext) {
			Messaging.removeMessages([...oContext.getMessages(), ...this._getInputMessages()]);
		}
	});
});
