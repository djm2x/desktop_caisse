import { Component, OnInit, EventEmitter, ViewChild, Input } from '@angular/core';
import { startWith, map, switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { Alimentation, Personne, Societe, Cheque } from 'src/app/shared';
import { MatPaginator, MatAutocompleteSelectedEvent, MatDialog } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AlimentationService } from '../shared/alimentation.service';
import { PersonneService } from '../shared/personne.service';
import { ChequeService } from '../shared/cheque.service';
import { CaisseService } from '../shared/caisse.service';
import { SocieteService } from '../shared/societe.service';
import { DeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-entree',
  templateUrl: './entree.component.html',
  styleUrls: ['./entree.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EntreeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  isLoadingResults = true;
  resultsLength = 0;
  isRateLimitReached = false;
  @Input() update: EventEmitter<any> = new EventEmitter();
  dataSource = [];
  columnDefs = [
    // { columnDef: 'id', headName: 'id' },
    // { columnDef: 'idEspece', headName: 'idEspece' },
    // { columnDef: 'idCheque', headName: 'idCheque' },
    // { columnDef: 'idSociete', headName: 'idSociete' },
    // { columnDef: 'idPersonne', headName: 'idPersonne' },
    { columnDef: 'montant', headName: 'montant' },
    { columnDef: 'date', headName: 'date' },
    { columnDef: 'option', headName: 'Option' },
  ];

  i = 0;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    this.columnDefs[this.i++].columnDef,
    // this.columnDefs[this.i++].columnDef,
    // this.columnDefs[this.i++].columnDef,
    // this.columnDefs[this.i++].columnDef,
    // this.columnDefs[this.i++].columnDef,
    // this.columnDefs[this.i++].columnDef,
  ];

  paymentFrom: FormGroup;
  clientFrom: FormGroup;

  personne = new Personne();
  societe = new Societe();
  cheque = new Cheque();
  societes = this.societeS.getAll();
  personnes = this.personneS.getAll();
  date = new Date();
  // filteredOptions: Observable<any>;

  public myForm: FormGroup;
  o = new Alimentation();
  expandedElement: Alimentation | null;
  isEdit = false;

  constructor(private fb: FormBuilder, private alimentaionS: AlimentationService
            , private personneS: PersonneService, private societeS: SocieteService
            , private chequeS: ChequeService, private caisseS: CaisseService
            , public dialog: MatDialog) { }

  ngOnInit() {
    this.getPage(0, 5);
    merge(...[this.paginator.page, this.update]).subscribe(
      r => {
        r === true ? this.paginator.pageIndex = 0 : r = r;
        !this.paginator.pageSize ? this.paginator.pageSize = 5 : r = r;
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.isLoadingResults = true;
        this.getPage(startIndex, this.paginator.pageSize);
      }
    );

    this.createForm();
    this.myForm.get('idSociete').disable();
    this.createFormPayment();
  }

  async expandedTable(o: Alimentation) {
    if (this.expandedElement === o) {
      this.expandedElement = null;
      return this.expandedElement;
    }
    o.cheque = await this.chequeS.get(o.idCheque).toPromise();
    o.personne = await this.personneS.get(o.idPersonne).toPromise();
    o.societe = await this.societeS.get(o.idSociete).toPromise();
    this.expandedElement = o;
    return this.expandedElement;
  }

  getPage(startIndex, pageSize) {
    this.alimentaionS.getPage(startIndex, pageSize).subscribe(
      r => {
        console.log(r);
        this.dataSource = r.list;
        this.resultsLength = r.count;
        this.isLoadingResults = false;
      }
    );
  }

  createForm() {
    this.myForm = this.fb.group({
      id: this.o.id,
      idCheque: [this.o.idCheque],
      idPersonne: [this.o.idPersonne, Validators.required],
      idSociete: [this.o.idSociete, Validators.required],
      date: [this.o.date],
      montant: [this.o.montant],
    });
  }

  createFormPayment() {
    this.paymentFrom = this.fb.group({
      cheque: this.fb.group({
        id: [this.cheque.id],
        num: [this.cheque.num, [Validators.required]],
        banque: [this.cheque.banque, [Validators.required]],
      })
    });
  }

  reset() {
    this.o = new Alimentation();
    this.cheque = new Cheque();
    this.createForm();
    this.createFormPayment();
    this.myForm.get('idSociete').disable();
    this.isEdit = false;
  }

  async submit(f: FormGroup, p: FormGroup) {
    // const obj: any = myForm.value;
    const { espece, cheque } = p.value as { espece: any, cheque: any };
    // const {personne, societe} = f.value as { personne: any, societe: any };
    const o = f.value as Alimentation;
    if (!this.isEdit) {
      o.idCheque = await this.chequeS.post(cheque).toPromise();
    } else {
      await this.chequeS.put(cheque).toPromise();
    }
    const newMontant = parseFloat(espece ? espece.montant : 0) + parseFloat(cheque ? cheque.montant : 0);
    const montantToSet = newMontant - o.montant;
    console.log(o.montant, newMontant);
    o.montant = newMontant;
    await this.alimentaionS.post(o).toPromise();
    const montantCaisse = await this.caisseS.get().toPromise();
    await this.caisseS.postOrReplace(montantCaisse + montantToSet).toPromise();
    this.isEdit = false;
    this.update.next(true);
    this.reset();
  }

  openDialog(o) {
    this.alimentaionS.delete(o.id).subscribe(
      async (r: any) => {
        const montantCaisse = await this.caisseS.get().toPromise();
        await this.caisseS.postOrReplace(parseFloat(montantCaisse) - parseFloat(o.montant.toString())).toPromise();
        this.update.next(true);
      }
    );
    // const dialogRef = this.dialog.open(DeleteComponent, {
    //   width: '750px',
    //   disableClose: true,
    //   // data: { user: o }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === undefined) {
    //     console.log('vous avez quittez le dialog');
    //   } else {
    //     this.alimentaionS.delete(o.id).subscribe(
    //       async (r: any) => {
    //         const montantCaisse = await this.caisseS.get().toPromise();
    //         await this.caisseS.postOrReplace(montantCaisse + o.montant).toPromise();
    //         this.update.next(true);
    //       }
    //     );
    //   }
    // });
  }

  async edit(o: Alimentation) {
    o.cheque = await this.chequeS.get(o.idCheque).toPromise();
    console.log(o);
    this.paymentFrom.get('cheque').patchValue(o.cheque);
    this.o = o;
    console.log(this.o);
    this.isEdit = true;
    this.createForm();
  }

  check(o: { name: string, checked: boolean }) {
    console.log(o);
    if (o.name === '1') {
      o.checked ? this.paymentFrom.get('espece').disable() : this.paymentFrom.get('espece').enable();
    } else if (o.name === '2') {
      o.checked ? this.paymentFrom.get('cheque').disable() : this.paymentFrom.get('cheque').enable();
    }
  }

  radioChange(o: { value: number }) {
    if (o.value.toString() === '1') {
      this.myForm.get('idPersonne').enable();
      this.myForm.get('idSociete').disable();
    } else {
      this.myForm.get('idSociete').enable();
      this.myForm.get('idPersonne').disable();
    }
  }
}
