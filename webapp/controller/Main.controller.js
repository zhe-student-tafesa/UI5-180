sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    
    "T180/fiorichallenge/model/models",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, models,MessageToast,DateFormat) {
        "use strict";

        return Controller.extend("T180.fiorichallenge.controller.Main", {
            onInit: function () {
                var today=DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}).format(new Date());
                
                            this.reviewDialog = { //save dialog data
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
                        SubmissionDate: today,
                        SubmittedBy: ""
                                };
                    console.log(this.reviewDialog);
                    
                var oTable = this.getView().byId("ReviewsTable");

                // bind data to oTable
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

                // 1 pie chart
                this.oVizFrame = this.getView().byId("idpiechart");
                //2 pie chart 
                //oModel,  setData
                            var oModel = new sap.ui.model.json.JSONModel();
            var data = {
                'Sales': [{
                        "DrugName": "Cro",
                        "Revenue": "3.30"
                    },

                    {
                        "DrugName": "Vicks",
                        "Revenue": "5.30"
                    },

                    {
                        "DrugName": "Dolo",
                        "Revenue": "1.62"
                    },

                    {
                        "DrugName": "Bp4",
                        "Revenue": "6.70"
                    },

                    {
                        "DrugName": "Th5",
                        "Revenue": "2.30"
                    }
                ]
            };
            oModel.setData(data);


                

                //3 create a viz dataset -to feed the data to the graph
                                        var oDataset = new sap.viz.ui5.data.FlattenedDataset({
                                    dimensions: [{
                                        name: "Medicine",
                                        value: "{DrugName}"
                                    }],
                                    measures: [{
                                        name: "Cost", ///////////111111
                                        value: "{Revenue}"
                                    }],
                                    data: {
                                        path: "/Sales"
                                    }
                                });
                    //             oVizFrame.setDataset(oDataset);
                    //             oVizFrame.setModel(oModel); // model的名字
                    
                    //             this.oVizFrame.setDataset(oDataset);
                    //             this.oVizFrame.setModel("AssetReviewModel"); // model的名字
                                //4set property for viz
//             oVizFrame.setVizProperties({
//                 title: {
//                     text: "Revenue"
//                 },
//                 plotArea: {
//                     colorPalette: d3.scale.category20().range(),
//                     drawingEffect: "glossy"
//                 }
//             });
//             var feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({
//                 "uid": "size",
//                 "type": "Measure",
//                 "values": ["Cost"] ///////////111111
//             });
//             var feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
//                 "uid": "color",
//                 "type": "Dimension",
//                 "values": ["Medicine"]
//             });
//             oVizFrame.addFeed(feedSize);
//             oVizFrame.addFeed(feedColor);

                    
                


            },
            handleAddReview:function(){
                if (!this.newStudentDialog) { // if not exist , new 
                    this.newStudentDialog = sap.ui.xmlfragment("T180.fiorichallenge.view.Register", this);
                    var oModel = new sap.ui.model.json.JSONModel(); // bind the dialog data
                    this.newStudentDialog.setModel(oModel);
                }
                //bind  data to dialog  begin
                //pass by value
                var data = JSON.parse(JSON.stringify(this.reviewDialog)); //pass by value
                this.newStudentDialog.getModel().setData(data); //pass by value
                //bind  data to dialog  end

    
                this.newStudentDialog.open(); // globel variable  open Dialog
            },
            handleSaveBtnPress: function(oEvent) {
                
                var oModel = oEvent.getSource().getModel();
                var oDialog = oModel.getData();
    
                //get view data
                
                var myReviews = this.getView().getModel("AssetReviewModel").getProperty("/Reviews");
                // add new data to  old data
                myReviews.push(oDialog); // add new  data
                var reviewsLength = myReviews.length;
                //set Property in AssetReviewModel model
                // update Reviews array
                this.getView().getModel("AssetReviewModel").setProperty("/Reviews", myReviews);


                //close dialog
                this.newStudentDialog.close(); // 
                //update length
                var newLength="Number of Reviews : "+" "+reviewsLength;
                var lengthText = this.getView().byId("myText");
                lengthText.setText(newLength);//  set Text
                
                // Reminder that the update was successful
                MessageToast.show("Review added successfully");
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
                    }
                };
                var oModel = new JSONModel(oData);

                this.getView().setModel(oModel);
                //2 pie chart 
                //oModel,  setData
                var avgSuitability=0;
                var avgValue=0;
                var avgDurability=0;
                var avgLongevity=0;

                for (var i = 0; i < myReviews.length; i++) {
                   ;///求平均值，set 
                }
                this.myAverage=[
                    {
                    "review": "Suitability",
                    "avgSuitability": "5"
                },

                {
                    "review": "Value",
                    "avgValue": "5.30"
                },

                {
                    "review": "Durability",
                    "avgDurability": "1.62"
                },

                {
                    "review": "Longevity",
                    "avgLongevity": "6.70"
                }
                
                ];


                //set date format YYYY-MM-DD , begin
                for (var i = 0; i < myReviews.length; i++) {
                    myReviews[i].SubmissionDate = myReviews[i].SubmissionDate.substr(0, 10);
                }
                this.getView().getModel("AssetReviewModel").setProperty("/Reviews", myReviews); //update  model
                //set date format YYYY-MM-DD  end
                    
                console.log("123");

            },
            handleCancelBtnPress: function() {
                console.log("取消");
                this.newStudentDialog.close(); // 
            }
        });
    });
