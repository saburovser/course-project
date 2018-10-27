import {Component, OnInit} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.fragment.subscribe(data => {
      if (data) {

      }
    });
  }
}
