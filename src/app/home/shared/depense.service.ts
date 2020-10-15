import { Injectable } from '@angular/core';
import { Depense } from 'src/app/shared';
import { NodeService } from 'src/app/database/db.helper.service';
import { map, count } from 'rxjs/operators';
import { Observable } from 'rxjs';

const TABLE = 'Depense';
@Injectable({
  providedIn: 'root'
})
export class DepenseService {
  req = '';
  params = [];
  list = [];
  count = 0;
  constructor(private service: NodeService) { }

  getPage(startIndex: number, pageSize: number) {
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

  // getPage2(startIndex: number, pageSize: number) {

  //   return Observable.create(observer => {
  //     this.service.execQueryObs(`select * from ${TABLE} order by id desc Limit ?, ?`, [startIndex, pageSize])
  //       .subscribe(r => {
  //         this.list = r[0];
  //         observer.next({ list: this.list, count: this.count });
  //       });

  //     this.service.execQueryObs(`select count(*) as count from ${TABLE}`)
  //       .subscribe(r => {
  //         this.count = r[0][0].count;
  //         observer.next({ list: this.list, count: this.count });
  //       });
  //   });
  // }

  getAll() {
    this.req = `select * from ${TABLE}`;
    return this.service.execQueryObs(this.req, []);
  }

  post(o: Depense) {
    this.req = `insert into ${TABLE} values(?, ?, ?, ?, ?)`;
    this.params = [null, o.beneficiaire, o.montant, o.justificativ, o.date];
    return this.service.execQueryObs(this.req, this.params).pipe(map(r => r[1].lastID));
  }

  put(o: Depense) {
    this.req = `update ${TABLE}
                set beneficiaire = ?, montant = ?, justificativ = ?, date = ?
          where id = ? `;
    this.params = [o.beneficiaire, o.montant, o.justificativ, o.date, o.id];
    return this.service.execQueryObs(this.req, this.params);
  }

  delete(id: number) {
    this.req = `delete from ${TABLE} where id = ? `;
    return this.service.execQueryObs(this.req, [id]);
  }
}
