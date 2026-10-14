sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: de.sovanta.ui5",
		defaults: {
			page: "ui5://test-resources/de/sovanta/ui5/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "de/sovanta/ui5/",
				never: "test-resources/de/sovanta/ui5/"
			},
			loader: {
				paths: {
					"de/sovanta/ui5": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for de.sovanta.ui5"
			},
			"integration/opaTests": {
				title: "Integration tests for de.sovanta.ui5"
			}
		}
	};
});
