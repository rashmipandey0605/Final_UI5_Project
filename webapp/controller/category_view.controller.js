sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
    function (Controller) {
        "use strict";

        return Controller.extend("finalproject.controller.category_view", {
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                var catData = {
                    "ID": "",
                    "Name": "",
                    "Products": []
                };
                var proData = {
                    "ID": "",
                    "Name": "",
                    "Rating": "",
                    "Price": ""
                };
                var catModel = new sap.ui.model.json.JSONModel(catData);
                var proModel = new sap.ui.model.json.JSONModel(proData);
                this.getOwnerComponent().setModel(catModel, "CategoryModel");
                this.getOwnerComponent().setModel(proModel, "ProductModel");

            },
            _onCreate: function(){
                    if (!this.catFragment) {
                    this.catFragment = sap.ui.xmlfragment(this.getView().getId(),
                        "finalproject.view.create", this);
                    this.getView().addDependent(this.catFragment);
                }
                this.catFragment.open();                

            },
            _onDialogClose: function () {
                this.catFragment.close();
            },
            
            onCatSave: function () {
                var that=this;
                var catData = this.getOwnerComponent().getModel("CategoryModel").getData();
                this.getView().getModel().create("/Categories",catData,{
                    success:function(){
                        that.catFragment.close();
                        that.getOwnerComponent().getModel("CategoryModel").setData({});
                        that.getView().byId("smartTable").rebindTable();
                    }
                })
            },
            onProdSave: function () {
                var proData = this.getOwnerComponent().getModel("ProductModel").getData();
                var catData = this.getOwnerComponent().getModel("CategoryModel").getData();
                catData.Products.push(JSON.parse(JSON.stringify(proData)));
                this.getOwnerComponent().getModel("CategoryModel").setData(catData);
                this.prodFragment.close();
            },

            _onRowNavigate: function (oEvent) {
                var catid = oEvent.mParameters.row.mAggregations.cells[0].mProperties.text;
                this.oRouter.navTo("Routeproduct_view", {
                    CateID: catid
                });
            },

            onAddProduct: function () {
                if (!this.prodFragment) {
                    this.prodFragment = sap.ui.xmlfragment(this.getView().getId(),
                        "finalproject.view.product", this);
                    this.getView().addDependent(this.prodFragment);
                }
                this.prodFragment.open();
            },
            _onProdDialogClose: function () {
                this.prodFragment.close();
            },


            _onProducts: function () {

                this.oRouter.navTo("Routeproduct_view", {
                    CateID: "Null"
                });
            },
           _onDeleteCat:function(){

               var that=this;
                var oTable = this.getView().byId("smartTable").getTable();
                var selectedRows = oTable.getSelectedIndices();
                if(selectedRows.length == 1)
                {
                    var data = oTable.getContextByIndex(selectedRows[0]).getObject();
                this.getView().getModel().remove("/Categories(" +data.ID+ ")",{
                    success:function(){
                        that.getView().getModel().setData({});
                        that.getView().byId("smartTable").rebindTable();
                    }
                })
            }
        }
        });
    });
