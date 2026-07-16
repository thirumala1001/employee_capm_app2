sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
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
            var oSelectedItem = oEvent.getSource().getSelectedItems()[0].getCells()[0].getText();
            oSelectedItem = Number(oSelectedItem);
            var spath = "/empPersonalSet(empId='" + 1002 + "')";
            var oPath = a.bindContext(spath, null, {
                $expand : "famrelation"
            });
            var obj = await oPath.requestObject();
            console.log(obj);
        }
    });
});