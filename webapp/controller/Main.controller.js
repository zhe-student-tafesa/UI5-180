sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "T180/fiorichallenge/model/models",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, models) {
        "use strict";

        return Controller.extend("T180.fiorichallenge.controller.Main", {
            onInit: function () {
                var oTable = this.getView().byId("ReviewsTable");

                // bind data
                oTable.bindItems({
                    path: "AssetReviewModel>/Reviews",
                    template: new sap.m.ColumnListItem({
                        // type : navigation
                        cells: [
                            new sap.m.Text({
                                text: "{AssetReviewModel>AssetName}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>Suitability}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>SuitabilityComment}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>Value}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>ValueComment}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>Durability}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>DurabilityComment}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>Longevity}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>LongevityComment}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>SummaryComments}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>SubmissionDate}"
                            }),
                            new sap.m.Text({
                                text: "{AssetReviewModel>SubmittedBy}"
                            })
    
                        ]
                    })
                });

            },

            onAfterRendering: function () {

                // Instantiate the Asset Review Model from the models.js template
                this.getView().setModel(new JSONModel(models.createAssetReviewModelTemplate()), "AssetReviewModel");

                // Example; setting the 'CurrentDate' property in the Asset Review model
                this.getView().getModel("AssetReviewModel").setProperty("/CurrentDate", new Date());
                // Calculate how many entries are in the ‘Reviews’ array of the ‘AssetReviewModel’, and display it on the page.
                var myReviews= this.getView().getModel("AssetReviewModel").getProperty("/Reviews");
                var reviewsLength=myReviews.length;
                //bound to the XML view
                var oData = {
                    recipient: {
                        Length: reviewsLength
                    }
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);
                    
                console.log("123");

            }
        });
    });
