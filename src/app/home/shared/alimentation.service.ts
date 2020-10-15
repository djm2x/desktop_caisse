import { Injectable } from '@angular/core';
import { Depense, Alimentation } from 'src/app/shared';
import { NodeService } from 'src/app/database/db.helper.service';
import { map, count } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const TABLE = 'Alimentation';
@Injectable({
  providedIn: 'root'
})
export class AlimentationService {
  req = '';
  params = [];
  list = [];
  count = 0;
  constructor(private service: NodeService) { }

  getPage(startIndex: number, pageSize: number): Observable<any> {
    return Observable.create(observer => {
      const reqList = `select * from ${TABLE} order by id desc Limit ?, ?`;
      const reqCount = `select count(*) as count from ${TABLE}`;

      Promise.all([
        this.service.execQueryObs(reqList, [startIndex, pageSize]).toPromise(),
        this.service.execQueryObs(reqCount).toPromise()
      ])
        .then(r => observer.next({ list: r[0][0], count: r[1][0][0].count }))
        .catch(() => observer.next({ list: [], count: 0 }));
    });
  }

  getAll() {
    this.req = `select * from ${TABLE}`;
    return this.service.execQueryObs(this.req, []);
  }

  post(o: Alimentation) {
    this.req = `insert or replace into ${TABLE} values (?, ?, ?, ?, ?, ?)`;
    this.params = [o.id, o.idCheque, o.idPersonne, o.idSociete, o.montant, o.date];
    return this.service.execQueryObs(this.req, this.params).pipe(map(r => r[1].lastID));
  }

  put(o: Alimentation) {
    this.req = `update ${TABLE}
                set idCheque = ?, idPersonne = ?, idSociete = ?, montant = ?, date = ?
                where id = ?`;
    this.params = [o.idCheque, o.idPersonne, o.idSociete, o.montant, o.date, o.id];
    return this.service.execQueryObs(this.req, this.params);
  }

  delete(id: number) {
    this.req = `delete from ${TABLE} where id = ?`;
    return this.service.execQueryObs(this.req, [id]);
  }
}
