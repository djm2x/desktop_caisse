import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, SessionService } from '../../shared';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public myForm: FormGroup;

  hide = true;
  msg = '';
  constructor( private session: SessionService, private fb: FormBuilder, public router: Router) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      email: ['sa', [Validators.required]],
      password: ['123', Validators.required],
    });
  }

  submit(myForm: FormGroup) {
    this.session.doSignIn(myForm.value as User);
    this.router.navigate(['/home']);
  }
}
