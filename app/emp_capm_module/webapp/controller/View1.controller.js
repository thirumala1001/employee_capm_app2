sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("empcapmmodule.controller.View1", {
        onInit() {
            var oFamliyData = {
                familyRelation: [
                    {
                        empId: "",
                        relation: "",
                        familyMemberName: "",
                        familyMemberAge: ""
                    }
                ]
            }
            var oFamilyModel = new sap.ui.model.json.JSONModel(oFamliyData);
            this.getView().setModel(oFamilyModel, "oFamilyModel");
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
        onDateFormatChange(dateValue) {
            let oDate = new Date(dateValue);
            return oDate.toLocaleDateString('en-GB');
        },
        onDateOfBirthFormatChange(oDateValue) {
            let oValue = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: 'dd/MM/yyyy'
            });
            return oValue.format(new Date(oDateValue));
        },
        async onSelectItemPress(oEvent) {
            var a = this.getView().getModel("empModel");
            // var oTableId = this.getView().byId("idemptable");
            var oSelectedItem = oEvent.getParameter("listItem").getBindingContext("empModel");
            var spath = oSelectedItem.getProperty("Id");
            // oSelectedItem.setProperty("IsActiveEntity") = false;
            var opath = "/empPersonalSet(Id='" + spath + "')";
            var rPath = a.bindContext(opath, null, {
                $expand: "famrelation"
            });
            var obj = await rPath.requestObject();
            // console.log(obj);
            if (obj.famrelation.length > 0) {
                this.getView().setModel(new sap.ui.model.json.JSONModel(obj), "empFamilyModel");
                this.oDialogOpen();
            }
            else {
                MessageBox.information("No Family Details Found for the Selected Employee");
            }

        },
        oDialogOpen() {
            this.getView().byId("idMainDialog").open();
        },
        onClickCloseDialog() {
            this.getView().byId("idMainDialog").close();
        },
        OnLineItemPress(oEvent) {
            var o = oEvent.getSource().getBindingContext("empModel").getObject();
            this.getOwnerComponent().getRouter().navTo("FamilyDetails", {
                Id: o.Id
            });
        },
        onClickAddNewEmployee(oEvent) {
            // if(oEvent.getSource().getText() == "Add New Employee"){
            this.oText = oEvent.getSource().getText();
            this.getView().byId("idAddNewEmployeeDialog").open();
            // }else{

            //     this.getView().byId("idAddNewEmployeeDialog").open();
            //     this.onClickSubmitBatch();
            // }
        },
        async onClickAddEmployee() {
            if (this.oText == "Add New Employee") {
                var oView = this.getView();
                var sUpdateGroupId = "empcrudcapm";
                var oNewEmployee = {
                    empId: oView.byId("idEmployeeId").getValue(),
                    empFirstName: oView.byId("idFirstName").getValue(),
                    empLastName: oView.byId("idLastName").getValue(),
                    empEmail: oView.byId("idEmail").getValue(),
                    empPhoneNumber: oView.byId("idContactNumber").getValue(),
                    empDateOfBirth: oView.byId("idDateOfBirth").getDateValue().toISOString(),
                    empDateOfJoining: oView.byId("idJoinDate").getDateValue().toISOString(),
                    empService: oView.byId("idService").getSelectedKey(),
                    empgender: oView.byId("idGender").getSelectedKey()
                };
                // console.log(oNewEmployee);
                var oModel = this.getView().getModel("empModel");

                var oTable = this.getView().byId("idemptable");
                var oBinding = oTable.getBinding("items");
                oBinding.create(oNewEmployee);
                await oModel.submitBatch(sUpdateGroupId).then(s => {
                    MessageBox.success("Employee Added Successfully");
                    oBinding.refresh();
                    this._onClearData();
                }).catch(error => {
                    MessageBox.error("Error Adding Employee: " + error.message);
                    this.getView().byId("idAddNewEmployeeDialog").close();
                })
            } else if (this.oText == "Add Family Data") {
                this.onClickSubmitBatch();
            } else {
                MessageBox.information("Please select an action to perform.");
            }
        },
        onClickCloseDialog() {
            this.getView().byId("idAddNewEmployeeDialog").close();
        },
        _onClearData() {
            var oView = this.getView();
            oView.byId("idEmployeeId").setValue();
            oView.byId("idFirstName").setValue();
            oView.byId("idLastName").setValue();
            oView.byId("idEmail").setValue();
            oView.byId("idContactNumber").setValue();
            oView.byId("idDateOfBirth").setValue();
            oView.byId("idJoinDate").setValue();
            oView.byId("idService").setSelectedKey();
            oView.byId("idGender").setSelectedKey();
            oView.byId("idAddNewEmployeeDialog").close();
            if(this.oText == "Add Family Data"){
                this.getView().getModel("oFamilyModel").setData({familyRelation : []});
            }
        },
        onClickOpenDialog(oEvent) {
            var oTable = this.getView().byId("idemptable");
            var oSelectedItem = oTable.getSelectedItem();
            if (oSelectedItem) {
                var oContext = oSelectedItem.getBindingContext("empModel");
                var oData = oContext.getObject();
                this.getView().byId("idDelEmployeeId").setValue(oData.empId);
                this.getView().byId("idDelFirstName").setValue(oData.empFirstName);
                this.getView().byId("idDelLastName").setValue(oData.empLastName);
                this.getView().byId("idDelEmail").setValue(oData.empEmail);
                this.getView().byId("idDelContactNumber").setValue(oData.empPhoneNumber);
                this.getView().byId("idDelDateOfBirth").setDateValue(new Date(oData.empDateOfBirth));
                this.getView().byId("idDelJoinDate").setDateValue(new Date(oData.empDateOfJoining));
                this.getView().byId("idDelService").setSelectedKey(oData.empService);
                this.getView().byId("idDelGender").setSelectedKey(oData.empgender);
                this.getView().byId("idUpdateEmployeeDialog").open();
            } else {
                MessageBox.information("Please select an employee to update.");
            }
        },
        onClickUpdateEmployee(oEvent) {
            var oView = this.getView();
            var oTable = this.getView().byId("idemptable");
            var oSelectedItem = oTable.getSelectedItem();
            var oModel = this.getView().getModel("empModel");
            var sUpdateGroupId = "empcrudcapm";
            if (!oSelectedItem) {
                return MessageBox.information("Please select an employee to update.");
            }
            var oContext = oSelectedItem.getBindingContext("empModel");
            oContext.setProperty("empId", this.getView().byId("idDelEmployeeId").getValue());
            oContext.setProperty("empFirstName", this.getView().byId("idDelFirstName").getValue());
            oContext.setProperty("empLastName", this.getView().byId("idDelLastName").getValue());
            oContext.setProperty("empEmail", this.getView().byId("idDelEmail").getValue());
            oContext.setProperty("empPhoneNumber", this.getView().byId("idDelContactNumber").getValue());
            oContext.setProperty("empDateOfBirth", this.getView().byId("idDelDateOfBirth").getDateValue().toISOString());
            oContext.setProperty("empDateOfJoining", this.getView().byId("idDelJoinDate").getDateValue().toISOString());
            oContext.setProperty("empService", this.getView().byId("idDelService").getSelectedKey());
            oContext.setProperty("empgender", this.getView().byId("idDelGender").getSelectedKey());
            oModel.submitBatch(sUpdateGroupId).then(u => {
                MessageBox.success("Employee Updated Successfully");
                oContext.refresh();
                oView.byId("idDelEmployeeId").setValue();
                oView.byId("idDelFirstName").setValue();
                oView.byId("idDelLastName").setValue();
                oView.byId("idDelEmail").setValue();
                oView.byId("idDelContactNumber").setValue();
                oView.byId("idDelDateOfBirth").setValue();
                oView.byId("idDelJoinDate").setValue();
                oView.byId("idDelService").setSelectedKey();
                oView.byId("idDelGender").setSelectedKey();
                this.getView().byId("idUpdateEmployeeDialog").close();
            }).catch(error => {
                MessageBox.error("Error Updating Employee: " + error.message);
                this.getView().byId("idUpdateEmployeeDialog").close();
            });
        },
        onClickUpdateDialog() {
            this.getView().byId("idUpdateEmployeeDialog").close();
        },
        onClickOpenDeleteDialog() {
            var oModel = this.getView().getModel("empModel");
            var sGroupId = "empcrudcapm";
            var oTable = this.getView().byId("idemptable");
            var oSelectedItem = oTable.getSelectedItem();
            if (!oSelectedItem) {
                return MessageBox.information("Please select an employee to delete.");
            }
            else {
                var oCtx = oSelectedItem.getBindingContext("empModel");
                sap.m.MessageBox.confirm("Are you sure you want to delete this employee?", {
                    actions: [sap.m.MessageBox.Action.DELETE, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.DELETE,
                    onClose: (sAction => {
                        if (sAction != sap.m.MessageBox.Action.DELETE) {
                            return sap.m.MessageBox.information("Employee Deletion Cancelled");
                        }
                        try {
                            oCtx.delete(sGroupId);
                            oModel.submitBatch(sGroupId);
                        } catch (error) {
                            MessageBox.error("Error While Deleting The Employee: " + " " + error.message || "Error Occured While Deleting The Employee");
                        }
                    })
                }
                )

            }
        },
        _onBatchUpdate() {
            var otable = this.getView().byId("idemptable");
            var oBinding = otable.getBinding("items");
            var oDummyModel = this.getView().getModel("empModel");
            var sGroupid = "empcrudcapm";

            var sEmpObj1 = {
                empId: 1022,
                empFirstName: "Bharath",
                empLastName: "Kumar",
                empEmail: "bharathkumar@gmail.com",
                empPhoneNumber: "9874563210",
                empDateOfBirth: "1992-05-15T00:00:00Z",
                empDateOfJoining: "2014-05-15T00:00:00Z",
                empService: "RETIRED",
                empgender: "MALE"
            }

            var sEmpObj2 = {
                empId: 1023,
                empFirstName: "Rani",
                empLastName: "Kumari",
                empEmail: "kumari.rani@gmail.com",
                empPhoneNumber: "8745632109",
                empDateOfBirth: "1998-05-15T00:00:00Z",
                empDateOfJoining: "2020-02-15T00:00:00Z",
                empService: "ACTIVE",
                empgender: "FEMALE"
            }

            oBinding.create(sEmpObj1, {
                groupId: sGroupid
            });
            oBinding.create(sEmpObj2, {
                groupId: sGroupid
            });
            oDummyModel.submitBatch(sGroupid).then(s => {
                sap.m.MessageToast.show("Batch Update Successful");
                oBinding.refresh();
            }).catch(err => {
                sap.m.MessageBox.error("Error While Performing Batch Update: " + err.message || "Error Occured While Performing Batch Update");
            })
        },

        // fragment code for attachment dialog
        onRequestPress: function (oEvent) {
            var oRowData = oEvent.getSource().getBindingContext().getObject();

            if (!this._oAttachmentDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "sample.fragment.IdDetails",
                    controller: this
                }).then(function (oDialog) {
                    this._oAttachmentDialog = oDialog;
                    this.getView().addDependent(oDialog);
                    this._bindFragmentModel(oRowData);
                    oDialog.open();
                }.bind(this));
            } else {
                this._bindFragmentModel(oRowData);
                this._oAttachmentDialog.open();
            }
        },

        _bindFragmentModel: function (oRowData) {
            var oFragmentData = {
                RequestID: oRowData.RequestID,
                Source: "Ariba",
                POType: "Standard",
                VendorCode: oRowData.VendorCode,
                VendorName: oRowData.VendorName,
                Currency: oRowData.Currency,

                Invoice: {
                    InvoiceNo: oRowData.InvoiceNo,
                    InvoiceDate: oRowData.InvoiceDate,
                    InvoiceSubmission: oRowData.InvSubmissionDate,
                    InvoiceValue: oRowData.InvoiceValue,
                    TotalTax: "1500",
                    BaseValue: "13500"
                },

                POItems: []
            };

            this._oAttachmentDialog.setModel(new JSONModel(oFragmentData));
        },

        //save event Employee Dialog Code
        oSavedata() {
            var oModel = this.getView().getModel("empModel");  // main table Model
            var oCreatedmodel = this.getView().getModel("empCreatedModel"); // created model for fragment
            var sGroupid = "empcrudcapm";
            var oPayload = structuredClone(oCreatedmodel.getProperty("/empfragmentModel")); // fragment model entity
            try {
                var oListBinding = oModel.bindList("/empPersonalSet");
                var oCtx = oListBinding.create(oPayload, { groupId: sGroupid });
                oModel.submitBatch(sGroupid);
                oCtx.created();
                this._CloseDialog.close();
                oCreatedmodel.setProperty("/empfragmentModel", {}); // clear the fragment model after saving
                this.getView().byId("idemptable").getBinding("items").refresh(); // refresh the main table binding
            } catch (err) {
                sap.m.MessageBox.error("Error While Saving Data: " + err.message || "Error Occured While Saving Data");
            }
        },
        onClickSubmitBatch() {
            var oView = this.getView();
            var oModel = this.getView().getModel("empModel");
            var oFamilyModel = this.getView().getModel("oFamilyModel");
            var sGroupId = "empcrudcapm";
            var oPayload = {
                empId: oView.byId("idEmployeeId").getValue(),
                empFirstName: oView.byId("idFirstName").getValue(),
                empLastName: oView.byId("idLastName").getValue(),
                empEmail: oView.byId("idEmail").getValue(),
                empPhoneNumber: oView.byId("idContactNumber").getValue(),
                empDateOfBirth: oView.byId("idDateOfBirth").getDateValue().toISOString(),
                empDateOfJoining: oView.byId("idJoinDate").getDateValue().toISOString(),
                empService: oView.byId("idService").getSelectedKey(),
                empgender: oView.byId("idGender").getSelectedKey(),
                famrelation: [

                ]
            };

            oFamilyModel.getData().familyRelation.forEach(element => {
                oPayload.famrelation.push({
                    empId: element.empId,
                    relation: element.relation,
                    familyMemberName: element.familyMemberName,
                    familyMemberAge: element.familyMemberAge
                })
            });
            try {
                var oCtx = oModel.bindList("/empPersonalSet");
                var oCreate = oCtx.create(oPayload, { groupId: sGroupId });
                oModel.submitBatch(sGroupId);
                oCreate.created();
                sap.m.MessageToast.show("Batch Update Successful");
                this._onClearData();
                this.getView().byId("idemptable").getBinding("items").refresh();
            } catch (err) {
                MessageBox.error("Error While Posting Batch Update: " + err.message || "Error Occured While Posting Batch Update");
            }
        },
        onClickAddFamilyMember() {
            var obj = {
                empId: "",
                relation: "",
                familyMemberName: "",
                familyMemberAge: ""
            }
            var oModel = this.getView().getModel("oFamilyModel");
            var oData = oModel.getProperty("/familyRelation");
            oData.push(obj);
            oModel.setProperty("/familyRelation", oData);
        },
    });
});