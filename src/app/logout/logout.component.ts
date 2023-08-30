import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<LogoutComponent>,
    private auth: AuthService) { }

  ngOnInit(): void {
  }

  close():void{
    this.dialogRef.close();
  }

  logout() :void{
    this.dialogRef.close();
  }

}
