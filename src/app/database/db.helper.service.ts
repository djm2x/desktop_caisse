import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  createDepense,
  createPersonne,
  createSociete,
  createCheque,
  createAlimentation,
  createCaisse,
  insertCaisse,
  createEspece
} from './create-table';
import { LoaderService } from './loader.service';
import { MyToastrService } from '../shared';
declare const require: any;
const sqlite3 = (window as any).require('sqlite3').verbose();
const Sequelize = (window as any).require('sequelize');
// declare let sqlite3: any;
// declare let Sequelize: any;
// import { Database } from 'sqlite3';
// import * as sqlite3 from 'sqlite3';
// import { Sequelize } from 'sequelize';
@Injectable({
  providedIn: 'root'
})
export class NodeService {
  public sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: './db.sqlite',
  });

  db: any;
  // public remote: any | undefined = void 0;
  constructor(private loader: LoaderService, private toast: MyToastrService) {
    // if ((window as any).nodeRequire) {
    //   try {
    //     this.sqlite3 = (window as any).nodeRequire('sqlite3').verbose();
    //     this.Sequelize = (window as any).nodeRequire('sequelize');
    //     // this.remote = (window as any).require('electron').remote;
    //   } catch (e) {
    //     console.error('requiring module error : ', e);
    //   }
    // } else {
    //   console.error('windows require not working');
    // }
  }

  async connecte() {
    this.db = new sqlite3.Database('./db.sqlite');
    this.db.run(createPersonne(), r => r);
    this.db.run(createSociete(), r => r);
    this.db.run(createCheque(), r => r);
    this.db.run(createEspece(), r => r);
    this.db.run(createDepense(), r => r);
    this.db.run(createAlimentation(), () => '');
    this.db.run(createCaisse(), () => '');
    this.db.run(insertCaisse(), r => r);

    // await Promise.all([
    //   this.create(createPersonne()),
    //   this.create(createSociete()),
    //   this.create(createCheque()),
    //   this.create(createEspece()),
    //   this.create(createDepense()),
    //   this.create(createAlimentation()),
    //   this.create(createCaisse()),
    //   this.create(insertCaisse()),
    // ]);

    return this.sequelize.authenticate() as Promise<any>;
  }



  execQueryObsXX(req: string, param = []): Observable<any> {
    this.loader.isLoading.next(true);
    return from(new Promise<any>((resolve, reject) => {
      this.db.run(req, param, (e: Error) => {
        if (e) {
          this.loader.isLoading.next(false);
          reject(e);
        } else {
          console.log(this.db);
          this.loader.isLoading.next(false);
          resolve(this.db);
        }
      });
    }));
  }
  execQueryObs(req: string, param = []) {
    this.loader.isLoading.next(true);
    return from(new Promise((res, rej) => {
      (this.sequelize.query(req, { replacements: param }) as Promise<any>)
        .then(
          r => {
            res(r);
            this.loader.isLoading.next(false);
            // this.toast.toastSuccess(r, 'sql');
          }
        )
        .catch((e: string) => {
          console.warn(e);
          rej(e);
          // this.toast.toastError(e.toString().substring(0, 76), 'sql');
          this.loader.isLoading.next(false);
        });
      // observer.complete();
    }));
  }

  execQueryObs0(req: string, param = []) {
    this.loader.isLoading.next(true);
    return from(new Promise((res, rej) => {
      (this.sequelize.query(req, { replacements: param }) as Promise<any>)
        .then(
          r => {
            console.error('eeeeeeeeeeeeeeeeeeeeeeeeeee');
            res(r);
            this.loader.isLoading.next(false);
            // this.toast.toastSuccess(r, 'sql');
          },
          // e => {
          //   console.warn(e.toString().substring(0, 76));
          // }
        )
        .catch((e: string) => {
          console.warn(e);
          rej(e);
          // this.toast.toastError(e.toString().substring(0, 76), 'sql');
          this.loader.isLoading.next(false);
        });
      // observer.complete();
    }));
  }

  execQueryObs2(req: string, param = []): Observable<any> {
    this.loader.isLoading.next(true);
    return new Observable(observer => {
      (this.sequelize.query(req, { replacements: param }) as Promise<any>)
        .then(
          r => {
            console.error('eeeeeeeeeeeeeeeeeeeeeeeeeee');
            observer.next(r);
            this.loader.isLoading.next(false);
            // this.toast.toastSuccess(r, 'sql');
          },
          // e => {
          //   console.warn(e.toString().substring(0, 76));
          // }
        )
        .catch((e: string) => {
          console.warn(e);
          observer.error(e);
          // this.toast.toastError(e.toString().substring(0, 76), 'sql');
          this.loader.isLoading.next(false);
        })
        .finally(() => {
          observer.complete();
          this.loader.isLoading.next(false);
        });
      // observer.complete();
    });
  }
}
