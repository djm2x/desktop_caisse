import { Injectable } from '@angular/core';
import { Personne } from 'src/app/shared';
import { NodeService } from 'src/app/database/db.helper.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const TABLE = 'Personne';
@Injectable({
  providedIn: 'root'
})
export class PersonneService {
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

  filter(word) {
    this.req = `select * from ${TABLE} where nom like '%${word}%' limit 0, 5`;
    return this.service.execQueryObs(this.req).pipe(map((r) => r[0]));
  }

  get(id) {
    if (!id) {
      return of(null);
    }
    this.req = `select * from ${TABLE} where id = ?`;
    return this.service.execQueryObs(this.req, [id]).pipe(map(r => r[0][0]));
  }

  getAll() {
    this.req = `select * from ${TABLE}`;
    return this.service.execQueryObs(this.req, []).pipe(map(r => r[0]));
  }

  post(o: Personne) {
    if (!o) {
      return of(null);
    }
    this.req = `insert into ${TABLE} values (?, ?, ?)`;
    this.params = [o.id, o.nom, o.tel];
    return this.service.execQueryObs(this.req, this.params).pipe(map(r => r[1].lastID));
  }

  put(o: Personne) {
    this.req = `update ${TABLE}
                set nom = ?, tel = ?
                where id = ?`;
    this.params = [o.nom, o.tel, o.id];
    return this.service.execQueryObs(this.req, this.params);
  }

  delete(id: number) {
    if (!id) {
      return of(null);
    }
    this.req = `delete from ${TABLE} where id = ?`;
    return this.service.execQueryObs(this.req, [id]);
  }
}
