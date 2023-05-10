import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddComponent } from '../add/add.component';
import { LogoutComponent } from '../logout/logout.component';
import { User } from '../model/users';
import { DatabaseService } from '../services/database.service';
import { PlacesService } from '../services/places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private route: Router,
    private dialogRef: MatDialog,
    private dataService: DatabaseService,
    private place: PlacesService
  ) {
    this.imageSubscriber = place.getImageChange().subscribe(() => {
      this.user.img = localStorage.getItem("img");
    })
  }

  private imageSubscriber: Subscription;

  @Input() color: string;
  user: User;
  verifyAdmin: boolean = false;
  verifyPortfolio: boolean = false;
  types: String[] = [];

  position : number = 0;
  test: boolean = true;

  ngOnInit(): void {
    const token: string = localStorage.getItem("token");
    this.dataService.loginByToken(token).subscribe((credentials: any) => {
      if(credentials.role === "Admin") this.verifyAdmin = true;
      if(credentials.role === "Visit")  this.verifyPortfolio = true;
      localStorage.setItem("role",credentials.role);
      localStorage.setItem("id",credentials.id);
      localStorage.setItem("login",credentials.login);

      this.dataService.getImage(credentials.id).subscribe((img: string) =>{
        localStorage.setItem("img",img);
        this.user = {
          id: credentials.id,
          img: img,
          login: credentials.login,
          password: "",
          role: credentials.role
        }
      });
    });
  }

  navigate(url: string){
    this.route.navigate([url]);
  }

  
  
  addPlace(){
    this.dialogRef.open(AddComponent,
      {
        panelClass: 'modal-form'
      }
    );
  }

  deconnect(){
    this.dialogRef.open(LogoutComponent, {
      height: '50%',
      width: '50%'
    })
  }

}
