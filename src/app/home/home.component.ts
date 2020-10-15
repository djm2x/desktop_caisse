import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SessionService } from '../shared/session.service';
import { User } from '../shared';
import { RouterOutlet, Router } from '@angular/router';
import { routerTransition } from '../utils/animations';
import { CaisseService } from './shared/caisse.service';
import { NodeService } from '../database/db.helper.service';
import { TitleBarService } from '../shared/title-bar.service';
import { MatButton } from '@angular/material';
const ipc = (window as any).require('electron').ipcRenderer;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransition],
})
export class HomeComponent implements OnInit {
  @ViewChild('btndev', { static: true }) btndev: MatButton;
  keyDevTools = '';
  panelOpenState = false;
  mobileQuery: MediaQueryList;
  currentSection = 'section1';
  userImg = '../../assets/caisse.jpg';
  opened = true;
  user = new User();
  idRole = -1;
  isConnected = false;
  montantCaisse = this.s.notify;
  constructor(private session: SessionService, changeDetectorRef: ChangeDetectorRef
    , media: MediaMatcher, private s: CaisseService, public router: Router
    , private titleBar: TitleBarService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addListener((e: MediaQueryListEvent) => changeDetectorRef.detectChanges());
  }

  ngOnInit() {
    // if (!this.session.isSignedIn) {
    //   this.router.navigate(['/auth']);
    // } else {
    //   this.isConnected = true;
    //   this.user = this.session.user;
    // }
    // this.session.notif.subscribe(
    //   r => {
    //     this.isConnected = r.is;
    //     this.user = r.user;
    //     console.log(r);
    //   }
    // );
    this.btndev._elementRef.nativeElement.addEventListener('keydown', event => {
      console.log(event.key);
      this.keyDevTools += event.key;
    });
  }

  devTools() {
    if (this.keyDevTools !== '1991') {
      this.keyDevTools = '';
    } else {
      ipc.prependOnceListener('page', (event, r) => {
        console.log(r);
        this.keyDevTools = '';
      });
      ipc.send('main', 'plz click for me');
    }
  }

  do(action) {
    this.titleBar.post(action);
  }


  disconnect() {
    this.session.doSignOut();
    this.router.navigate(['/auth']);
  }

  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }
}
