import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/service/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  form: FormGroup;
  form2: FormGroup;
  success = false;
  username = true;
  constructor(private formBuilder: FormBuilder, private _userService: UserService) {
    this.form = this.formBuilder.group({
      username: [null, [Validators.required,Validators.maxLength(6)]],
      Name: [null, Validators.required],
      DateofBirth: [null, Validators.required],
      Sex: [null, Validators.required],
      Tel: [null, Validators.required],
      Address: [null, Validators.required]
    });

    this.form2 = this.formBuilder.group({
      username: [null, [Validators.required,Validators.maxLength(6)]]
    });

  }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.form.value);
    this._userService.updateUser(this.form.value).subscribe((res) => {
      console.log(res);
      this.success = !this.success;
      this.username = !this.username;
      this.form2.reset();
    }, (err) => {
      alert('error');
      console.log(err);
    });
  }

  onReset() {
    this.success = !this.success;
  }


  onSubmit2() {
    this._userService.checkUser(this.form2.value).subscribe((res) => {
      this.username = !this.username;
      console.log(res);

      this.form.controls['username'].setValue(res.massage.UserID);
      this.form.controls['Name'].setValue(res.massage.Name);

      let d = new Date(res.massage.DateofBirth);
      let day = d.getFullYear();
      let month = d.getMonth();
      let year = d.getFullYear();
      let fulldate = year + '-' + month + '-' + day;

      this.form.controls['DateofBirth'].setValue(fulldate);
      this.form.controls['Sex'].setValue(res.massage.Sex);
      this.form.controls['Tel'].setValue(res.massage.Tel);
      this.form.controls['Address'].setValue(res.massage.Address);
    }, (err) => {
      alert('error');
      console.log(err);
    });
  }


}
