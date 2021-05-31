sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
        "use strict";
        var fragmentLoad;

		return Controller.extend("smarttable.controller.product_view", {
			onInit: function () {
                this.getOwnerComponent().getModel().setDefaultBindingMode("TwoWay");
                this.orouter = this.getOwnerComponent().getRouter();
                this.orouter.getRoute("Routeproduct_view").attachPatternMatched(null,function(oEvent){
                    this.categoryID= oEvent.mParameters.arguments.CateID;
                    this.getView().byId("smartTable").rebindTable();   
                },this);


            },
            OnBeforeRebindTable: function(oEvent){
                if(this.categoryID && this.categoryID!="Null"){
                    var binding = oEvent.getParameter("bindingParams");
                    var ofilter = new sap.ui.model.Filter({
                        path: "Category/ID",
                        operator: sap.ui.model.FilterOperator.EQ,
                        value1: this.categoryID
                    });
                    binding.filters.push(ofilter);
                }

            },
            _onUpdate: function()
            {
                var that=this;
                var oTable = this.getView().byId("smartTable").getTable();
                var selectedRows = oTable.getSelectedIndices();
                if(selectedRows.length == 1)
                {
                    var data = oTable.getContextByIndex(selectedRows[0]).getObject();
                    this.getOwnerComponent().getModel().update("/Products(" +data.ID + ")",data, {
                        success:function()
                        {
                        that.getOwnerComponent().getModel("ProductModel").setData({});
                        that.getView().byId("smartTable").rebindTable();
                            sap.m.MessageToast.show("Data updated successfully");
                        },
                        error:function()
                        {
                            sap.m.MessageToast.show("Data update is not successful");
                        }
                        
                    });
                }
                else
                sap.m.MessageToast.show("Data updation possible only for single index");
            },
            _onDeleteProd:function(){

                var that=this;
                var oTable = this.getView().byId("smartTable").getTable();
                var selectedRows = oTable.getSelectedIndices();
                if(selectedRows.length == 1)
                {
                    var data = oTable.getContextByIndex(selectedRows[0]).getObject();
                this.getView().getModel().remove("/Products(" +data.ID+ ")",{
                    success:function(){
                        that.getOwnerComponent().getModel("ProductModel").setData({});
                        that.getView().byId("smartTable").rebindTable();
                            sap.m.MessageToast.show("Data deleted successfully");
                    },
                    error:function()
                        {
                            sap.m.MessageToast.show("Data deletion is not successful");
                        }
                })
            }
        },

            _onAddProd:function(){
                if (!this.addProdFragment) {
                    this.addProdFragment = sap.ui.xmlfragment(this.getView().getId(),
                        "finalproject.view.product", this);
                    this.getView().addDependent(this.addProdFragment);
                }
                this.addProdFragment.open();

            },
            _onProdDialogClose: function () {
                this.addProdFragment.close();
            },
            onProdSave: function () {        
                
                var that=this;
                var proData = this.getOwnerComponent().getModel("ProductModel").getData();
                this.getView().getModel().create("/Products",proData,{
                    success:function(){
                        that.addProdFragment.close();
                        that.getOwnerComponent().getModel("ProductModel").setData({});
                        that.getView().byId("smartTable").rebindTable();
                    }
                })
            
            },
            
           
		});
	});
