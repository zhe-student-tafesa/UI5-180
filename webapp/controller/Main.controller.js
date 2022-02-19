sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "T180/fiorichallenge/model/models",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, models,MessageToast) {
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
                //bound length to the XML view
                var oData = {
                    recipient: {
                        Length: reviewsLength
                    },
                    newReviews: {
                        AssetName: "Asset Name",
                        Suitability: 0,
                        SuitabilityComment: "",
                        Value: 0,
                        ValueComment: "",
                        Durability: 0,
                        DurabilityComment: "",
                        Longevity: 0,
                        LongevityComment: "",
                        SummaryComments: "",
                        SubmissionDate: "YYYY-MM-DD",
                        SubmittedBy: ""
    
                    }
                };
                var oModel = new JSONModel(oData);



                this.getView().setModel(oModel);
                //set date format YYYY-MM-DD , begin
                for (var i = 0; i < myReviews.length; i++) {
                    myReviews[i].SubmissionDate = myReviews[i].SubmissionDate.substr(0, 10);
                }
                this.getView().getModel("AssetReviewModel").setProperty("/Reviews", myReviews); //update  model
                //set date format YYYY-MM-DD  end
                    
                console.log("123");

            },
            onAddReview() {
                var newReviews = {
                    AssetName: "",
                    Suitability: 0,
                    SuitabilityComment: "",
                    Value: 0,
                    ValueComment: "",
                    Durability: 0,
                    DurabilityComment: "",
                    Longevity: 0,
                    LongevityComment: "",
                    SummaryComments: "",
                    SubmissionDate: "2022-02-07",
                    SubmittedBy: ""
                };
                var oBundle = this.getView().getModel("i18n").getResourceBundle(); //
                //get data from input value
                newReviews.AssetName = this.getView().getModel().getProperty("/newReviews/AssetName"); //
                newReviews.Suitability = this.getView().getModel().getProperty("/newReviews/Suitability");
                newReviews.SuitabilityComment = this.getView().getModel().getProperty("/newReviews/SuitabilityComment");
                newReviews.Value = this.getView().getModel().getProperty("/newReviews/Value");
                newReviews.ValueComment = this.getView().getModel().getProperty("/newReviews/ValueComment");
                newReviews.Durability = this.getView().getModel().getProperty("/newReviews/Durability");
                newReviews.DurabilityComment = this.getView().getModel().getProperty("/newReviews/DurabilityComment");
                newReviews.Longevity = this.getView().getModel().getProperty("/newReviews/Longevity");
                newReviews.LongevityComment = this.getView().getModel().getProperty("/newReviews/LongevityComment");
                newReviews.SummaryComments = this.getView().getModel().getProperty("/newReviews/SummaryComments");
                newReviews.SubmissionDate = this.getView().getModel().getProperty("/newReviews/SubmissionDate");
                newReviews.SubmittedBy = this.getView().getModel().getProperty("/newReviews/SubmittedBy");
    
    
                console.log(newReviews);
                //get old data
                var myReviews = this.getView().getModel("AssetReviewModel").getProperty("/Reviews");
                // add new data to  old data
                myReviews.push(newReviews); // add new  data
                var reviewsLength = myReviews.length;
                //set Property in AssetReviewModel model
                this.getView().getModel("AssetReviewModel").setProperty("/Reviews", myReviews);
                
                
                //update length
                var newLength="Number of Reviews : "+" "+reviewsLength;
                var lengthText = this.getView().byId("myText");
                lengthText.setText(newLength);//  set Text
                
                // Reminder that the update was successful
                MessageToast.show("Review added successfully");

    
            }
        });
    });
