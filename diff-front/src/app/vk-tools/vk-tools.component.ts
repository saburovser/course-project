import { Component, OnInit } from '@angular/core';
import {VkService} from "./vk.service";

@Component({
  selector: 'app-vk-tools',
  templateUrl: './vk-tools.component.html',
  styleUrls: ['./vk-tools.component.css'],
})
export class VkToolsComponent implements OnInit {

  constructor(private vk: VkService) { }

  ngOnInit() {

  }

  loadPhotos() {
    this.vk.getPhotos('40397546_258645098').subscribe(data => console.log(data));
  }

  login() {
    this.vk.login();
  }

}
