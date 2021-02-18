import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable(
  {
    providedIn: 'root'
  }
)

export class AppComponentService {

  constructor(private httpClient: HttpClient) {
  }

  getLaunchesData(url) {
    return this.httpClient.get(url);
  }
}