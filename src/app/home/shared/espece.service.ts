import { Injectable } from '@angular/core';
import { NodeService } from 'src/app/database/db.helper.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Espece } from 'src/app/shared';

const TABLE = 'Espece';
@Injectable({
  providedIn: 'root'
})
export class EspeceService {
  req = '';
  params = [];
  list = [];
  count = 0;
  constructor(private service: NodeService) { }

  getPage(startIndex: number, pageSize: number) {

    return Observable.create(observer => {
      this.service.execQueryObs(`select * from ${TABLE} order by id desc Limit ?, ?`, [startIndex, pageSize])
        .subscribe(r => {
          this.list = r[0];
          observer.next({ list: this.list, count: this.count });
        });

      this.service.execQueryObs(`select count(*) as count from ${TABLE}`)
        .subscribe(r => {
          this.count = r[0][0].count;
          observer.next({ list: this.list, count: this.count });
        });
    });
  }

  getAll() {
    this.req = `select * from ${TABLE}`;
    return this.service.execQueryObs(this.req, []).pipe(map(r => r[0]));
  }

  get(id) {
    if (!id) {
      return of(null);
    }
    this.req = `select * from ${TABLE} where id = ?`;
    return this.service.execQueryObs(this.req, [id]).pipe(map(r => r[0][0]));
  }

  post(o: Espece): Observable<number> {
    if (!o) {
      return of(null);
    }
    this.req = `insert into ${TABLE} values (?, ?)`;
    this.params = [null, o.montant];
    return this.service.execQueryObs(this.req, this.params).pipe(map(r => r[1].lastID));
  }

  put(o: Espece) {
    if (!o) {
      return of(null);
    }
    this.req = `update ${TABLE}
                set montant = ?
                where id = ?`;
    this.params = [o.montant, o.id];
    return this.service.execQueryObs(this.req, this.params);
  }

  delete(id: number) {
    this.req = `delete from ${TABLE} where id = ?`;
    return this.service.execQueryObs(this.req, [id]);
  }
}
