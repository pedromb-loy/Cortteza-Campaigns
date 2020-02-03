import { Component, OnInit, ElementRef } from '@angular/core';
// import { LanguageService, LanguageUpdated } from '../language.service';
// import { Router, ActivatedRoute } from '@angular/router';
// import { DataSupportService, MenuOptionsMessage, MenuOptionsErrorMessage } from '../dataSupport.service';
// import { MessagingService, BucketUpdatedMessage, BucketsListUpdatedMessage, ToggleSideBarMessage } from '../messaging.service';
// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
// import { Keepalive } from '@ng-idle/keepalive';
// import swal from 'sweetalert2';
// import { CacheService, CacheItem } from '../cache.service';

declare var $:any;
declare var require: any;

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export var ROUTES: RouteInfo[] = [];
    // { path: 'dashboard', title: 'Dashboard',  icon: 'ti-dashboard', class: '' },
    // { path: 'salesforce', title: 'Sales Force' , icon: 'ti-medall-alt', class: '' },
    // { path: 'segments', title: 'Segmentos RFM',  icon: 'ti-layout-grid3', class: '' },    
    // { path: 'crm', title: 'CRM',  icon:'ti-comments', class: '' },
    // { path: 'filters', title: 'Filtros',  icon:'ti-filter', class: '' },
    // { path: 'settings', title: 'Settings',  icon:'ti-panel', class: '' },    
    // { path: 'user', title: 'User Profile',  icon:'ti-user', class: '' }    
    
    // { path: 'table', title: 'Table List',  icon:'ti-view-list-alt', class: '' },
    // { path: 'typography', title: 'Typography',  icon:'ti-text', class: '' },
    // { path: 'icons', title: 'Icons',  icon:'ti-pencil-alt2', class: '' },
    // { path: 'maps', title: 'Maps',  icon:'ti-map', class: '' },
    // { path: 'notifications', title: 'Notifications',  icon:'ti-bell', class: '' },
    // { path: 'upgrade', title: 'Upgrade to PRO',  icon:'ti-export', class: 'active-pro' },
//];

export const INNERROUTES: RouteInfo[] = [
    { path: 'settings', title: '',  icon: '', class: '' },
    { path: 'adjustments', title: '',  icon: '', class: '' },
    { path: 'clientdetail', title: '',  icon: '', class: '' },
    { path: 'segmentdetail', title: '',  icon: '', class: '' },
    { path: 'filtersbycat', title: '',  icon: '', class: '' },
    { path: 'myexports', title: '', icon: '', class: '' },
    { path: 'segments', title: '', icon: '', class: '' },
    { path: 'salesforce', title: '', icon: '', class: '' },
    { path: 'kpis', title: '', icon: '', class: '' }
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html'
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    // Language Resources
	private selectedLang: string = "";
    private lang: any = null;
    
    _buckets: any[] = [];

    subscription: any;
    subscription_bucketlist: any;

    selectedBucket: string = "";

    // Cache Id Variables
    private _cacheIdSelectedBucket: string = "selectedBucket-data";
    private _cacheIdSelectedBucketObject: string = "selectedBucketObject-data";
    private _cacheId: string = "apikeys-data";
    private _cacheIdSelectedBucketName: string = "selectedBucketName-data";
    private _cacheBucketGenderSeparation: string = "selectedBucket-GenderSeparationFlag";
    private _cacheIdCurrencySymbol: string = "globalCurrencySymbol";

    // Logo
    private companyLogoCDNUrl: string = "";

    idleState = '';
    idleStateSubTitle = '';
    timedOut = false;
    lastPing?: Date = null;

    private selectedBucketId: any = "";
    private selectedBucketName: string = "";
    private selectedbucketObject: any = {};

    private hiddenSections: any = [];

    subscription_MenuOptions: any = {};
    subscription_MenuOptionsError: any = {};

    private toggleButton;

    constructor(
        /* private languageService:LanguageService,
        private element: ElementRef,
        private idle: Idle, private keepalive: Keepalive,
        private dataSupportService: DataSupportService,
        private messagingService: MessagingService,
        private cacheService: CacheService,
        private router: Router  */) 
        { }

    BuildMenu(setFirstActive) {
        var activeClassForFirst = "";
        if (setFirstActive) {
            activeClassForFirst = "active";
        }

        // Gets the Language Resources
        // this.selectedLang = this.languageService.GetCurrentLang();
		// this.lang = this.languageService.Menu();

        this.menuItems = [
        ];

        this.menuItems.map(function(item){
            ROUTES.push(item);
        });
    }

    BuildMenuFromServer(setFirstActive, menuItems) {
        var activeClassForFirst = "";
        if (setFirstActive) {
            activeClassForFirst = "active";
        }

        // Gets the Language Resources
        // this.selectedLang = this.languageService.GetCurrentLang();
        // this.lang = this.languageService.Menu();

        menuItems[0]["class"] = activeClassForFirst;

        menuItems.forEach(m => {
            if (this.lang[m["title"]]) {
                m["title"] = this.lang[m["title"]][this.selectedLang];
            }
            else {
                m["title"] = "N/D";
            }
        });

        this.menuItems = menuItems;

        this.menuItems.map(function (item) {
            ROUTES.push(item);
        });
    }

    ShowTimeoutMessage() {
        localStorage.removeItem("ctztkn");
        
        // swal({
        //     title: this.lang["lblTimeOutTitle"][this.selectedLang],
        //     text: this.lang["lblTimeOut"][this.selectedLang],
        //     type: 'warning',
        //     allowOutsideClick: false,
        //     allowEscapeKey: false,
        //     confirmButtonText: 'Ok',
        //     focusConfirm: true,
        // }).then((result) => {
        //     swal.showLoading();
        //     console.log("Doing close!");
        //     this.dataSupportService.DoLogout();
        // })
    }

    resetIdleTitle() {
        this.idleState = '';
        this.idleStateSubTitle = '';
    }

    setIdleTitle(countdown) {
        if (this.lang["lblTimingOut"] == undefined) return;
        this.idleState = this.lang["lblTimingOut"][this.selectedLang];
        this.idleStateSubTitle = countdown + ' ' + this.lang["lblSeconds"][this.selectedLang]
    }

    idleReset() {
        // this.dataSupportService.CheckServerStatus();
        // this.resetIdleTitle();
    }

    reset() {
        // this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    isNotMobileMenu(){
        if($(window).width() > 991){
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.BuildMenu(false);

        // Gets the Language Resources
        // this.selectedLang = this.languageService.GetCurrentLang();
        // this.lang = this.languageService.NavBar();

        // Subscribes to the Bucket Change Service.
        // this.subscription = this.languageService.of(LanguageUpdated).subscribe(message => {
        //     this.BuildMenu(true);
        // });

        // this.idle.onIdleEnd.subscribe(() => this.idleReset());

        // this.idle.onTimeout.subscribe(() => {
        //     this.resetIdleTitle();
        //     this.timedOut = true;
        //     this.ShowTimeoutMessage();
        // });

        // Gets from the Cache Service if Available
        // let cacheData_A: CacheItem = null;
        // cacheData_A = this.cacheService.getFromCache(this._cacheIdSelectedBucket);

        // if (cacheData_A != null) {
        //     this.selectedBucketId = cacheData_A;
        //     this.dataSupportService.GetMenuOptionsForBucket(this.selectedBucketId);
        // }

        // this.idle.onIdleStart.subscribe(() => this.resetIdleTitle()); // you have gone idle

        // this.idle.onTimeoutWarning.subscribe((countdown) => this.setIdleTitle(countdown));

        // this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

        // Subscribes to the Bucket Change Service.
        // this.subscription = this.messagingService.of(BucketUpdatedMessage).subscribe(message => { 
        //     let bucket = this.cacheService.getFromCache(this._cacheIdSelectedBucket);
        //     let bucketObject = this.cacheService.getFromCache(this._cacheIdSelectedBucketObject);

        //     if (bucketObject != null) {
        //         this.companyLogoCDNUrl = bucketObject["companyLogoCDNUrl"];

        //         // Sets the theme of the sidebar and system
        //         if (bucketObject["theme"] != undefined && bucketObject["theme"] != null && bucketObject["theme"] != "") {
        //             document.getElementById('theme').setAttribute('href', './assets/css/' + bucketObject["theme"]);
        //         }

        //         this.selectedBucketId = message["bucketId"];
        //         this.dataSupportService.GetMenuOptionsForBucket(this.selectedBucketId);
        //     }
        // });

        // this.subscription_bucketlist = this.messagingService.of (BucketsListUpdatedMessage).subscribe(message => {
        //     // Gets the buckets from the cache store
        //     // Stores in the cache of the app
        //     this._buckets = this.cacheService.getFromCache(this._cacheId);
        //     if (this._buckets === null) this._buckets = [];            
        // });

        // this.subscription_MenuOptions = this.dataSupportService.of(MenuOptionsMessage).subscribe(message => {
        //     this.BuildMenuFromServer(true, message["data"]);
        // });

        // this.subscription_MenuOptionsError = this.dataSupportService.of(MenuOptionsErrorMessage).subscribe(message => {
        //     console.log(message);
        // });

        /// Bucket Operations
		/// ----------------------------------------------------------------------------------------------------

		// Gets the Bucket that has been selected
		// this.selectedBucketId = this.cacheService.getFromCache(this._cacheIdSelectedBucket);
		// this.selectedBucketName = this.cacheService.getFromCache(this._cacheIdSelectedBucketName);
		// this.selectedbucketObject = this.cacheService.getFromCache(this._cacheIdSelectedBucketObject);

		this.hiddenSections = [];

		if (this.selectedbucketObject != null) {
			if (this.selectedbucketObject.hiddenSections != undefined && this.selectedbucketObject.hiddenSections.length > 0) {
                this.hiddenSections = this.selectedbucketObject.hiddenSections;
                
                console.log(this.hiddenSections);
			}
        }
    }

    sidebarToggle() {        
        var body = document.getElementsByTagName('body')[0];        
        body.classList.remove('nav-open');
        
        // var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = $("#sidebar-button");
        this.toggleButton.removeClass('toggled');

        // this.messagingService.publish(new ToggleSideBarMessage(""));
    }

    // Buckets dropdown action
    onClick(target) {

        // Stores in the cache of the app
        // this.cacheService.storeCache(this._cacheIdSelectedBucket, target["bucketId"]);
        // this.cacheService.storeCache(this._cacheIdSelectedBucketName, target["name"]);
        // this.cacheService.storeCache(this._cacheIdSelectedBucketObject, target);
        // this.cacheService.storeCache(this._cacheBucketGenderSeparation, target["genderSeparation"]);
        
        // // Broadcasts the bucket change 
        // this.messagingService.publish(new BucketUpdatedMessage(target["bucketId"]));

        // this.dataSupportService.ClearSegmentsDataFromCache();

        // this.selectedBucket = target["name"];

        // // Sets the Currency Symbol
        // this.cacheService.storeCache(this._cacheIdCurrencySymbol, target["currencySymbol"]);

        // // Moves the user to the dashboard page.
        // this.router.navigate(['../dashboard']);

        this.sidebarToggle();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscription_bucketlist.unsubscribe();
	}
}
