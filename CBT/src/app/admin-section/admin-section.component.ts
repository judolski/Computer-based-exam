import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin-section',
  templateUrl: './admin-section.component.html',
  styleUrls: ['./admin-section.component.scss']
})
export class AdminSectionComponent implements OnInit {
  users:any;
  number = Math.floor(Math.random() * 3) + 1;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
    })
  }

  deleteData(userId:any) {
    this.userService.deleteUser(userId).subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    })
  }

  retakeTest(userId:any) {
    this.userService.removeScore(userId).subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    })
  }

}
