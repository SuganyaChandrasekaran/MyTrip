import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { Home2Component } from './components/home2/home2.component';
import { AuthGuard } from './services/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { NetworkComponent } from './components/network/network.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { FriendsComponent } from './components/friends/friends.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AdminGuard } from './services/admin.guard';
import { ManageUserComponent } from './components/manage-user/manage-user.component';

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path:"register", component: RegisterComponent},
  {path:"login", component:LoginComponent},
  {path:"forgetpassword", component:ForgetpasswordComponent},
  {path:"resetpassword", component:ResetpasswordComponent},
  {path:"home", component:Home2Component,canActivate: [AuthGuard]},
  {path:"users", component: UsersListComponent, canActivate: [AdminGuard]},
  {path:"manageuser/:id",component: ManageUserComponent, canActivate: [AdminGuard]},
  {path:"network", component:NetworkComponent,canActivate: [AuthGuard]},
  {path:"friends", component:FriendsComponent, canActivate:[AuthGuard]},
  {path:"setting", component:SettingsComponent,canActivate:[AuthGuard]},
  {path:"changepassword", component:ChangepasswordComponent,canActivate:[AuthGuard]},
  {path:"logout", component:LogoutComponent,canActivate:[AuthGuard]},
  {path: '**', redirectTo: "" }
]; 

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
