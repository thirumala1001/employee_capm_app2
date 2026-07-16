sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("empcapmmodule.controller.View2", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("FamilyDetails").attachPatternMatched(this.onObjMatched, this);
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