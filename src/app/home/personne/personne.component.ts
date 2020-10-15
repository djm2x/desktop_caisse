import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { startWith, map, switchMap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, merge } from 'rxjs';
import { Personne } from 'src/app/shared';
import { PersonneService } from '../shared/personne.service';
import { MatPaginator, MatAutocompleteSelectedEvent } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-personne',
  templateUrl: './personne.component.html',
  styleUrls: ['./personne.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PersonneComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  resultsLength = 0;
  update = new EventEmitter<any>();
  dataSource = [];
  columnDefs = [
    { columnDef: 'nom', headName: 'nom' },
    { columnDef: 'tel', headName: 'tel' },
    { columnDef: 'option', headName: 'Option' },
  ];

  i = 0;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['nom', 'tel', 'option'];

  public myForm: FormGroup;
  o = new Personne();
  expandedElement: Personne | null;
  isEdit = false;

  filteredOptions: Observable<any>;

  constructor(private service: PersonneService, private fb: FormBuilder) { }

  ngOnInit() {
    this.getPage(0, 15);

    merge(...[this.paginator.page, this.update]).subscribe(
      r => {
        if (r === true) {
          this.paginator.pageIndex = 0;
        }
        // this.isLoadingResults = true;
        if (!this.paginator.pageSize) {
          this.paginator.pageSize = 15;
        }
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;

        this.getPage(startIndex, this.paginator.pageSize);
      }
    );

    this.createForm();
    this.autoComplete();
  }

  autoComplete() {
    this.filteredOptions = (this.myForm.get('nom') as FormControl).valueChanges.pipe(
      // startWith(''),
      switchMap((value: string) => value.length > 1 ? this.service.filter(value) : []),
      // map(r => r)
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const o = event.option.value as Personne;
    (this.myForm.get('nom') as FormControl).patchValue(o.nom);
    this.o = o;
    this.isEdit = true;
    this.createForm();
  }

  getPage(startIndex, pageSize) {
    this.service.getPage(startIndex, pageSize).subscribe(
      r => {
        this.dataSource = r.list;
        this.resultsLength = r.count;
      }
    );
  }

  createForm() {
    this.myForm = this.fb.group({
      id: this.o.id,
      nom: [this.o.nom, Validators.required],
      tel: [this.o.tel, Validators.required],
    });
  }

  resetForm() {
    this.o = new Personne();
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
