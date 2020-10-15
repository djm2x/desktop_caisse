import { Injectable } from '@angular/core';
import { Depense, Caisse } from 'src/app/shared';
import { NodeService } from 'src/app/database/db.helper.service';
import { map, delay } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';

const DEPENSE = 'DEPENSE';
const ALIMENTATION = 'ALIMENTATION';
const CAISSE = 'CAISSE';
@Injectable({
  providedIn: 'root'
})
export class DashService {
  req = '';
  constructor(private service: NodeService) { }

  get mTotal() {
    this.req = `select montant from ${CAISSE} limit 1`;
    return this.service.execQueryObs(this.req).pipe(map(r => r[0][0].montant), delay(100));
  }

  get mDepense() {
    this.req = `SELECT SUM(MONTANT) AS total FROM ${DEPENSE}`;
    return this.service.execQueryObs(this.req).pipe(map(r => r[0][0].total));
  }

  get mEntree() {
    this.req = `SELECT SUM(MONTANT) AS total FROM ${ALIMENTATION}`;
    return this.service.execQueryObs(this.req).pipe(map(r => r[0][0].total));
  }

  mergeObs() {
    return merge(this.mTotal.pipe(delay(100)), this.mDepense, this.mEntree);
  }
}


