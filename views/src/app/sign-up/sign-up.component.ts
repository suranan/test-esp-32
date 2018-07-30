import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/service/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  success = false
  constructor(private formBuilder: FormBuilder, private _userService: UserService) {
    this.form = this.formBuilder.group({
      username: [null, [Validators.required,Validators.maxLength(6)]],
      Name: [null, Validators.required],
      DateofBirth: [null, Validators.required],
      Sex: [null, Validators.required],
      Tel: [null, Validators.required],
      Address: [null, Validators.required]
    });

  }

  ngOnInit() {
  }

  onSubmit() {
    this._userService.createUser(this.form.value).subscribe((res) => {
      console.log(res);
      this.success = !this.success;
    }, (err) => {
      alert('error');
      console.log(err);
    });
  }

  onReset() {
    this.form.reset();
    this.success = !this.success;
  }

}
