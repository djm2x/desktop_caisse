import { Injectable, EventEmitter } from '@angular/core';
import { Depense, Caisse } from 'src/app/shared';
import { NodeService } from 'src/app/database/db.helper.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const TABLE = 'caisse';
@Injectable({
  providedIn: 'root'
})
export class CaisseService {
  req = '';
  params = [];
  notify = new EventEmitter<number>();
  constructor(private service: NodeService) {
    this.get().subscribe((m: number) => this.notify.next(m));
  }

  get() {
    this.req = `select montant from ${TABLE} limit 1`;
    return this.service.execQueryObs(this.req, []).pipe(map(r => r[0][0] ? r[0][0].montant : 0));
  }

  postOrReplace(montant: number) {
    if (isNaN(montant)) {
      return of(null);
    }
    this.notify.next(montant);
    this.req = `INSERT OR REPLACE INTO ${TABLE} VALUES (1, ?);`;
    return this.service.execQueryObs(this.req, [montant]).pipe(map(r => r[1].lastID));
  }
}

