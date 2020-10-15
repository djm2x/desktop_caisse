import { Component, OnInit, Input } from '@angular/core';
import { Espece } from 'src/app/shared';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
  @Input() cIn = new Espece();
  constructor() { }

  ngOnInit() {
  }

}
