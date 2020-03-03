import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../messaging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { NgxSpinnerService } from "ngx-spinner";
import { tick } from '@angular/core/testing';
import ChartDataLabels from 'chartjs-plugin-datalabels';

//Dummy const definition
const cortteza_Campaigns = "http://localhost:8058/getCampaigns";
const corttToken = "6f462da1-23d3-6fc7-99d7-2ccc5eb2d29a";
const headers = new HttpHeaders({ token: corttToken, bucketid: "DEV_CALL_CONVENIO" });
const httpOptions = {
  headers: headers,
}

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  //0. Var Initialization
  campaigns: Array<any> = null;
  private hideDrafts = false ;
  private chartType = "bar";
  private chartPlugins = [ChartDataLabels];
  private chartDataSet = [{ data: [15], label: "Entregados" }, { data: [15], label: "Leidos" }, { data: [15], label: "Rebotados" }]
  private barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        display: false,
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return value + '%';
          }
        }
      }],
    },
    legend: {
      position: 'bottom',
      labels:{
        boxWidth:20
      }
    },
    plugins: {
      datalabels: {
        color: 'black',
        formatter: (value, context) => {
          return value + "%";
        }
      }
    },
    tooltips: {
      callbacks: {
        title: (item, data) => {

          return "";
        },
        label: (item, data) => {

          return item["value"] + "%";
        }
      }
    }
  };
  dummyCampaigns = [
    {
      "name": "Campaña prueba #1",
      "subject": "Campaña prueba #1",
      "segments": [
        {
          "id": 1
        }
      ],
      "ID-cortteza": "de32de30-12-2-2020",
      "ID-sendInBlue": 1,
      "ID-sendInBlueList": 2,
      "creationDate": "2020-02-12T21:58:44.971Z",
      "stats": [
        {
          "uniqueClicks": 0,
          "clickers": 0,
          "complaints": 0,
          "delivered": 1,
          "sent": 1,
          "softBounces": 0,
          "hardBounces": 0,
          "uniqueViews": 1,
          "unsubscriptions": 0,
          "viewed": 4,
          "date": "2020-03-02T18:28:58.409Z"
        }
      ],
      "status": "sent",
      "screen":'list',
    },
    {
      "_id": "5e4ea1426f30210969c94da9",
      "name": "Campaña Prueba #5",
      "subject": "Sujeto Prueba #5",
      "segments": [
        {
          "name": "A retener",
          "id": 1
        }
      ],
      "ID-cortteza": "4626cf46-20-2-2020",
      "ID-sendInBlue": 52,
      "ID-sendInBlueList": 97,
      "creationDate": "2020-02-20T15:09:53.884Z",
      "stats": [
        {
          "uniqueClicks": 0,
          "clickers": 0,
          "complaints": 0,
          "delivered": 1,
          "sent": 1,
          "softBounces": 0,
          "hardBounces": 0,
          "uniqueViews": 1,
          "unsubscriptions": 0,
          "viewed": 1,
          "date": "2020-03-02T18:28:58.410Z"
        }
      ],
      "status": "sent",
      "screen":'list',
    },
    {
      "_id": "5e4ea952aff2f9691879b78f",
      "name": "Campaña Prueba #6",
      "subject": "Sujeto 6",
      "segments": [
        {
          "name": "A retener",
          "id": 1
        }
      ],
      "ID-cortteza": "a284ee1e-20-2-2020",
      "ID-sendInBlue": 53,
      "ID-sendInBlueList": 100,
      "creationDate": "2020-02-20T15:44:18.509Z",
      "stats": [],
      "status": "draft",
      "screen":'list',
    },
    {
      "_id": "5e4ea952aff2f9691879b78f",
      "name": "Campaña Prueba #6",
      "subject": "Sujeto 6",
      "segments": [
        {
          "name": "A retener",
          "id": 1
        }
      ],
      "ID-cortteza": "a284ee1e-20-2-2020",
      "ID-sendInBlue": 53,
      "ID-sendInBlueList": 100,
      "creationDate": "2020-02-20T15:44:18.509Z",
      "stats": [],
      "status": "draft",
      "screen":'list',
    }
  ]

  constructor(
    private messageService: MessagingService,
    private http: HttpClient,
    private spiner: NgxSpinnerService) { }

  //1. Data Management
  readyChartData() {
    var newArray =  [];
    this.campaigns.forEach(campaign=>{
      if(campaign.status== 'sent'){
        var stats = campaign.stats[campaign["stats"].length-1];
        var sent = stats["sent"];
        var ePerc = (100 * stats.delivered) / sent;
        var rPerc = (100 * (stats.hardBounces+stats.softBounces)) / sent;
        var lPerc = (100 * stats.uniqueViews) / sent;
        var entregados = {data:[ePerc], label:"Entregados"};
        var rebotados ={data:[rPerc], label:"Rebotados"} ;
        var leidos ={data:[lPerc], label:"Abiertos"} ;
        console.log(stats)
    
        campaign["screen"] = "list";
        campaign["dataset"] = [entregados,rebotados,leidos];
        campaign["formatStats"] = {
          "s":sent,
          "e":{num:stats.delivered, perc:ePerc},
          "r":{num:stats.hardBounces+stats.softBounces, perc:rPerc},
          "a":{num:stats.uniqueViews, perc:lPerc},
        }
      }
      newArray.push(campaign);
    });
   

    this.campaigns = newArray;
    

  }

  changeCampaignScreen(screen:string, campaignId:string){
    for(var i = 0; i < this.campaigns.length; i++){
      if(this.campaigns[i]["ID-cortteza"] == campaignId){
        this.campaigns[i]["screen"] = screen;
      }
    }
  }

  toggleHideDrafts(){
    this.hideDrafts = !this.hideDrafts;
    this.campaigns = null;
    this.getCampaigns();
  }
  

  getCampaigns(status:string = '', offset:Number = 0, limit:Number = 6){
    let body = {status:status, limit:limit, offset:offset};
    if(this.hideDrafts){
      body.status='sent';
    }

    this.http.post(cortteza_Campaigns,body, httpOptions).subscribe(
      (response) => {
        if (response['status']) {
          //alert(response['message']);
          this.campaigns = response["data"]["campaigns"];
          this.readyChartData();
        }
        else {
          alert(response['message']);
          
        }


      },
      (err) => { console.log(err) }
    )
  }

  ngOnInit() {
    // this.campaigns = this.dummyCampaigns;
    // this.readyChartData();
    this.getCampaigns();
  }

}


type StatsFormat = "Chart" | "List";
type Campaigns = {}