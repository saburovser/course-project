import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import {AppRoutingModule} from "./app-routes";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { HeaderComponent } from './header/header.component';
import {FormsModule} from "@angular/forms";
import {HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { DiffComponent } from './diff/diff.component';
import { SettingsComponent } from './settings/settings.component';
import {AuthService} from "./auth/auth.service";
import { CallbackComponent } from './auth/callback/callback.component';
import {AuthGuard} from "./auth/auth.guard";
import { LoginPageComponent } from './login-page/login-page.component';
import { VkToolsComponent } from './vk-tools/vk-tools.component';
import {VkService} from "./vk-tools/vk.service";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    HeaderComponent,
    DiffComponent,
    SettingsComponent,
    CallbackComponent,
    LoginPageComponent,
    VkToolsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgZorroAntdModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    AuthService,
    VkService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
