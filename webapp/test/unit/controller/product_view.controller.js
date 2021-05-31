/*global QUnit*/

sap.ui.define([
	"final_project/controller/product_view.controller"
], function (Controller) {
	"use strict";

	QUnit.module("product_view Controller");

	QUnit.test("I should test the product_view controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
