import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { environment } from 'src/environments/environment.prod';
import { AppComponentService } from './app.component.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spacex';
  lstYears: { year: number }[] = [];
  lstSpace: object  = [];
  selectedYear: number;
  statusLaunch;
  statusLand;
  strYear ;
  strLaunch = "";
  strLand = "";
  noData:string='Fetching Data'; 
  blnNodata:boolean=false;

  config: PerfectScrollbarConfigInterface = {
    suppressScrollY: false,
    suppressScrollX: true
  }
  constructor(private appService: AppComponentService,  private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.show();
    let year: number = 2005;
    for (var i = 1; i <= 15; i++) {
      this.lstYears.push(
        {
          year: year + i
        }
      );
    }
    let url = environment.launchesAll;    
    this.fnGetData(url)
  }

  fnGetFilterData(year, launchStatus, landStatus) {
    this.blnNodata=false;
    this.spinnerService.show();
    this.selectedYear = year;
    this.statusLand = landStatus;
    this.statusLaunch = launchStatus;
    if (year == undefined) {
      if (landStatus == undefined) {
        let url = environment.launchesAll + '&launch_success=' + launchStatus
        this.fnGetData(url)
      }
      else {
        if (launchStatus != undefined) {
          let url = environment.launchesAll + '&launch_success=' + launchStatus + '&land_success=' + landStatus
          this.fnGetData(url)
        }
        else {
          let url = environment.launchesAll + '&land_success=' + landStatus
          this.fnGetData(url)
        }
      }
    }
    else {
      if (launchStatus != undefined && landStatus != undefined) {
        let url = environment.launchesAll + '&launch_success=' + launchStatus + '&land_success=' + landStatus + '&launch_year=' + year
        this.fnGetData(url)
      }
      else if (launchStatus != undefined && landStatus == undefined) {
        let url = environment.launchesAll + '&launch_success=' + launchStatus + year
        this.fnGetData(url)
      }
      else if (launchStatus == undefined && landStatus != undefined) {
        let url = environment.launchesAll + '&land_success=' + landStatus + '&launch_year=' + year
        this.fnGetData(url)
      }
      else if (launchStatus == undefined && landStatus == undefined) {
        let url = environment.launchesAll + '&launch_year=' + year
        this.fnGetData(url)
      }
      else
      {
        this.spinnerService.hide();
      }
    }
   
  }
  fnGetData(url) {
    this.blnNodata=false;
    this.appService.getLaunchesData(url).subscribe(data => {
      this.noData='';
      this.lstSpace = [];
      this.lstSpace = data;    
      setTimeout(()=>
      {this.spinnerService.hide();   
         if(Object.keys(this.lstSpace).length === 0  )  
         {
          this.blnNodata=true;
         }        
        this.noData='Oops ! No Data Found ';
      },1000);
    });
  }
}
