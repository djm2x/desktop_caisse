import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Espece } from 'src/app/shared';
import { EspeceService } from '../shared/espece.service';

@Component({
  selector: 'app-espece',
  templateUrl: './espece.component.html',
  styleUrls: ['./espece.component.scss']
})
export class EspeceComponent implements OnInit {

  public myForm: FormGroup;
  o = new Espece();
  c = new Espece();
  isEdit = false;
  list: Espece[] = [];
  constructor(private fb: FormBuilder, private service: EspeceService) { }

  ngOnInit() {
    this.createForm();
    this.getAll();
  }

  getAll() {
    this.service.getAll().subscribe(data => {
      console.log(data);
      this.list = data;
    });
  }


  createForm() {
    this.myForm = this.fb.group({
      id: this.o.id,
      montant: [this.o.montant, Validators.required],

    });
  }

  resetForm() {
    this.o = new Espece();
    this.createForm();
  }

  submit(myForm: FormGroup) {
    const obj: any = myForm.value;
    console.log(obj);
    if (!this.isEdit) {
      this.service.post(obj).subscribe(
        r => {
          console.log(r);
          this.getAll();
        }
      );
    } else {
      this.service.put(obj).subscribe(
        r => {
          console.log(r);
          this.getAll();
          this.isEdit = false;
        }
      );
    }
  }
  edit(o: any) {
    console.log(o);
    this.o = o;
    this.c = this.o;
    this.isEdit = true;
    this.createForm();
  }

  delete(o) {
    this.service.delete(o.id).subscribe(
      async (r: any) => {
        console.warn(r[1].sql);
        this.getAll();
        // const montantCaisse = await this.caisseS.get().toPromise();
        // await this.caisseS.postOrReplace(montantCaisse + o.montant).toPromise();
        // this.update.next(true);
      }
    );
  }

}
