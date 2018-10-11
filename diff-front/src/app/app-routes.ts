import {RouterModule, Routes} from "@angular/router";
import {MainPageComponent} from "./main-page/main-page.component";
import {NgModule} from "@angular/core";
import {DiffComponent} from "./diff/diff.component";
import {SettingsComponent} from "./settings/settings.component";
import {CallbackComponent} from "./auth/callback/callback.component";
import {AuthGuard} from "./auth/auth.guard";
import {LoginPageComponent} from "./login-page/login-page.component";
import {VkToolsComponent} from "./vk-tools/vk-tools.component";

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    pathMatch: 'full',
    // canActivate: [AuthGuard],
  },
  {
    path: 'diff',
    component: DiffComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'vk',
    component: VkToolsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
