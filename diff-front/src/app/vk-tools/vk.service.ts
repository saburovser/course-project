import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs/internal/Observable";
import {CommonResponse, Photos} from "./vk-tools.component";

@Injectable()
export class VkService {

  constructor(private http: HttpClient,
              private router: Router) {

  }

  getPhotos(owner_id: string, albumId: string): Observable<CommonResponse<Photos>> {
    let params = new HttpParams()
      .set('owner_id', owner_id)
      .set('album_id', albumId)
      .set('access_token', 'd4963de9d4963de9d4963de964d4f0b9b6dd496d4963de98f429852e84fd025af137bee')
      .set('v', '5.85')
      .set('count', '1000');
    const url = 'https://api.vk.com/method/photos.get';
    return this.http.jsonp<CommonResponse<Photos>>(`${url}?${params.toString()}`, 'callback');
  }

  callback(res) {
    console.log(res);
  }

  login() {
    window.open('https://oauth.vk.com/authorize?client_id=6718559&display=page&redirect_uri=http://localhost:4200/vklogin&response_type=token&v=5.85', '_self');
  }

  parseAlbumUrl(url: string) {
    return {
      owner_id: url.slice(url.indexOf('album') + 5, url.indexOf('_')),
      album_id: url.slice(url.indexOf('_') + 1),
    };
  }
}
