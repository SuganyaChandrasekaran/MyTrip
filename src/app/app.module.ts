import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { Home2Component } from './components/home2/home2.component';
import { AuthGuard } from './services/auth.guard';
import { AuthInterceptor } from './services/auth.interceptor';
import { LogoutComponent } from './components/logout/logout.component';
import { NetworkComponent } from './components/network/network.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { FriendsComponent } from './components/friends/friends.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    ForgetpasswordComponent,
    ResetpasswordComponent,
    Home2Component,
    LogoutComponent,
    NetworkComponent,
    SettingsComponent,
    ChangepasswordComponent,
    FriendsComponent,
    UsersListComponent,
    ManageUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    { provide:HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
