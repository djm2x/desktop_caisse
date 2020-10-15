import { Component, OnInit } from '@angular/core';
import { DashService } from '../shared/dash.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  list: { name: string, api: Observable<any> }[] = [
    { name: ' Caisse', api: this.s.mTotal },
    { name: ' Alimentation', api: this.s.mEntree },
    { name: ' Depense', api: this.s.mDepense },
  ];
  constructor(private s: DashService) { }

  ngOnInit() {
    this.s.mergeObs().subscribe(
      r => {
        console.log(r);
      }
    );
  }

}
