import {RouterModule, Routes} from "@angular/router";
import {MainPageComponent} from "./main-page/main-page.component";
import {NgModule} from "@angular/core";
import {DiffComponent} from "./diff/diff.component";
import {SettingsComponent} from "./settings/settings.component";

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'diff',
    component: DiffComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
