import { Component, OnInit } from '@angular/core';
import { NodeService } from 'src/app/database/db.helper.service';
import { map } from 'rxjs/operators';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Alimentation, Depense } from 'src/app/shared';
import { PersonneService } from '../shared/personne.service';
import { SocieteService } from '../shared/societe.service';
import { ChequeService } from '../shared/cheque.service';
import { EspeceService } from '../shared/espece.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  panelOpenState = false;
  myForm: FormGroup;
  listA: Alimentation[] = [];
  sumA = 0;
  listD: Depense[] = [];
  listS = [];
  listB = [];
  listM = [];
  isAlimentation = true;
  d = new FormControl(new Date());
  sumD = 0;
  sumS = 0;
  sumB = 0;
  constructor(private db: NodeService, private fb: FormBuilder
    , private personneS: PersonneService, private societeS: SocieteService
    , private chequeS: ChequeService, private especeS: EspeceService) { }

  ngOnInit() {
  }

  searchDate(selectedDate) {
    const d1 = moment(selectedDate).format('YYYY-MM-DD') as string;
    console.log(d1);
    const req = `select *
              from alimentation
              where date(date)='${d1}'`;
    this.db.execQueryObs(req).subscribe(
      (r) => {
        this.listA = r[0] as Alimentation[];
        this.listA.forEach(async (e) => {
          e.personne = e.idPersonne ? await this.personneS.get(e.idPersonne).toPromise() : null;
          e.societe = e.idSociete ? await this.societeS.get(e.idSociete).toPromise() : null;
          e.cheque = e.idCheque ? await this.chequeS.get(e.idCheque).toPromise() : null;
        });
        this.sumA = this.sum(this.listA);
        console.log(r[0]);
      }
    );
  }

  searchBenifecaire(txt) {
    const txt1 = txt.value;
    console.log(txt1);
    const req = `select *
                from depense
                where (beneficiaire)='${txt1}'`;
    this.db.execQueryObs(req).subscribe(
      (r) => {
        console.log(r);
        this.listD = r[0] as Depense[];
        this.sumD = this.sum(this.listD);
      }
    );
  }

  searchSociete(txtSociete) {
    const txtsociete = txtSociete.value;
    const req = `select montant,date
                 from  alimentation INNER JOIN  societe
                 on alimentation.idsociete=societe.id
                 where (societe.nom)='${txtsociete}'`;
    this.db.execQueryObs(req).subscribe(
      (r) => {
        this.listS = r[0] as Alimentation[];
        // this.listS.forEach(async (s) => {
        //   s.societe = s.idSociete ? await this.societeS.get(s.idSociete).toPromise() : null;
        // });
        this.sumS = this.sum(this.listS);
      }
    );
  }
  searchBanque(txtBanque) {

    const txtbanque = txtBanque.value;
    const req = `select montant,date,cheque.num,societe.nom
    from  alimentation INNER JOIN  societe
    on alimentation.idsociete=societe.id
    INNER JOIN cheque on alimentation.idcheque=cheque.id
    where (cheque.banque)='${txtbanque}'`;

    this.db.execQueryObs(req).subscribe(
      (r) => {
        this.listB = r[0] as Alimentation[];
        // this.listB.forEach(async (s) => {
        //   s.societe = s.idSociete ? await this.societeS.get(s.idSociete).toPromise() : null;
        //   s.cheque = s.idcheque ? await this.chequeS.get(s.idcheque).toPromise() : null;
        // });
        this.sumB = this.sum(this.listB);
      }
    );

  }

  sum(list: any[]) {
    return list.length !== 0 ? list.map(e => e.montant).reduce((a, c) => a + c) : 0;
  }

  radioChange(o: { value: 1 } = { value: 1 }) {
    this.isAlimentation = o.value.toString() === '1' ? true : false;
  }

  searchMontant(txtMontant) {
    const txtmontant = txtMontant.value;
    if (this.isAlimentation) {

      const req = `select
        date,
        s.nom AS societe,
        p.nom as client
      from  alimentation a
        left JOIN societe s on a.idsociete = s.id
        left JOIN personne p on a.idpersonne = p.id
      where a.montant='${txtmontant}'`;

      this.db.execQueryObs(req).subscribe(
        (r) => {
          this.listM = r[0] as Alimentation[];
          // this.listA.forEach(async (s) => {
          //   s.societe = s.idSociete ? await this.societeS.get(s.idSociete).toPromise() : null;
          //   s.personne = s.idPersonne ? await this.personneS.get(s.idPersonne).toPromise() : null;
          // });
        }
      );

    } else {
      const req = `select * from depense
      where (montant)='${txtmontant}'`;

      this.db.execQueryObs(req).subscribe(
        (r) => {
          console.log(r);
          this.listD = r[0] as Depense[];
        }
      );
    }
  }
}
