import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Personne, Societe, Cheque, Alimentation } from 'src/app/shared';
import { AlimentationService } from '../shared/alimentation.service';
import { SocieteService } from '../shared/societe.service';
import { ChequeService } from '../shared/cheque.service';
import { PersonneService } from '../shared/personne.service';
import { CaisseService } from '../shared/caisse.service';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-alimentation',
  templateUrl: './alimentation.component.html',
  styleUrls: ['./alimentation.component.scss']
})
export class AlimentationComponent implements OnInit {
  update = new EventEmitter<any>();
  o = new Alimentation();
  societe = new Societe();
  societes = this.societeS.getAll();
  filteredOptions: Observable<any>;
  isPersonne = true;
  public myForm: FormGroup;
  constructor(private fb: FormBuilder, private alimentaionS: AlimentationService
            , private personneS: PersonneService, private societeS: SocieteService
            , private chequeS: ChequeService, private caisseS: CaisseService) { }

  ngOnInit() {
    this.createForm();
    this.autoComplete();
    this.radioChange();
  }

  autoComplete() {
    this.filteredOptions = this.myForm.get('personne').get('nom').valueChanges.pipe(
      // startWith(''),
      switchMap((value: string) => {
        if (value.length > 1) {
          return this.personneS.filter(value);
        } else {
          this.myForm.get('personne').patchValue({ id: null, tel: '' });
          return [];
        }
      }),
      // map(r => r)
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const o = event.option.value as Personne;
    (this.myForm.get('personne') as FormGroup).patchValue(o);
    (this.myForm.get('idPersonne') as FormGroup).patchValue(o.id);
  }

  createForm() {
    this.myForm = this.fb.group({
      id: this.o.id,
      idPersonne: [this.o.idPersonne],
      idSociete: [this.o.idSociete, [Validators.required]],
      idCheque: [this.o.idCheque],
      montant: [this.o.montant, [Validators.required]],
      date: [ moment(this.o.date).format('YYYY-MM-DD'), [Validators.required]],
      personne: this.fb.group({
        id: [this.o.personne.id],
        nom: [this.o.personne.nom, [Validators.required]],
        tel: [this.o.personne.tel, [Validators.required]],
      }),
      // societe: this.fb.group({
      //   id: [this.o.societe.id],
      //   nom: [this.o.societe.nom, [Validators.required]],
      //   tel: [this.o.societe.tel, [Validators.required]],
      // }),
      cheque: this.fb.group({
        id: [this.o.cheque.id],
        num: [this.o.cheque.num, [Validators.required]],
        banque: [this.o.cheque.banque, [Validators.required]],
      }),
    });
  }

  async submit(o: Alimentation) {
    o.date = moment(o.date).format('YYYY-MM-DD') as any;
    if (this.isPersonne) {
      o.idPersonne = o.personne.id ? o.personne.id : await this.personneS.post(o.personne).toPromise();
      o.idSociete = null;
    } else {
      o.idPersonne = null;
      o.idCheque = await this.chequeS.post(o.cheque).toPromise();
    }

    await this.alimentaionS.post(o).toPromise();
    const montantCaisse = await this.caisseS.get().toPromise();
    await this.caisseS.postOrReplace(parseFloat(montantCaisse)  + parseFloat(o.montant.toString())).toPromise();
    this.update.next(true);
  }

  reset() {
    this.myForm.setValue(new Alimentation());
  }

  // societeSelect(s) {
  //   this.myForm.get('idSociete').patchValue(s.id);
  //   this.myForm.get('idSociete').patchValue(s);
  //   // this.societe = s;
  // }

  radioChange(o: { value: 1 } = { value: 1}) {
    this.isPersonne = o.value.toString() === '1' ? true : false;

    if (this.isPersonne) {
      this.myForm.get('personne').enable();
      // this.myForm.get('societe').get('id').disable();
      // this.myForm.get('societe').disable();
      this.myForm.get('idSociete').disable();
      this.myForm.get('idPersonne').enable();
      this.myForm.get('cheque').disable();
      this.myForm.get('idCheque').disable();
      // this.myForm.get('idCheque').disable();
    } else {
      this.myForm.get('personne').disable();
      this.myForm.get('personne').get('id').disable();
      // this.myForm.get('societe').get('id').enable();
      // this.myForm.get('societe').enable();
      this.myForm.get('idCheque').enable();
      this.myForm.get('cheque').enable();
      this.myForm.get('idSociete').enable();
      this.myForm.get('idPersonne').disable();
    }
  }
}
