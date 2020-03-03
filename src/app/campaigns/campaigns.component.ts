import { Component, OnInit, Input, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup } from "@angular/forms";
import { MessagingService } from '../messaging.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import FileUploadWithPreview from 'file-upload-with-preview';
import { NgxSpinnerService } from "ngx-spinner";

//Dummy const definition
const cortteza_Campaigns = "http://localhost:8058/createCampaign";
const corttToken = "2507c852-c19a-95fd-4917-e59278beebf6";
const headers = new HttpHeaders({ token: corttToken, bucketid: "DEV_CALL_CONVENIO" });
const httpOptions = {
  headers: headers,
}

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('basicInfo', style({ transform: 'translateX(0)' })),
      state('segmentSelector', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(500))
    ]),
    trigger('popUp', [
      state('start', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate(600)]),
      transition(':leave', animate(600, style({ opacity: 0 })))
    ])
  ],
})


export class CampaignsComponent implements OnInit {
  screen: PaneType = 'basicInfo';
  form: FormGroup;
  campaign: Campaign;
  segments = Array;
  file: File;
  requestBody: Object;
  private hasName = false;
  private hasSubject = false;
  private hasImage = false;
  private dataProvided = false;
  private uploadInput: FileUploadWithPreview;

  constructor(
    private messageService: MessagingService,
    private http: HttpClient,
    private fb: FormBuilder,
    private spiner: NgxSpinnerService

  ) {
    this.form = this.fb.group({
      campaign: { name: "", subject: "", segments: [] },
      imgFile: null,
    })
    //Var initialization
    this.campaign = { name: "", subject: "", segments: [] }
    this.requestBody = {
      "campaign": this.campaign,
      "imgFile": null,
    }
  }


  // 1. Navigation and Loading Feedback Functions --------------------------------------------------
  nextScreen = () => {
    if (this.screen == 'basicInfo') {
      if (this.hasName && this.hasSubject && this.checkUploadFile()) {
        this.screen = 'segmentSelector';
      }
      else {
        console.log(this.checkUploadFile());
        console.log(this.hasName);
        console.log(this.hasSubject)
        alert('Por favor complete el formuario y elija una imagen para la campaña')
      }
    }
    else if (this.screen == 'segmentSelector') {
      this.screen = 'preview';
    }
    else if (this.screen == 'preview') {
      this.screen = 'finished';
    }
    else if (this.screen == 'finished') {
      this.screen = 'basicInfo';
    }
  }

  prevScreen = () => {
    if (this.screen == 'segmentSelector') {
      this.screen = 'basicInfo';
    }
    else if (this.screen == 'preview') {
      this.screen = 'segmentSelector';
    }
    else if (this.screen == 'finished') {
      this.screen = 'preview';
    }
  }

  setScreen = (screen: PaneType) => {
    this.screen = screen;
  }

  activateLoading() {
    this.spiner.show();
  }

  deactivateLoading() {
    this.spiner.hide();
  }

  //2. Data handling functions --------------------------------------------------
  setCampaignName(name) {
    if (name == "") { this.hasName = false } else { this.hasName = true }
    this.campaign.name = name;
    this.isDataprovided();
    this.setRequestBody();
  }

  setCampaignSubject(subject) {
    if (subject == "") { this.hasSubject = false } else { this.hasSubject = true; }
    this.campaign.subject = subject;
    this.setRequestBody();
    this.isDataprovided();
  }

  setCampaingSegments(segment: any) {
    let exists = this.isSegmentActive(segment.id);

    if (exists) {
      let newS = this.campaign.segments.filter(s => s.id != segment.id);
      this.campaign.segments = newS;
      this.setRequestBody();
    }
    else {
      this.campaign["segments"].push(segment);
      this.setRequestBody();
    }



  }

  isSegmentActive(id: Number) {
    var isActive = false;
    this.campaign.segments.forEach(s => {
      if (s.id == id) {
        isActive = true;
      }
    })

    return isActive;
  }

  setRequestBody = () => {
    this.requestBody['campaign'] = this.campaign;
    this.requestBody['imgFile'] = this.uploadInput.cachedFileArray[0];
    this.form.patchValue({
      "campaign": JSON.stringify(this.campaign),
      "imgFile": this.uploadInput.cachedFileArray[0],
    })

  }

  submitForm = () => {
    var formData = new FormData();
    formData.append("campaign", this.form.get('campaign').value);
    formData.append("imgFile", this.form.get('imgFile').value);

    if (this.hasName && this.hasSubject && this.checkUploadFile() && this.checkSegments()) {
      //Executes the http request
      this.activateLoading();
      this.http.post(cortteza_Campaigns, formData, httpOptions).subscribe(
        (response) => {
          console.log(response);
          if (response['status']) {
            alert(response['message']);
            this.deactivateLoading();
            window.location.assign(window.location.href);
          }
          else {
            alert(response['message']);
            this.deactivateLoading();
            //window.location.assign(window.location.href);
          }


        },
        (err) => { console.log(err) }
      )

    }
    else {
      //Not valid selection
      alert("Revisa que hayas seleccionado tus segmentos")
    }



  }

  isDataprovided(){
    if(this.hasImage && this.hasName && this.checkUploadFile()){
      this.dataProvided = true;
    }
    else{
      this.dataProvided=false;
    }
  }

  //3. Data Checking Functions (DEV ONLY) --------------------------------------------------

  checkFiles = () => {
    console.log(this.file);
  }

  checkUploadFile() {
    let result = this.uploadInput.cachedFileArray[0] != null && this.uploadInput.cachedFileArray[0] != undefined;
    return result;
  }

  checkSegments() {
    if (this.campaign.segments.length == 0) {
      return false;
    }
    else {
      return true;
    }
  }

  checkBody = () => {
    this.setRequestBody();
    console.log("Request Body:");
    console.log(this.requestBody);
    console.log("Form Body:");
    console.log(this.form.value)
  }

  // Z. Angular lifecycle --------------------------------------------------
  ngOnInit() {
    this.uploadInput = new FileUploadWithPreview('fileUpload');
    this.file = this.uploadInput.cachedFileArray;
  }

}

type PaneType = 'basicInfo' | 'segmentSelector' | 'preview' | 'finished';
type Campaign = { name: String, subject: String, segments: Array<any> } | { name: String, subject: String, segments: Array<any>, sender: { email: String, name: String } }
