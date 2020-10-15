import { Component, OnInit, Input, ViewChild } from '@angular/core';

const ASSETS_PATH = '../../../assets/';
const IMG_ERR = ASSETS_PATH + 'not-found.png';
@Component({
  selector: 'app-img-display',
  templateUrl: './img-display.component.html',
  styleUrls: ['./img-display.component.scss']
})
export class ImgDisplayComponent implements OnInit {
  @Input() img = '';
  @Input() width = '';
  @Input() height = '';
  @Input() radius = '';
  @Input() border = '';
  @Input() paddingRight = '';
  @Input() widthProgressBar = '';
  @Input() heightProgressBar = '';
  @ViewChild('im', { static: true }) imgHTML: any; // ElementRef;
  isImageLoading = true;

  constructor(
    // private http: HttpClient, @Inject(PLATFORM_ID) protected platformId: Object
    ) { }

  ngOnInit() {
    // this.getImageFromService();
  }

  // service(): Observable<Blob> {
  //   return this.http.get(/*API_URL + */this.img, { responseType: 'blob' });
  // }

  // getImageFromService() {
  //   // this.imgHTML.nativeElement.src = IMG2_GIF;
  //   this.imgHTML.nativeElement.src = IMG_Loading;
  //   // this.isImageLoading = true;
  //   this.service().subscribe(
  //     data => {
  //       if (isPlatformBrowser(this.platformId)) {
  //         this.imgHTML.nativeElement.src = URL.createObjectURL(data);
  //       }
  //       // this.isImageLoading = false;
  //     }, error => {
  //       // console.log(error);
  //       this.imgHTML.nativeElement.src = IMG_ERR;
  //     }
  //   );
  // }

  imgError(img: any) {
    // console.log('er', img.src);
    img.src = IMG_ERR;
  }
}
