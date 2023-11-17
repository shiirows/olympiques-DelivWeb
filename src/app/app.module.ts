import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HeadingComponent } from './pages/heading/heading.component';
import { DetailPaysComponent } from './pages/detail-pays/detail-pays.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, HeadingComponent, DetailPaysComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
