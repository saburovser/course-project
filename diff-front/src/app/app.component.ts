import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  src1 = 'assets/shibe.gif';

  src2 = 'assets/cat.gif';

  activeSrc = this.src1;

  switchPicture() {
    if (this.activeSrc === this.src1) {
      this.activeSrc = this.src2
    } else {
      this.activeSrc = this.src1
    }
  }
}
