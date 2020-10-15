import { Component, OnInit } from '@angular/core';
import { AlimentationService } from '../shared/alimentation.service';
import { SocieteService } from '../shared/societe.service';
import { ChequeService } from '../shared/cheque.service';
import { PersonneService } from '../shared/personne.service';
import { CaisseService } from '../shared/caisse.service';
import { Personne, Societe, Cheque, Alimentation } from 'src/app/shared';
import { delay } from 'rxjs/operators';
import { NodeService } from 'src/app/database/db.helper.service';
@Component({
  selector: 'app-noob-test',
  templateUrl: './noob-test.component.html',
  styleUrls: ['./noob-test.component.scss']
})
export class NoobTestComponent implements OnInit {

  iP = 0;
  iS = 0;
  iE = 0;
  iC = 0;
  iA = 0;
  nInsert = 10;
  constructor(private alimentaionS: AlimentationService, private db: NodeService
    ,         private personneS: PersonneService, private societeS: SocieteService
    ,         private chequeS: ChequeService, private caisseS: CaisseService) { }

  ngOnInit() {
    // const id = crypto.randomBytes(20).toString('hex');
    // console.log(id);
    // console.log(Math.random().toString().substring(2, 8));
  }

  async addPersonne() {
    const o = new Personne();
    for (this.iP = 0; this.iP < this.nInsert; this.iP++) {
      o.tel = Math.random().toString().substring(2, 8);
      o.nom = 'personne ' + this.iP;
      await this.personneS.post(o).toPromise();
    }
  }

  async addSociete() {
    const o = new Societe();
    for (this.iS = 0; this.iS < 2; this.iS++) {
      o.tel = Math.random().toString().substring(2, 8);
      o.nom = 'societe ' + (this.iS + 1);
      await this.societeS.post(o).toPromise();
    }
  }

  async addCheque() {
    const o = new Cheque();
    for (this.iC = 0; this.iC < this.nInsert; this.iC++) {
      o.banque = 'banque ' + this.iC;
      o.num = this.iC + '';
      await this.chequeS.post(o).toPromise();
    }
  }

  async addAlimentation() {
    const o = new Alimentation();
    for (this.iA = 0; this.iA < (this.nInsert / 2); this.iA++) {
      o.idCheque = this.iA + 1;
      o.idPersonne = this.iA + 1;
      o.idSociete = null;
      o.date = new Date();
      o.montant = 1100;
      await this.alimentaionS.post(o).toPromise();
    }
    this.iA = 0;
    for (this.iA = 0; this.iA < (this.nInsert / 4); this.iA++) {
      o.idCheque = this.iA + 1;
      o.idPersonne = null;
      o.idSociete = 1;
      o.date = new Date(`2018-0${this.iA + 1}-${this.iA + 2}`);
      o.montant = 1100;
      await this.alimentaionS.post(o).toPromise();
    }
    this.iA = 0;
    for (this.iA = 0; this.iA < (this.nInsert / 4); this.iA++) {
      o.idCheque = this.iA + 1;
      o.idPersonne = null;
      o.idSociete = 2;
      o.date = new Date(`2018-0${this.iA + 1}-${this.iA + 2}`);
      o.montant = 1100;
      await this.alimentaionS.post(o).toPromise();
    }
  }

  async deleteAll() {
    await this.db.execQueryObs('delete from personne').toPromise();
    await this.db.execQueryObs('delete from societe').toPromise();
    await this.db.execQueryObs('delete from espece').toPromise();
    await this.db.execQueryObs('delete from cheque').toPromise();
    await this.db.execQueryObs('delete from alimentation').toPromise();
    await this.db.execQueryObs('delete from caisse').toPromise();
  }

}
