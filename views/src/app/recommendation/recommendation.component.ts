import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/service/user.service';
@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.css']
})
export class RecommendationComponent implements OnInit {

  rows = [];


  constructor(private _userService: UserService) {
    this._userService.getRec().subscribe((res) => {
      console.log(res);
      this.rows = res.massage;
    }, (err) => {
      this.rows = [];
    })
  }

  ngOnInit() {
  }

}
