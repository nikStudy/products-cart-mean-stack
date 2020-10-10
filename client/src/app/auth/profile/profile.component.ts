import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  loading = true;

  constructor(private userservice: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(){
    this.userservice.getLoggedUser().subscribe(
      data =>{
        // console.log(data);
        // console.log(data.success);
        if (data.success === false) {
          localStorage.removeItem("User");
          this.router.navigate(['login']);
        } else {
          this.user = data.user;
          console.log(this.user);
          this.loading = false;
        }
    });
  }


}
