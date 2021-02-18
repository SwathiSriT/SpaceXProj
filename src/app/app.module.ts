import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

const PERFECT_SCROLL_BAR: PerfectScrollbarConfigInterface = {
suppressScrollX: true,
wheelPropagation: true,
suppressScrollY: false
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, PerfectScrollbarModule 
  ],
  providers: [{
    provide:PERFECT_SCROLLBAR_CONFIG,
    useValue: PERFECT_SCROLL_BAR 
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
