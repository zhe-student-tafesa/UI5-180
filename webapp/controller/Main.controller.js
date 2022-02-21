sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "T180/fiorichallenge/model/models",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    'sap/viz/ui5/controls/common/feeds/FeedItem',
    'sap/viz/ui5/data/FlattenedDataset',
    'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format'
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function(Controller, JSONModel, models, MessageToast, DateFormat, FeedItem, FlattenedDataset, ChartFormatter, Format) {
    "use strict";
    return Controller.extend("T180.fiorichallenge.controller.Main", {
        onInit: function() {
            //  this.avgData is used to save average，and update model   
            this.avgData = {        
                'average': [{
                        "review": "Suitability",
                        "avgScore": ""
                    },
                    {
                        "review": "Value",
                        "avgScore": ""
                    },
                    {
                        "review": "Durability",
                        "avgScore": ""
                    },
                    {
                        "review": "Longevity",
                        "avgScore": ""
                    }
                ]      
            };      
            // get today date，used to init the fragment date input Control
            var today = DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" }).format(new Date());
            // this.reviewDialog： used to init the dialog fragment
            this.reviewDialog = {      
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

            // bind data to Table  begin
            var oTable = this.getView().byId("ReviewsTable");
            // bind data to oTable
            oTable.bindItems({
                path: "AssetReviewModel>/Reviews",
                template: new sap.m.ColumnListItem({
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
            // bind data to Table  end
            
            // pie  chart  begin
            // 1 pie chart ：get oVizFrame
            this.oVizFrame = this.getView().byId("idpiechart");
            //2 pie chart ：oModel,  setData this Project，we use AssetReviewModel as model
            //3 -create a viz dataset -to feed the data to the graph           
            this.oDataset = new sap.viz.ui5.data.FlattenedDataset({        
                dimensions: [{          
                      name: "ReviewV",          
                       value: "{review}"        
                }],        
                 measures: [{          
                      name: "Average Score", //same value
                      value: "{avgScore}"        
                 }],         
                data: {           
                     path: "AssetReviewModel>/average"         
                }       
            });
            this.oVizFrame.setDataset(this.oDataset);
            //4-set property for viz    
            this.oVizFrame.setVizProperties({         
                title: {           
                    text: "Average Score"         
                },         
                plotArea: {           
                    colorPalette: d3.scale.category20().range(),           
                    drawingEffect: "glossy"         
                }       
            });      
            this.feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({         
                "uid": "size",          
                "type": "Measure",          
                "values": ["Average Score"] //same value                  
            });      
            this.feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({         
                "uid": "color",          
                "type": "Dimension",          
                "values": ["ReviewV"]       
            });      
            this.oVizFrame.addFeed(this.feedSize);      
            this.oVizFrame.addFeed(this.feedColor);
            // pie  chart  end

        },


        handleAddReview: function() {// press event
            if (!this.newStudentDialog) { // if not exist ,  then new 
                this.newStudentDialog = sap.ui.xmlfragment("T180.fiorichallenge.view.AddReview", this);
                var oModel = new sap.ui.model.json.JSONModel(); // bind the dialog data
                this.newStudentDialog.setModel(oModel);
            }
            //bind  data to dialog  begin
            var data = JSON.parse(JSON.stringify(this.reviewDialog)); //pass by value
            this.newStudentDialog.getModel().setData(data); //pass by value
            //bind  data to dialog  end

            //  open Dialog（this:globel variable ）
            this.newStudentDialog.open(); 
        },


        handleSaveBtnPress: function(oEvent) {
            // get input data from dialog
            var oModel = oEvent.getSource().getModel();
            var oDialog = oModel.getData();
            //get view data
            var myReviews = this.getView().getModel("AssetReviewModel").getProperty("/Reviews");
            // add new data to  old data
            myReviews.push(oDialog);

            // update Reviews array in Model
            this.getView().getModel("AssetReviewModel").setProperty("/Reviews", myReviews);
            var reviewsLength = myReviews.length;
            //close dialog
            this.newStudentDialog.close(); 
            
            //update length of Reviews in page
            var newLength = "Number of Reviews : " + " " + reviewsLength;
            var lengthText = this.getView().byId("myText");
            //  set Text Control
            lengthText.setText(newLength); 
            // Reminder user:  the update was successful
            MessageToast.show("Review added successfully");

            //  update pie  chart  data (when add new review) begin 
            var avgSuitability = 0;
            var avgValue = 0;
            var avgDurability = 0;
            var avgLongevity = 0;
            //calculate new sum
            for (var i = 0; i < myReviews.length; i++) {;  
                avgSuitability= avgSuitability+ parseFloat(myReviews[i].Suitability) ;
                avgValue= avgValue+ parseFloat(myReviews[i].Value);
                avgDurability= avgDurability+ parseFloat( myReviews[i].Durability);
                avgLongevity= avgLongevity+ parseFloat(myReviews[i].Longevity);
            }
            //calculate avg
            avgSuitability=avgSuitability/myReviews.length;
            avgValue=avgValue/ myReviews.length;
            avgDurability=avgDurability/myReviews.length;
            avgLongevity=avgLongevity/ myReviews.length;
            // save avg to this.avgData
            this.avgData.average[0].avgScore=avgSuitability;
            this.avgData.average[1].avgScore=avgValue;
            this.avgData.average[2].avgScore=avgDurability;
            this.avgData.average[3].avgScore=avgLongevity;
            // use this.avgData.average update average arr in Model
            this.getView().getModel("AssetReviewModel").setProperty("/average",this.avgData.average); 
            var oDataset = new sap.viz.ui5.data.FlattenedDataset({        
                dimensions: [{           
                    name: "ReviewV",          
                    value: "{review}"        
                    }],        
                measures: [{          
                    name: "Average Score", ///////////111111
                    value: "{avgScore}"        
                    }],         
                data: {           
                    path: "AssetReviewModel>/average"         
                    }       
            });
            // use vizUpdate method update pie chart
            this.oVizFrame.vizUpdate({
                'data':oDataset
                 }              
            );
            //  update pie  chart  data  (when add new review)  end 
        },


        onAfterRendering: function() {
            // Instantiate the Asset Review Model from the models.js template
            this.getView().setModel(new JSONModel(models.createAssetReviewModelTemplate()), "AssetReviewModel");
            // Example; setting the 'CurrentDate' property in the Asset Review model
            this.getView().getModel("AssetReviewModel").setProperty("/CurrentDate", new Date());
            // Calculate how many entries are in the ‘Reviews’ array of the ‘AssetReviewModel’, and display it on the page.
            var myReviews = this.getView().getModel("AssetReviewModel").getProperty("/Reviews");
            var reviewsLength = myReviews.length;
            //bound length to the XML view
            var oData = {
                recipient: {
                    Length: reviewsLength
                }
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);

            // use  Reviews arr to init(calculate) the avg data( used to draw pie chart when page loaded) Begin
            var avgSuitability = 0;
            var avgValue = 0;
            var avgDurability = 0;
            var avgLongevity = 0;
            //calculate sum
            for (var i = 0; i < myReviews.length; i++) {; ///求平均值，set 
                avgSuitability= avgSuitability+ myReviews[i].Suitability;
                avgValue= avgValue+ myReviews[i].Value;
                avgDurability= avgDurability+ myReviews[i].Durability;
                avgLongevity= avgLongevity+ myReviews[i].Longevity;
            }
            // avg 
            avgSuitability=avgSuitability/myReviews.length;
            avgValue=avgValue/ myReviews.length;
            avgDurability=avgDurability/myReviews.length;
            avgLongevity=avgLongevity/ myReviews.length;
            // set this.avgData.average
            this.avgData.average[0].avgScore=avgSuitability;
            this.avgData.average[1].avgScore=avgValue;
            this.avgData.average[2].avgScore=avgDurability;
            this.avgData.average[3].avgScore=avgLongevity;
            //update  model
            this.getView().getModel("AssetReviewModel").setProperty("/average",this.avgData.average); 
            // use  Reviews arr to init(calculate) the avg data( used to draw pie chart when page loaded) End
            
            //set date format : YYYY-MM-DD , begin
            for (var i = 0; i < myReviews.length; i++) {
                myReviews[i].SubmissionDate = myReviews[i].SubmissionDate.substr(0, 10);
            }
            //update  model
            this.getView().getModel("AssetReviewModel").setProperty("/Reviews", myReviews); 
            //set date format YYYY-MM-DD  end

        },

        handleCancelBtnPress: function() {
            //close Dialog
            this.newStudentDialog.close(); // 
        }
    });
});