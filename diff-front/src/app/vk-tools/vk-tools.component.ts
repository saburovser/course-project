import { Component, OnInit } from '@angular/core';
import {VkService} from "./vk.service";
import {HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-vk-tools',
  templateUrl: './vk-tools.component.html',
  styleUrls: ['./vk-tools.component.css'],
})
export class VkToolsComponent implements OnInit {

  imageUrls: string[] = [];
  albumUrl: string;

  constructor(private vk: VkService) { }

  ngOnInit() {

  }

  loadPhotos() {
    const { owner_id, album_id } = this.vk.parseAlbumUrl(this.albumUrl);
    console.log(owner_id, album_id);
    this.vk.getPhotos(owner_id, album_id)
      .subscribe(res  => {
        this.imageUrls = res.response.items.map(img => img.sizes.sort((size1, size2) => size2.width - size1.width)[0].url);
      });
    console.log(this.imageUrls);
  }

  login() {
    // this.vk.login();
  }



}

export class CommonResponse<T> {
  response: T
}

export class Photos {
  count: number;

  items: Photo[];
}

export class Photo {
  album_id: number;
  date: number;
  id: number;
  owner_id: number;
  sizes: PhotoSize[];
  text: string;
  user_id: number;
}

export class PhotoSize {
  type: string;
  url: string;
  width: number;
  height: number;
}
