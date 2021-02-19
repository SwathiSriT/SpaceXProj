import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { environment } from 'src/environments/environment.prod';
import { AppComponentService } from './app.component.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spacex';
  lstYears: { year: number }[] = [];
  lstSpace: object = [];
  selectedYear: number;
  statusLaunch;
  statusLand;
  strYear ;
  strLaunch = "";
  strLand = "";
  config: PerfectScrollbarConfigInterface = {
    suppressScrollY: false,
    suppressScrollX: true
  }
  constructor(private appService: AppComponentService) {
  }

  ngOnInit() {
    let year: number = 2005;
    for (var i = 1; i <= 15; i++) {
      this.lstYears.push(
        {
          year: year + i
        }
      );
    }
    console.log(this.lstYears)
    let url = environment.launchesAll;
    this.fnGetData(url)
    console.log(this.lstSpace);
  }

  fnGetFilterData(year, launchStatus, landStatus) {
    console.log(year, launchStatus, landStatus)
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
    }
  }
  fnGetData(url) {
    this.appService.getLaunchesData(url).subscribe(data => {
      console.log(data);
      this.lstSpace = [];
      this.lstSpace = data;
    });
  }


}
