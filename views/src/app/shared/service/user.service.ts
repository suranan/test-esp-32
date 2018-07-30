import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private _http: Http) { }

  createUser(obj) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('Name', obj.Name);
    params.append('DateofBirth', obj.DateofBirth)
    params.append('Sex', obj.Sex)
    params.append('Tel', obj.Tel)
    params.append('Address', obj.Address)

    let url = 'http://localhost:3000/api/create-user?Name=' + obj.Name + '&DateofBirth=' + obj.DateofBirth + '&Sex=' + obj.Sex + '&Tel=' + obj.Tel + '&Address=' + obj.Address+ '&UserID=' + obj.username;
    return this._http.post(url, {}).pipe(map((data) => data.json()), catchError(error => {
      return throwError('Something went wrong!')
    }))

  }

  updateUser(obj) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('Name', obj.Name);
    params.append('DateofBirth', obj.DateofBirth)
    params.append('Sex', obj.Sex)
    params.append('Tel', obj.Tel)
    params.append('Address', obj.Address)

    let url = 'http://localhost:3000/api/update-user?Name=' + obj.Name + '&DateofBirth=' + obj.DateofBirth + '&Sex=' + obj.Sex + '&Tel=' + obj.Tel + '&Address=' + obj.Address+ '&UserID=' + obj.username;
    return this._http.post(url, {}).pipe(map((data) => data.json()), catchError(error => {
      return throwError('Something went wrong!')
    }))

  }


  checkUser(obj) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = 'http://localhost:3000/api/check-user?UserID=' + obj.username;
    return this._http.post(url, {}).pipe(map((data) => data.json()), catchError(error => {
      return throwError('Something went wrong!')
    }))

  }

  getRec() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let url = 'http://localhost:3000/api/get-rec';
    return this._http.post(url, {}).pipe(map((data) => data.json()), catchError(error => {
      return throwError('Something went wrong!')
    }))

  }

}
