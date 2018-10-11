import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  src1 = 'assets/shibe.gif';

  src2 = 'assets/cat.gif';

  activeSrc = this.src1;

  constructor() { }


  ngOnInit() {
  }

  switchPicture() {
    if (this.activeSrc === this.src1) {
      this.activeSrc = this.src2
    } else {
      this.activeSrc = this.src1
    }
  }

}
