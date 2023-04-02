import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { elementAt, Observable } from 'rxjs';
import { Data } from 'src/data';
import { Address } from '../model/address';
import { Bar } from '../model/bar';
import { Comment } from '../model/comment';
import { Horaires } from '../model/horaires';
import { Pictures } from '../model/pictures';
import { Restaurant } from '../model/restaurant';
import { Station } from '../model/station';
import { TypePicture } from '../model/typePicture';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  isLinear = false;
  firstFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  secondFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  thirdFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  fourthFormGroup: UntypedFormGroup = new UntypedFormGroup({});


  options: string[] = ['Restaurant', 'Bar', 'Sortie'];

  filteredOptions: Observable<string[]> | undefined;

  facadeFile: string = "";
  facadeName: string = "Façade";
  allPictures: Pictures[] = [];
  platName: string = "Plat";

  metros: any[] = [];
  stations: string[] = [];
  searchTerm: string = "";
  dataSource = new MatTableDataSource<any>();
  filteredData : any[] = [];
  displayedColumns: string[] = ['station'];
  allHoraires: Horaires[] = [{
    id: "",
    day: "Lundi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  },
  {
    id: "",
    day: "Mardi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  },
  {
    id: "",
    day: "Mercredi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  },
  {
    id: "",
    day: "Jeudi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  },
  {
    id: "",
    day: "Vendredi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  },
  {
    id: "",
    day: "Samedi",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  },
  {
    id: "",
    day: "Dimanche",
    ouverture: "",
    fermeture_midi: "",
    ouverture_soir: "",
    fermeture: "",
    id_place: ""
  }]
  displayHoraire = {
    Lundi: false,
    Mardi: false,
    Mercredi: false,
    Jeudi: false,
    Vendredi: false,
    Samedi: false,
    Dimanche: false,
  }
  allTypes: TypePicture[] = [];
  typesAvailable: TypePicture[] = [];
  typesFiltered: TypePicture[] = [];
  selected: string[] = [];
  positifs: Comment[] = [];
  negatifs: Comment[] = [];
  addresses: Address[] = [{id:"",address: "",code_postal: "",id_place:""}];
  allStations: Station[] = [];


  constructor(private _formBuilder: UntypedFormBuilder,private data: DatabaseService) { }

  ngOnInit() {
    this.data.getAllStations().subscribe(res => {
      this.allStations = res;
    });
    this.firstFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      place: ['', Validators.required],
      arrondissement: ['', Validators.required],
      theFork: [''],
      tested: [false],
      type: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      img: [''],
      plat: [''],
      liked: [false],
      note: [0],
      note_quantity: [0],
      note_quality: [0],
      quality_price: [0],
      note_deco: [0],
      comment: [''],
    });

    this.allTypes = Data.sort();
    this.typesAvailable = this.allTypes.slice();
  }

  setType(){
    this.typesAvailable = this.allTypes.filter((element: TypePicture) => element.place === this.firstFormGroup.value.place);
    this.allTypes.forEach((e: TypePicture) => {
      console.log(e.place, this.firstFormGroup.value.place)
    })
    console.log(this.typesAvailable)
  }

  facadeImage(event: any) {
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (_event: any) => {
            this.facadeFile =  _event.target.result;
            this.facadeName = event.target.files[0].name;
        };
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  setPictures(event: any) {
    if (event.target.files && event.target.files[0]) {
        Array.from(event.target.files).forEach((file: any) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = (file: any) => {
            const picture: any = file;
            this.allPictures.push({
              id: "",
              id_place: "",
              src: picture.target.result
            });
          }
        });
    }
  }

  test(e: any){
    console.log(e)
  }

  changeDisplay(day: string){
    if(day === "Lundi") this.displayHoraire.Lundi = !this.displayHoraire.Lundi;
    else if(day === "Mardi") this.displayHoraire.Mardi = !this.displayHoraire.Mardi;
    else if(day === "Mercredi") this.displayHoraire.Mercredi = !this.displayHoraire.Mercredi;
    else if(day === "Jeudi") this.displayHoraire.Jeudi = !this.displayHoraire.Jeudi;
    else if(day === "Vendredi") this.displayHoraire.Vendredi = !this.displayHoraire.Vendredi;
    else if(day === "Samedi") this.displayHoraire.Samedi = !this.displayHoraire.Samedi;
    else if(day === "Dimanche") this.displayHoraire.Dimanche = !this.displayHoraire.Dimanche;
  }

  fillHoraires(event:any){
    if(event.checked){
      if(this.displayHoraire.Lundi){
        this.displayHoraire.Mardi = true;
        this.displayHoraire.Mercredi = true;
        this.displayHoraire.Jeudi = true;
        this.displayHoraire.Vendredi = true;
        this.displayHoraire.Samedi = true;
        this.displayHoraire.Dimanche = true;
      } else{
        this.displayHoraire.Mardi = false;
        this.displayHoraire.Mercredi = false;
        this.displayHoraire.Jeudi = false;
        this.displayHoraire.Vendredi = false;
        this.displayHoraire.Samedi = false;
        this.displayHoraire.Dimanche = false;
      }
    }

    const horairesLundi: Horaires = this.allHoraires.find((horaires: Horaires) => horaires.day === "Lundi");

    this.allHoraires.forEach((horaires:Horaires) => {
      horaires.ouverture = horairesLundi.ouverture;
      horaires.fermeture_midi = horairesLundi.fermeture_midi;
      horaires.ouverture_soir = horairesLundi.ouverture_soir;
      horaires.fermeture = horairesLundi.fermeture;
    });
  }
  
  setCommentLine(positif: boolean, increase: boolean){
    if(positif && increase){
      this.positifs.push({
        id: "",
        id_place: "",
        positif: positif,
        detail: ""
      });
    } else if(!positif && increase){
      this.negatifs.push({
        id: "",
        id_place: "",
        positif: positif,
        detail: ""
      });
    } else if(positif && !increase) this.positifs.pop();
    else  this.negatifs.pop();
  }

  setComment(event: any, i: number,positif: boolean){
    if(positif) this.positifs[i].detail = event.target.value;
    else  this.negatifs[i].detail = event.target.value;
  }

  setAddressLine(increase: boolean){
    if(increase){
      this.addresses.push({
        id: "",
        id_place: "",
        address: "",
        code_postal: ""
      });
    }    else  this.addresses.pop();
  }

  setAddress(event: any, i: number, type: string){
    if(type === "code") this.addresses[i].code_postal = event.target.value;
    else  this.addresses[i].address = event.target.value;
  }

  add(){    
    let allComments: Comment[] = [];
    allComments = [...this.positifs, ...this.negatifs];

    if(this.firstFormGroup.value.place === "Restaurant"){
      let restaurant: Restaurant = {
        id: "",
        name: this.firstFormGroup.value.name,
        arrondissement: this.firstFormGroup.value.arrondissement,
        note_globale: this.secondFormGroup.value.note,
        price: this.firstFormGroup.value.price,
        type: this.firstFormGroup.value.type,
        facade: this.facadeFile,
        the_fork: this.firstFormGroup.value.theFork,
        tested: this.firstFormGroup.value.tested,
        comment: this.secondFormGroup.value.comment,
        note_deco: this.secondFormGroup.value.note_deco,
        liked: false,
        note_quantity: this.secondFormGroup.value.note_quantity,
        quality: this.secondFormGroup.value.note_quality,
        quality_price: this.secondFormGroup.value.quality_price
      };
      this.data.addRestaurant(restaurant,this.allHoraires,this.allPictures,allComments,this.addresses);
    }
    else if(this.firstFormGroup.value.place === "Bar"){
      let bar: Bar = {
        id: "",
        name: this.firstFormGroup.value.name,
        arrondissement: this.firstFormGroup.value.arrondissement,
        note_globale: this.secondFormGroup.value.note,
        price: this.firstFormGroup.value.price,
        facade: this.facadeFile,
        tested: this.firstFormGroup.value.tested,
        comment: this.thirdFormGroup.value.comment,
        type: this.thirdFormGroup.value.type,
        note_deco: this.secondFormGroup.value.note_deco,
        liked: false,
        quality: this.secondFormGroup.value.note_quality,
        quality_price: this.secondFormGroup.value.quality_price
      };
      this.data.addBar(bar,this.allHoraires,this.allPictures,allComments,this.addresses);
    }
  }

  filterType(event: any) {
    const filterValue = event.target.value.toLowerCase();
    this.typesFiltered = this.typesAvailable.filter((element: TypePicture) => {
      const type: string = element.type.toLowerCase();
      if(type.includes(filterValue))  return true;
      else  return false;
    });
    console.log(this.allTypes);
  }

  select(element: any){
    let indexToSuppress = null;
    this.selected.forEach((station,index) => {
      if(station === element) indexToSuppress = index;
    });
    if(indexToSuppress != null) this.selected.splice(indexToSuppress,1);
    else  this.selected.push(element);
  }

  filter(searchTerm: string) {
    if(searchTerm.length === 0) this.filteredData = [];
    else{
      this.filteredData = this.allStations.filter((element: Station) => {
        const name: string = element.name.toLowerCase();
        if(name.includes(searchTerm.toLowerCase()))  return true;
        else  return false;
      });
    }
  }
  
}
