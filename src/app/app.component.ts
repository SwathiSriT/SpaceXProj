import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { environment } from 'src/environments/environment.prod';
import { AppComponentService } from './app.component.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // Variables Declaration and Initialization
  title = 'spacex';
  lstYears: { year: number }[] = [];
  lstSpace: object = [];
  selectedYear: number;
  statusLaunch;
  statusLand;
  strYear;
  strLaunch;
  strLand;
  noData: string = 'Fetching Data';
  blnNodata: boolean = false;
  config: PerfectScrollbarConfigInterface = {
    suppressScrollY: false,
    suppressScrollX: true
  }
  // Dependency Injection of service 
  constructor(private appService: AppComponentService, private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    // Loading Symbol 
    this.spinnerService.show();
    // Year Filter data 
    let year: number = 2005;
    let url;
    for (var i = 1; i <= 15; i++) {
      this.lstYears.push(
        {
          year: year + i
        }
      );
    }

    // Chceking sessionstorage to get previous values if any
    if (sessionStorage.getItem("year") != undefined && sessionStorage.getItem("year") != null && sessionStorage.getItem("year") != '') {
      this.strYear = sessionStorage.getItem("year");
    }
    if (sessionStorage.getItem("launchstatus") != undefined && sessionStorage.getItem("launchstatus") != null && sessionStorage.getItem("launchstatus") != '') {
      this.strLaunch = sessionStorage.getItem("launchstatus");
    }
    if (sessionStorage.getItem("landstatus") != undefined && sessionStorage.getItem("landstatus") != null && sessionStorage.getItem("landstatus") != '') {
      this.strLand = sessionStorage.getItem("landstatus");
    }
    if (sessionStorage.getItem("selectedYear") != undefined && sessionStorage.getItem("selectedYear") != null && sessionStorage.getItem("selectedYear") != '') {
      this.selectedYear = parseInt(sessionStorage.getItem("selectedYear"));
    }
    if (sessionStorage.getItem("statusLaunch") != undefined && sessionStorage.getItem("statusLaunch") != null && sessionStorage.getItem("statusLaunch") != '') {
      this.statusLaunch = sessionStorage.getItem("statusLaunch");
    }
    if (sessionStorage.getItem("statusLand") != undefined && sessionStorage.getItem("statusLand") != null && sessionStorage.getItem("statusLand") != '') {
      this.statusLand = sessionStorage.getItem("statusLand");
    }
    
    if (sessionStorage.getItem("url") != undefined && sessionStorage.getItem("url") != null && sessionStorage.getItem("url") != '') {
      url = sessionStorage.getItem("url");
    }
    else {
      url = environment.launchesAll;
    }
    // Fecthing default data
    this.fnGetData(url);
  }

  // Fetch data based on filter values applied for all combinations of year, land status, launch status
  fnGetFilterData(year, launchStatus, landStatus, filterType, filterValue) {
    if (filterType == 'year') {
      if (this.strYear != filterValue) {
        this.strYear = filterValue;
        this.selectedYear = year;
      }
      else {
        this.strYear = undefined;
        this.selectedYear = undefined;
        year = undefined;
        sessionStorage.removeItem("year");
        sessionStorage.removeItem("selectedYear");
      }
    }
    if (filterType == 'launch') {
      if (this.strLaunch != filterValue) {
        this.strLaunch = filterValue;
        this.statusLaunch = launchStatus;
      }
      else {
        this.strLaunch = undefined;
        this.statusLaunch = undefined;
        launchStatus = undefined;
        sessionStorage.removeItem("launchstatus");
        sessionStorage.removeItem("statusLaunch");
      }
    }
    if (filterType == 'land') {
      if (this.strLand != filterValue) {
        this.strLand = filterValue;
        this.statusLand = landStatus;
      } else {
        this.strLand = undefined;
        this.statusLand = undefined;
        landStatus = undefined;
        sessionStorage.removeItem("landstatus");
        sessionStorage.removeItem("statusLand");
      }
    }
    this.blnNodata = false;
    this.spinnerService.show();
    // storing current filter values in sessionstorage
    if (this.strYear != undefined && this.strYear != null) {
      sessionStorage.setItem("year", this.strYear.toString());
    }
    if (this.strLaunch != undefined && this.strLaunch != null) {
      sessionStorage.setItem("launchstatus", this.strLaunch.toString())
    }
    if (this.strLand != undefined && this.strLand != null) {
      sessionStorage.setItem("landstatus", this.strLand.toString())
    }
    if (this.selectedYear != undefined && this.selectedYear != null) {
      sessionStorage.setItem("selectedYear", this.selectedYear.toString());
    }
    if (this.statusLaunch != undefined && this.statusLaunch != null) {
      sessionStorage.setItem("statusLaunch", this.statusLaunch.toString())
    }
    if (this.statusLand != undefined && this.statusLand != null) {
      sessionStorage.setItem("statusLand", this.statusLand.toString())
    }
    // Setting service URL based on filter selected
    if (year == undefined) {
      if (landStatus == undefined) {
        if (launchStatus == undefined) {
          // URL for no filter
          let url = environment.launchesAll;
          this.fnGetData(url);
        }
        else {
          // URL for launch filter only
          let url = environment.launchesAll + '&launch_success=' + launchStatus
          this.fnGetData(url);
        }
      }
      else {
        if (launchStatus != undefined) {
          // URL for launch and land filter 
          let url = environment.launchesAll + '&launch_success=' + launchStatus + '&land_success=' + landStatus
          this.fnGetData(url)
        }
        else {
           // URL for land filter only
          let url = environment.launchesAll + '&land_success=' + landStatus
          this.fnGetData(url)
        }
      }
    }
    else {
      if (launchStatus != undefined && landStatus != undefined) {
         // URL for year, launch and land filter 
        let url = environment.launchesAll + '&launch_success=' + launchStatus + '&land_success=' + landStatus + '&launch_year=' + year
        this.fnGetData(url)
      }
      else if (launchStatus != undefined && landStatus == undefined) {
         // URL for launch and year filter 
        let url = environment.launchesAll + '&launch_success=' + launchStatus + '&launch_year=' + year
        this.fnGetData(url)
      }
      else if (launchStatus == undefined && landStatus != undefined) {
         // URL for year and land filter 
        let url = environment.launchesAll + '&land_success=' + landStatus + '&launch_year=' + year
        this.fnGetData(url)
      }
      else if (launchStatus == undefined && landStatus == undefined) {
         // URL for year filter only
        let url = environment.launchesAll + '&launch_year=' + year
        this.fnGetData(url)
      }
      else {
        // Hide loading symbol
        this.spinnerService.hide();
      }
    }
  }

  // Fetch Data from service
  fnGetData(url) {
    this.blnNodata = false;
    sessionStorage.setItem("url", url.toString());
    // Calling service to fetch data
    this.appService.getLaunchesData(url).subscribe(data => {
      this.noData = '';
      this.lstSpace = [];
      this.lstSpace = data;
      setTimeout(() => {
        this.spinnerService.hide();
        if (Object.keys(this.lstSpace).length === 0) {
          // Display message in case of no data
          this.blnNodata = true;
        }
        this.noData = 'Oops ! No Data Found ';
      }, 1000);
    });
  }

  ngOnDestroy() {
    // Clearing sessionstorage
    //sessionStorage.clear();
  }
}
