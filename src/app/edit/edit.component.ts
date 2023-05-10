import { Component } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
import { StationInPlace } from '../model/stationInPlace';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  isLinear = false;
  firstFormGroup: UntypedFormGroup = new UntypedFormGroup({});
  secondFormGroup: UntypedFormGroup = new UntypedFormGroup({});

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
  stationsInPlace: StationInPlace[] = [];
  positifs: Comment[] = [];
  negatifs: Comment[] = [];
  addresses: Address[] = [{id:"",address: "",code_postal: "",id_place:""}];
  allStations: Station[] = [];
  idPlace: string = "";


  constructor(private _formBuilder: UntypedFormBuilder,private data: DatabaseService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.data.getAllStations().subscribe(res => {
      this.allStations = res;
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.idPlace = id;
      this.data.getPlaceById(id).subscribe((res : any) => {
        this.fillForm(res);
      });
      this.data.getCommentOfPlace(id).subscribe((res: Comment[]) => {
        this.positifs = res.filter((element: Comment) =>  element.positif === 'true');
        this.negatifs = res.filter((element: Comment) =>  element.positif === 'false');
      });
      this.data.getPicturesOfPlace(id).subscribe((res: Pictures[]) => {
        this.allPictures = res;
      });
      this.data.getAddressOfPlace(id).subscribe((res: Address[]) => {
        this.addresses = res;
      });
      this.data.getStationsOfPlace(id).subscribe((res: Station[]) => {
        res.forEach((element: Station) => {
          this.selected.push(element.name);
          this.stationsInPlace.push({
            id: "",
            id_place: id,
            name_station: element.name
          })
        });
      });
      this.data.getHorairesOfPlace(id).subscribe((res: Horaires[]) => {
        this.allHoraires = res;
        this.allHoraires.forEach((element: Horaires) => {
          if(element.ouverture_soir != '')  this.changeDisplay(element.day);
        });
      });
    })

    this.allTypes = Data.sort();
    this.typesAvailable = this.allTypes.slice();
  }

  fillForm(place: any){
    let typeOfPlace: string = "";
    if(place.the_fork != null)  typeOfPlace = "Restaurant";
    else typeOfPlace = "Bar";
    if(place.note_quantity == null) place === "Bar";
    let comment: string = "";
    if(place.comment != undefined)  comment = place.comment;
    this.firstFormGroup = this._formBuilder.group({
      name: [place.name, Validators.required],
      place: [typeOfPlace, Validators.required],
      arrondissement: [place.arrondissement, Validators.required],
      theFork: [place.the_fork],
      tested: [place.tested],
      type: [place.type, Validators.required],
      price: [place.price, Validators.required],
      comment: [comment]
    });
    this.secondFormGroup = this._formBuilder.group({
      img: [''],
      plat: [''],
      liked: [place.liked],
      note: [place.note_globale],
      note_quantity: [place.note_quantity],
      note_quality: [place.note_quality],
      quality_price: [place.quality_price],
      note_deco: [place.note_deco],
    });

    this.setType();
  }

  setType(){
    this.typesAvailable = this.allTypes.filter((element: TypePicture) => element.place === this.firstFormGroup.value.place);
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

  setHoraires(event: any, day: string, moment: string){
    const value = event.target.value;

    this.allHoraires.forEach((element: Horaires) => {
      if(element.day === day) {
        element[moment] = value;
      }
    });
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
        id_place: this.idPlace,
        positif: "true",
        detail: ""
      });
    } else if(!positif && increase){
      this.negatifs.push({
        id: "",
        id_place: this.idPlace,
        positif: "false",
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

    this.stationsInPlace = [];
    this.selected.forEach((station: string) => {
      const infos: StationInPlace = {
        id: "",
        name_station: station,
        id_place: this.idPlace
      }
      this.stationsInPlace.push(infos);
    });

    if(this.firstFormGroup.value.place === "Restaurant"){
      let restaurant: Restaurant = {
        id: this.idPlace,
        name: this.firstFormGroup.value.name,
        arrondissement: this.firstFormGroup.value.arrondissement,
        note_globale: this.secondFormGroup.value.note,
        price: this.firstFormGroup.value.price,
        type: this.firstFormGroup.value.type,
        facade: this.facadeFile,
        the_fork: this.firstFormGroup.value.theFork,
        tested: this.firstFormGroup.value.tested,
        comment: this.firstFormGroup.value.comment,
        note_deco: this.secondFormGroup.value.note_deco,
        liked: false,
        note_quantity: this.secondFormGroup.value.note_quantity,
        quality: this.secondFormGroup.value.note_quality,
        quality_price: this.secondFormGroup.value.quality_price
      };
      this.data.updateRestaurant(restaurant,this.allHoraires,this.allPictures,allComments,this.addresses,this.stationsInPlace);
    }
    else if(this.firstFormGroup.value.place === "Bar"){
      let bar: Bar = {
        id: this.idPlace,
        name: this.firstFormGroup.value.name,
        arrondissement: this.firstFormGroup.value.arrondissement,
        note_globale: this.secondFormGroup.value.note,
        price: this.firstFormGroup.value.price,
        facade: this.facadeFile,
        tested: this.firstFormGroup.value.tested,
        comment: this.firstFormGroup.value.comment,
        type: this.firstFormGroup.value.type,
        note_deco: this.secondFormGroup.value.note_deco,
        liked: false,
        quality: this.secondFormGroup.value.note_quality,
        quality_price: this.secondFormGroup.value.quality_price
      };
      console.log(bar)
      this.data.updateBar(bar,this.allHoraires,this.allPictures,allComments,this.addresses,this.stationsInPlace);
    }

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
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
