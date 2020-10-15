import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User, Depense } from '../../../app/shared/models';
import { MatPaginator, MatDialog } from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { TableDataSource } from 'src/app/shared/table-datasource';
import { DepenseService } from '../shared/depense.service';
import { CaisseService } from '../shared/caisse.service';
import * as moment from 'moment';

@Component({
  selector: 'app-depense',
  templateUrl: './depense.component.html',
  styleUrls: ['./depense.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DepenseComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  update: EventEmitter<any> = new EventEmitter();
  dataSource = [];
  dataSourceHandler: TableDataSource;
  //
  columnDefs = [
    { columnDef: 'beneficiaire', headName: 'beneficiaire' },
    { columnDef: 'montant', headName: 'montant' },
    { columnDef: 'justificativ', headName: 'Justificatif' },
    { columnDef: 'date', headName: 'date' },
    { columnDef: 'option', headName: 'Option' },
  ];

  i = 0;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
  ];
  //
  public myForm: FormGroup;
  o = new Depense();
  montantOld = 0; // needed for update the montant of caisse
  expandedElement: Depense | null;
  isEdit = false;
  // typeDepenses = this.superS.get('typeDepense');
  constructor(private service: DepenseService, private fb: FormBuilder
    ,         private caisseS: CaisseService) { }

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
      beneficiaire: [this.o.beneficiaire, Validators.required],
      montant: [this.o.montant, Validators.required],
      justificativ: [this.o.justificativ, Validators.required],
      date: [moment(this.o.date).format('YYYY-MM-DD'), Validators.required],
    });
  }

  resetForm() {
    this.o = new Depense();
    this.createForm();
  }

  submit(myForm: FormGroup) {
    const obj: Depense = myForm.value;
    obj.date = moment(obj.date).format('YYYY-MM-DD') as any;
    if (!this.isEdit) {
      this.post(obj);
    } else {
      this.put(obj);
    }
  }

  post(obj: any) {
    this.service.post(obj).subscribe(
      async (r: any) => {
        console.log(r);
        const montantCaisse = await this.caisseS.get().toPromise();
        await this.caisseS.postOrReplace(parseFloat(montantCaisse) - parseFloat(obj.montant.toString())).toPromise();
        this.update.next(true);
        this.resetForm();
      }
    );
  }

  put(obj: any) {
    this.service.put(obj).subscribe(
      async (r: any) => {
        console.log(r);
        const montantCaisse = await this.caisseS.get().toPromise();
        const mUpd = parseFloat(montantCaisse) + parseFloat(`${this.montantOld}`) - parseFloat(`${obj.montant}`);
        await this.caisseS.postOrReplace(mUpd).toPromise();
        this.update.next(true);
        this.isEdit = false;
        this.resetForm();
      }
    );
  }

  delete(o) {
    this.service.delete(o.id).subscribe(
      async (r: any) => {
        console.warn(r[1].sql);
        const montantCaisse = await this.caisseS.get().toPromise();
        await this.caisseS.postOrReplace(parseFloat(montantCaisse) + parseFloat(o.montant.toString())).toPromise();
        this.update.next(true);
      }
    );
  }

  edit(o: any) {
    console.log(o);
    this.o = o;
    this.montantOld = o.montant;
    this.isEdit = true;
    this.createForm();
  }

  reset() {
    this.resetForm();
    this.isEdit = false;
  }
}
