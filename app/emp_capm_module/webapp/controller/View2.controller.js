sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("empcapmmodule.controller.View2", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("FamilyDetails").attachPatternMatched(this.onObjMatched, this);
            // insted of window.history.go(-1) we can also write the code like below to navigate to the previous page
            // var oHistory = sap.ui.core.routing.History.getInstace();
            // var oPHash = oHistory.getPriorHash();
            // if(oPHash != undefined){
            //     window.history.go(-1);
            // }else{
            //     this.getOwnerComponent().getRouter().navTo("RouteView1",{}, true);
            // }
        },
        onObjMatched(oEvent) {
            var oParameters = oEvent.getParameter("arguments").Id;
            var o = "/empPersonalSet(Id='" + oParameters + "')";
            this.getView().bindElement({
                path: o,
                parameters: {
                    $expand: "famrelation"
                }
            });
        },
    });
});