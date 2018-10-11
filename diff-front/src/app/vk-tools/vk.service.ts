import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable()
export class VkService {

  constructor(private http: HttpClient,
              private router: Router) {

  }

  getPhotos(albumId: string) {
    let params = new HttpParams().set('album_id', albumId);
    return this.http.get('https://api.vk.com/method/photos.get', {
      params: params
    })
  }

  login() {
    window.open('https://oauth.vk.com/authorize?client_id=6718559&display=page&redirect_uri=http://distance.host/vk&response_type=token&v=5.85')
  }
}
