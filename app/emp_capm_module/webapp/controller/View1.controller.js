sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("empcapmmodule.controller.View1", {
        onInit() {
            var oModel = this.getOwnerComponent().getModel();
            this.getView().setModel(oModel, "empModel");
            var oTable = this.getView().byId("idemptable");
            var oBinding = oTable.getBinding("items");
            // var oFilter = [
            //     new sap.ui.model.Filter("empService", sap.ui.model.FilterOperator.EQ, "SERVICE")
            // ];
            // oBinding.filter(oFilter);

            var oSorter = new sap.ui.model.Sorter("empDateOfJoining", true);
            oBinding.sort(oSorter);
            // this.onDateFormatChange();
        },
        onDateFormatChange(dateValue){
            let oDate = new Date(dateValue);
            return oDate.toLocaleDateString('en-GB');
        },
        onDateOfBirthFormatChange(oDateValue){
            let oValue = sap.ui.core.format.DateFormat.getDateInstance({
                pattern : 'dd/MM/yyyy'
            });
            return oValue.format(new Date(oDateValue));
        },
        async onSelectItemPress(oEvent){
            var a = this.getView().getModel("empModel");
            // var oTableId = this.getView().byId("idemptable");
            var oSelectedItem = oEvent.getParameter("listItem").getBindingContext("empModel");
            var spath = oSelectedItem.getProperty("Id");
            // oSelectedItem.setProperty("IsActiveEntity") = false;
            var opath = "/empPersonalSet(Id='" + spath + "')";
            var rPath = a.bindContext(opath, null, {
                $expand : "famrelation"
            });
            var obj = await rPath.requestObject();
            // console.log(obj);
            if(obj.famrelation.length > 0){
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "empFamilyModel");
                this.oDialogOpen();
            }
            else{
                MessageBox.information("No Family Details Found for the Selected Employee");
            }
            
        },
        oDialogOpen(){
            this.getView().byId("idMainDialog").open();
        },
        onClickCloseDialog(){
            this.getView().byId("idMainDialog").close();
        },
        OnLineItemPress(oEvent){
            var o = oEvent.getSource().getBindingContext("empModel").getObject();
            this.getOwnerComponent().getRouter().navTo("FamilyDetails", {
                Id: o.Id
            });
        },
    });
});