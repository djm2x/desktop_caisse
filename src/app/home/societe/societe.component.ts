import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User, Depense, Societe } from '../../../app/shared/models';
import { MatPaginator, MatDialog } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { TableDataSource } from 'src/app/shared/table-datasource';
import { DepenseService } from '../shared/depense.service';
import { SocieteService } from '../shared/societe.service';

@Component({
  selector: 'app-societe',
  templateUrl: './societe.component.html',
  styleUrls: ['./societe.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SocieteComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  update: EventEmitter<any> = new EventEmitter();
  dataSource = [];
  dataSourceHandler: TableDataSource;
  //
  columnDefs = [
    { columnDef: 'nom', headName: 'nom' },
    { columnDef: 'tel', headName: 'tel' },
    { columnDef: 'option', headName: 'Option' },
  ];

  i = 0;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
  ];
  //
  public myForm: FormGroup;
  o = new Societe();
  expandedElement: Societe | null;
  isEdit = false;
  // typeDepenses = this.superS.get('typeDepense');
  constructor(private service: SocieteService, private fb: FormBuilder) { }

  async ngOnInit() {
    // const list = await this.service.getAll();

    // console.log(list);
    this.dataSourceHandler = new TableDataSource(this.paginator, this.service, this.update);
    // data is subscribed now , every event happen the will change and ofcource the datasource for table
    this.dataSourceHandler.methode().subscribe(data => {
      this.dataSource = data;
      // console.log(data);
    });
    this.createForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      id: this.o.id,
      nom: [this.o.nom, Validators.required],
      tel: [this.o.tel, Validators.required],
    });
  }

  resetForm() {
    this.o = new Societe();
    this.createForm();
  }

  submit(myForm: FormGroup) {
    const obj: any = myForm.value;
    if (!this.isEdit) {
      this.post(obj);
    } else {
      this.put(obj);
    }
  }

  post(obj: any) {
    this.service.post(obj).subscribe(
      (r: any) => {
        console.log(r);
        this.update.next(true);
        this.resetForm();
      }
    );
  }

  put(obj: any) {
    this.service.put(obj).subscribe(
      (r: any) => {
        this.update.next(true);
        console.log(r);
        this.isEdit = false;
        this.resetForm();
      }
    );
  }

  delete(o) {
    this.service.delete(o.id).subscribe(
      (r: any) => {
        this.update.next(true);
      }
    );
  }

  edit(o: any) {
    console.log(o);
    this.o = o;
    this.isEdit = true;
    this.createForm();
  }

  reset() {
    this.resetForm();
    this.isEdit = false;
  }
}

