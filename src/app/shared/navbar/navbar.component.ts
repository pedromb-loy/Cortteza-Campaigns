import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ROUTES, INNERROUTES } from '../../sidebar/sidebar.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
// import { MessagingService, BucketUpdatedMessage, BucketsListUpdatedMessage, ToggleSideBarMessage } from '../../messaging.service';
// import { CacheService, CacheItem } from '../../cache.service';
// import { LanguageService, LanguageUpdated } from '../../language.service';
// import { TokenService } from '../../token.service';
// import { DataSupportService, ApiKeysDataUpdateMessage, ApiKeysDataUpdateErrorMessage, LogoutDataUpdatedMessage, 
//     LogoutErrorDataUpdatedErrorMessage, LabelsForBucketUpdateMessage, LabelsForBucketUpdateErrorMessage,
//     GetBucketDetailUpdateMessage, GetBucketDetailUpdateErrorMessage } from '../../dataSupport.service';

// import { Socket } from 'ng2-socket-io';
// import { SocketService } from '../../app.module';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    ngOnInit() {
        
    }

    ngOnDestroy() {
	}
}
