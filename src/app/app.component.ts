import { Component, OnInit } from '@angular/core';
import { NodeService } from './database/db.helper.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'caisse';
  constructor(private service: NodeService) { }

  async ngOnInit() {
    this.service.connecte()
      .then(() => { })
      .catch((e) => console.log('db cnx 0 : ', e));
    // const list = await this.service.executeQuery('select * from depense', []);
    // console.log('list : ', list);
    // if (this._electronService.isElectronApp) {
    //   // const pong: string = this._electronService.ipcRenderer.sendSync('dj');
    //   console.log(this._electronService);
    // }
    // this.connect();
  }
}
