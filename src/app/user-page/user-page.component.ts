import { Component, HostBinding } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Message } from '../shared/model/params/message';
import { PlacesService } from '../services/places.service';
import { CategoryStat, Counter, Statistics, User } from '../shared/model/table/user';
import { InputInfos, SelectInfos, ButtonInfos, SelectData } from '../shared/model/designs';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCameraRetro, faChartSimple, faMeteor, faPowerOff, faTrainSubway, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Subject, Subscription } from 'rxjs';
import { Place } from '../shared/model/table/places';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Ligne, Station } from '../shared/model/table/transports';
import { StationCardParams, TypeCardParams } from '../shared/model/params/cardParams';
import { faWpforms } from '@fortawesome/free-brands-svg-icons';
import { ColorPalette, Palettes } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { invalidInputUserComponent, normalInputUserComponent, validInputUserComponent } from '../shared/model/design/inputsDesign';
import { invalidSelectInfosUserComponent, normalSelectInfosUserComponent, selectInfosRegionUserComponent, selectInfosTypeUserComponent, validSelectInfosUserComponent } from '../shared/model/design/selectsDesign';
import { invalidButtonUserComponent, normalButtonUserComponent, uploadButtonUserComponent, validButtonUserComponent } from '../shared/model/design/buttonsDesign';
import { Type } from '../shared/model/table/type';
import { categories } from '../shared/data';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  animations: [ 
    trigger('infosChange', [
      state('showInfos', style({
        height: '60vh',
      })),
      state('hideInfos', style({
        height: '0'
      })),
      transition('* => hiden', [
        animate('.4s ease-out')
      ]),
      transition('* => show', [
        animate('.4s ease-out')
    ])
  ]), 
  trigger('stationsChange', [
      state('showStations', style({
        width: '100vw',
      })),
      state('hideStations', style({
        width: '0'
      })),
      transition('* => hiden', [
        animate('.4s ease-out')
      ]),
      transition('* => show', [
        animate('.4s ease-out')
    ])
  ])]
})
export class UserPageComponent {

  constructor(private data: DatabaseService,
    private placesService: PlacesService,
    private themeService: ThemeService,
    private router: Router
    ){
      const SelectedPalette: ColorPalette = Palettes.find((element: ColorPalette) => element.name === this.paletteName);

      if(SelectedPalette != null) this.themeService.setPalette(SelectedPalette);
      this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {


        this.white = Palette.white;
        this.mainColor = Palette.mainColor;
      });
    }

//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Style Infos  */
  protected normalInput: InputInfos = normalInputUserComponent;
  protected validInput: InputInfos = validInputUserComponent;
  protected invalidInput: InputInfos = invalidInputUserComponent;
  protected normalSelectInfos: SelectInfos = normalSelectInfosUserComponent;
  protected validSelectInfos: SelectInfos = validSelectInfosUserComponent;
  protected invalidSelectInfos: SelectInfos = invalidSelectInfosUserComponent;
  protected normalButton: ButtonInfos = normalButtonUserComponent;
  protected validButton: ButtonInfos = validButtonUserComponent;
  protected invalidButton: ButtonInfos = invalidButtonUserComponent;
  protected uploadButton: ButtonInfos = uploadButtonUserComponent;
  protected selectInfosRegion: SelectInfos = selectInfosRegionUserComponent;
  protected selectInfosType: SelectInfos = selectInfosTypeUserComponent
/*  Icon  */
  protected userIcon: IconDefinition = faUser;
  protected crossIcon: IconDefinition = faXmark;
  protected photoIcon: IconDefinition = faCameraRetro;
  protected statsIcon: IconDefinition = faChartSimple;
  protected formIcon: IconDefinition = faWpforms;
  protected trainIcon: IconDefinition = faTrainSubway;
  protected prefIcon: IconDefinition = faMeteor;
  protected powerIcon: IconDefinition = faPowerOff;
/*  Css  */
  @HostBinding('style.--titleBackground') titleBackground: string = "";
  @HostBinding('style.--loginAndPasswordBackground') loginAndPasswordBackground: string = "";
  @HostBinding('style.--typeBackground') typeBackground: string = "";
  @HostBinding('style.--navigateBackground') navigateBackground: string = "var(--black)";
  @HostBinding('style.--navigateColor') navigateColor: string = "var(--mainColor)";
  protected logoImageSrc: string = "../../assets/logo/white_logo.png";
  private white: string = '';
  private mainColor: string = '';
  protected backgroundColor: string = "var(--mainColor)";
/*  Selects  */
  protected regionSelect: SelectData[] = [];
  protected transportSelect: SelectData[] = [];
  protected ligneSelect: SelectData[] = [];
  protected stationSelect: SelectData[] = [];
  protected stations: SelectData[] = [];
  protected categorySelect: SelectData[] = [
    {id: "Restaurant", name: "Restaurant", selected: false},
    {id: "Bar", name: "Bar", selected: false},
    {id: "Loisir", name: "Loisir", selected: false},
    {id: "Service", name: "Service", selected: false},
    {id: "Magasin", name: "Magasin", selected: false},
    {id: "Autre", name: "Autre", selected: false},
  ];
  protected statsSelects: SelectData[] = [
    {id: "Restaurant", name: "Statistiques restaurants", selected: false},
    {id: "Bar", name: "Statistiques bars", selected: false},
    {id: "Loisir", name: "Statistiques loisirs", selected: false},
    {id: "Service", name: "Statistiques services", selected: false},
    {id: "Magasin", name: "Statistiques magasins", selected: false},
    {id: "Autre", name: "Statistiques autres lieux", selected: false},
  ];
  protected typeSelect: SelectData[] = [];
  protected types: SelectData[] = [];
/*  Algo  */
  protected region: string = "";
  protected stationsCardInfos: StationCardParams[] = [];
  protected paletteName: string = 'Default';
  private themeSubscriber: Subscription;
  private id: string = localStorage.getItem("id");
  protected img: string = localStorage.getItem("img");
  protected login: string = localStorage.getItem("login");
  private selected: string[] = [];
  protected userForm: UserForm = {
    newLogin: "",
    password: "",
    newPassword: ""
  }
  protected errorMessage: string = "";
  protected showError: boolean = false;
  protected error: boolean = false;
  protected nbPlaceOfUser: number = 0;
  protected stats: Statistics;
  protected graphs: Graph[] = [];
  private stationsOfUser: Station[] = [];
  private typesOfUser: Type[] = [];
  protected divToShow = "infos";
  protected animationChange: string = "";
  protected typesCardInfos: TypeCardParams[] = [];
  protected statsToShow = "";
  protected passwordChecked: boolean = false;
  protected loginChecked: boolean = false;
  protected loadingValue: number = 0;
  protected showPage: boolean = false;

  private ngOnInit(): void{
    this.data.getPlacesOfUser(this.id).subscribe((places:Place[]) => {
      this.nbPlaceOfUser = places.length;
      this.data.getStatistics(this.id).subscribe((stats: Statistics) => {
        this.stats = stats;
        categories.forEach((category: string) => {
          this.graphs.push({
            category: category,
            counter: [],
          });
        });
        this.stats.typeStats.sort((a:Counter,b:Counter) => {
          if(a.counter > b.counter) return 1;
          return -1;
        });
        this.stats.typeStats.forEach((element:Counter) => {
          let findGraphAdded: Graph = this.graphs.find((graph: Graph) => graph.category === element.category);
          let findStat: CategoryStat = stats.categoriesStats.find((stat: CategoryStat) => stat.category === element.category);
          delete element.category;
          element.animationFinished = true;
          findGraphAdded.counter.push(element);
          if(findStat.count > 0){
            findGraphAdded.counter.forEach((count: Counter) => {
              count.percent = Math.round((count.counter/findStat.count) * 1000)/10;
            });
            findGraphAdded.counter.sort((a: Counter,b:Counter) => {
              if(a.percent > b.percent) return -1;
              return 1;          
            });
          }          
        });
        this.stats.typeStatsTested.forEach((element:Counter) => {
          let findGraphTested: Graph = this.graphs.find((graph: Graph) => graph.category === element.category);
          let findCounter: Counter = findGraphTested.counter.find((count: Counter) =>{
            count.value === element.value
          });
          if(findCounter != null) findCounter.tested = element.counter;       
        });
        this.graphs.forEach((graph: Graph) => {
          if(graph.counter.length === 0){
            this.statsSelects = this.statsSelects.filter((option: SelectData) => {
              if(option.id === graph.category)  return false;
              return true;
            });
          }  else if(graph.counter.length > 10){
            graph.counter.splice(10,graph.counter.length - 10);
          }
        });
        this.loadingValue += 25;
      });
    });
    this.data.getAllRegion().subscribe((res: string[]) => {
      res.forEach((element: string) => {
        this.regionSelect.push({
          id: element,
          name: element,
          selected: false
        });
      });
      this.regionSelect = this.regionSelect.slice();
      this.loadingValue += 25;
    });
    this.data.getStationsOfUser(this.id).subscribe((stations: Station[]) => {
      this.stationsOfUser = this.placesService.getCopyOfElement(stations);
      this.stationsOfUser.forEach((userStation: Station) => {
        this.stationsCardInfos.push({
          station: {
            id: userStation.id,
            name: userStation.name
          },
          width: sessionStorage.getItem('device') === 'computer' ? 20 : 80,
          height: 450,
        });
        this.stations.push({
          id: userStation.id,
          name: userStation.name,
          selected: true
        });
      });
      this.loadingValue += 25;
    });
    this.data.getTypesOfUser(this.id).subscribe((types: Type[]) => {
      this.typesOfUser = this.placesService.getCopyOfElement(types);
      this.typesOfUser.forEach((userType: Type) => {
        this.typesCardInfos.push({
          type: userType,
          width: sessionStorage.getItem('device') === 'computer' ? 20 : 80,
          height: 400,
        });
        this.types.push({
          id: userType.id,
          name: userType.name,
          originalData: userType,
          selected: true
        });
      });
      this.loadingValue += 25;
    });
    this.titleBackground = this.placesService.shadeColor(this.mainColor, 6);
    this.loginAndPasswordBackground = this.placesService.shadeColor(this.mainColor, 12);
    this.normalInput.backgroundColor = this.loginAndPasswordBackground;
    this.normalInput.hoverTextColor = this.loginAndPasswordBackground;
    this.validInput.backgroundColor = this.loginAndPasswordBackground;
    this.validInput.hoverTextColor = this.loginAndPasswordBackground;
    this.invalidInput.backgroundColor = this.loginAndPasswordBackground;
    this.invalidInput.hoverTextColor = this.loginAndPasswordBackground;
    this.validButton.backgroundColorActive = this.loginAndPasswordBackground;
    this.validButton.color = this.loginAndPasswordBackground;
    this.invalidButton.backgroundColorActive = this.loginAndPasswordBackground;
    this.invalidButton.color = this.loginAndPasswordBackground;
    this.normalButton.backgroundColor = this.titleBackground;
    this.normalButton.colorActive = this.titleBackground;
    this.typeBackground = this.placesService.shadeColor(this.white, -6);
    this.selectInfosType.backgroundColor = this.typeBackground;
    this.selectInfosType.topHoverColor = this.typeBackground;
    this.selectInfosType.optionBackgroundColor = this.typeBackground;
    this.selectInfosType.hoverTextColor = this.typeBackground;
  }
  protected navigate(divName: string): void{
    if(this.divToShow !== divName){
      let newBackgroundColor: string = "";
      let newNavigateBackground: string = "";
      let newNavigateColor: string = "";
      if(this.divToShow !== 'infos' && divName === 'infos'){
        this.animationChange = "infos";
        newBackgroundColor = 'var(--mainColor)';
        newNavigateBackground = 'var(--black)';
        newNavigateColor = 'var(--mainColor)';
      }
      if(this.divToShow !== 'preferences' && divName === 'preferences'){
        this.animationChange = "preferences";
        newBackgroundColor = 'var(--white)';
        newNavigateBackground = 'var(--secondColor)';
        newNavigateColor = 'var(--white)';
      }
      setTimeout(() => {
        this.divToShow = divName;
        this.backgroundColor = newBackgroundColor;
        this.navigateBackground = newNavigateBackground;
        this.navigateColor = newNavigateColor;
        this.animationChange = '';
      }, 400);
    } 
  }
  protected setPreferenceGeo(event: any, params: string): void{
    if(params === 'reg'){
      this.transportSelect = [];
      this.ligneSelect = [];
      this.stationSelect = [];
      this.region = event.find((element: SelectData) => element.selected === true)?.name;
      this.data.getTransportsOfRegion(this.region).subscribe((res: string[]) => {
        res.forEach((transport: string) => {
          this.transportSelect.push({
            id: transport,
            name: transport,
            selected: false
          });
        });
        this.transportSelect = this.transportSelect.slice();
      });
    } else if(params === 'trans'){
      this.ligneSelect = [];
      this.stationSelect = [];
      let transport = event.find((element: SelectData) => element.selected === true)?.name;
      this.data.getLignesOfRegionByTransport(this.region,transport).subscribe((res: Ligne[]) => {
        res.forEach((ligne: Ligne) => {
          this.ligneSelect.push({
            id: ligne.id,
            name: ligne.name,
            selected: false
          });
        });
        this.ligneSelect = this.ligneSelect.slice();
      });
    } else if(params === 'lig'){
      this.stationSelect = [];
      const ligne = event.find((element: SelectData) => element.selected === true)?.id;
      this.data.getStationsOfLigne(ligne).subscribe((res: Station[]) => {
        res.forEach((station: Station) => {
          const find: SelectData = this.stations.find((element: SelectData) => station.id === element.id);
          let selected: boolean = false;
          if(find != null)  selected = true;
          this.stationSelect.push({
            id: station.id,
            name: station.name,
            selected: selected
          });
        });
        this.stationSelect = this.stationSelect.slice();
      });
    } else if(params === 'stat'){
      let filter = event.filter((station: SelectData) =>{
        const find = this.stations.find((check: SelectData) => check.id === station.id);
        if(find != null)  return false;
        else if(station.selected) return true;
        return false;
      });
      if(filter.length > 0) {
        this.data.getLignesOfStation(filter[0].id).subscribe((lignes: Ligne[]) => {
          filter.originalData = lignes;
        });
        this.stations.push(filter[0]);
        this.stationsCardInfos.push({
          station: {
            id: filter[0].id,
            name: filter[0].name
          },
          width: sessionStorage.getItem('device') === 'computer' ? 20 : 80,
          height: 450,
        });
        this.stations = this.stations.slice();
      }
      else{
        filter = event.filter((station: SelectData) => {
          const find = this.stations.find((check: SelectData) => check.id === station.id);
          if(find != null && !station.selected)  return true;
          return false;
        });
        const idToSuppress = filter[0].id;
        this.stations = this.stations.filter((station: SelectData) => {
          if(station.id === idToSuppress) return false;
          return true;
        }).slice();
        this.stationsCardInfos = this.stationsCardInfos.filter((params: StationCardParams) => {
          if(params.station.id === idToSuppress) return false;
          return true;
        }).slice();
      }
    }
  }
  protected removeStation(id: string): void{
    let option: SelectData = this.stationSelect.find((station: SelectData) => station.id === id);
    option.selected = false;
    this.stations = this.stations.filter((station: SelectData) => {
      if(station.id === id) return false;
      return true;
    }).slice();
    this.stationsCardInfos = this.stationsCardInfos.filter((params: StationCardParams) => {
      if(params.station.id === id) return false;
      return true;
    }).slice();
  }
  protected setPreferenceType(event: any, params: string): void{
    if(params === 'cat'){
      let category = event.find((element: SelectData) => element.selected === true)?.name;
      this.typeSelect = [];
      this.data.getTypeByCategory(category).subscribe((types: Type[]) => {
        types.forEach((type: Type) => {
          let selected: boolean = false;
          if(this.types.find((element: SelectData) => type.id === element.id) != null)  selected = true;
          this.typeSelect.push({
            id: type.id,
            name: type.name,
            originalData: type,
            selected: selected
          });
        });
        this.typeSelect = [...this.typeSelect];
      });
    } else if(params === 'type'){
      let filter = event.filter((type: SelectData) =>{
        const find = this.types.find((check: SelectData) => check.id === type.id);
        if(find != null)  return false;
        else if(type.selected) return true;
        return false;
      });
      if(filter.length > 0){
        this.types.push(filter[0]);
        this.typesCardInfos.push({
          type: filter[0].originalData,
          width: sessionStorage.getItem('device') === 'computer' ? 20 : 80,
          height: 400
        });
      }
      else{
        filter = event.filter((type: SelectData) => {
          const find = this.types.find((check: SelectData) => check.id === type.id);
          if(find != null && !type.selected)  return true;
          return false;
        });
        const idToSuppress = filter[0].id;
        this.types = this.types.filter((type: SelectData) => {
          if(type.id === idToSuppress) return false;
          return true;
        }).slice();
        this.typesCardInfos = this.typesCardInfos.filter((infos: TypeCardParams) => {
          if(infos.type.id === idToSuppress) return false;
          return true;
        }).slice();
      }
    }
  }
  protected removeType(id: string): void{

    let option: SelectData = this.typeSelect.find((type: SelectData) => type.id === id);
    if(option != null)  option.selected = false;
    this.types = this.types.filter((station: SelectData) => {
      if(station.id === id) return false;
      return true;
    }).slice();
    this.typesCardInfos = this.typesCardInfos.filter((params: TypeCardParams) => {
      if(params.type.id === id) return false;
      return true;
    }).slice();
  }
  protected setValue(event: any, params: string): void{
    if(params === 'login'){
      this.userForm.newLogin = event.target.value;
      this.checkLogin();
    }
    else if(params === 'password'){
      this.userForm.password = event.target.value;
      this.checkPassword();
    }
    else if(params === 'newPassword'){
      this.userForm.newPassword = event.target.value;
      this.checkPassword();
    }
    else if(params === 'stats'){
      const category: string = event.find((element: SelectData) => element.selected === true).id;
      this.statsToShow = category;
    }
  }
  protected removeImg(): void{
    this.data.setImage(this.id, "").subscribe((res:Message) => {
      if(!res.error){
        this.img = "";
        localStorage.setItem("img", "");
      }
    });
  }
  protected getFile(event: string): void{
    if(event.length != null){
      this.data.setImage(this.id, event).subscribe((res:Message) => {
        if(!res.error){
          this.img = event;
          localStorage.setItem("img", event);
        }
      });
    }
  }
  protected test(e: any): void{
    console.log(e);
  }
  protected checkPassword(): void{
    const user: User = {
      id: this.id,
      password: this.userForm.password,
      login: this.login,
      role: '',
      img: ""
    }
    let checkPassword: Subject<boolean> = new Subject();

    checkPassword.subscribe((check: boolean) => {
      if(check){
        if(this.userForm.newPassword.length > 3)  this.passwordChecked = true;
        else{
          this.passwordChecked = false;
          this.errorMessage = "Mot de passe trop court";
        }
      } else{
        this.passwordChecked = false;
        this.errorMessage = "Veuillez donner l'ancien mot de passe";
      }
    });
    this.data.checkPassword(user).subscribe((res: Message) => {
      if(!res.error){
        checkPassword.next(true);
      } else{
        checkPassword.next(false);
      }
    });
  }
  protected checkLogin(): void{
    let checkLogin: Subject<boolean> = new Subject();
    checkLogin.subscribe((check: boolean) => {
      if(check){
        if(this.userForm.newLogin.length > 2)  this.loginChecked = true;
        else{
          this.loginChecked = false;
        }
      } else{
        this.loginChecked = false;
      }
    });
    this.data.getValidName(this.userForm.newLogin).subscribe((res: boolean) => {
      checkLogin.next(res);
    });
  }
  protected setLogin(): void{
    if(this.loginChecked){
      this.data.setLogin(this.id,this.userForm.newLogin).subscribe((token) => {
        localStorage.setItem("token",token.token);
        localStorage.setItem("login",this.userForm.newLogin);
        this.login = this.userForm.newLogin;
      });
      this.error = false;
      this.errorMessage = "Login modifié";
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    } else{
      this.userForm.newLogin.length > 2 ? this.errorMessage = "Ce login est déjà pris" : this.errorMessage = "Le login doit faire plus de 2 caractères";
      this.error = true;
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
    }
    
  }
  protected setPassword(): void{
    if(this.passwordChecked){
      this.data.setPassword(this.id,this.userForm.newPassword);
      this.userForm.newPassword = "";
      this.userForm.password = "";
      this.error = false;
      this.errorMessage = "Mot de passe modifié";
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    } else{
      if(this.userForm.newPassword.length > 3){
        this.userForm.password.length === 0 ? this.errorMessage = "Veuillez donner l'ancien mot de passe" : this.errorMessage = "Le mot de passe est incorrect";
      } else this.errorMessage = "Le mot de passe doit faire plus de 3 caractères";
      this.error = true;
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    }
  }
  protected select(element: any): void{
    let indexToSuppress = null;
    this.selected.forEach((station,index) => {
      if(station === element) indexToSuppress = index;
    });
    if(indexToSuppress != null) this.selected.splice(indexToSuppress,1);
    else  this.selected.push(element);
  }
  protected getSizeOfLegend(stat: Counter,index: number, category: string){
    let findGraph: Graph = this.graphs.find((graph: Graph) => graph.category === category);
    if(findGraph.counter[index].animationFinished){
      if(stat == null){
        findGraph.counter[index].animationFinished = false;
        findGraph.counter[index].legendWidth = 0;
        setTimeout(() => {
          findGraph.counter[index].animationFinished = true;
          findGraph.counter[index].legend = "";
        },300);
      } else{
        category !== "Autre" ? findGraph.counter[index].legend = findGraph.counter[index].percent + "% des " + category.toLocaleLowerCase() + "s" : findGraph.counter[index].legend = findGraph.counter[index].percent + "% des lieux autres"
        findGraph.counter[index].legendWidth = findGraph.counter[index].legend.length * 12;
      }
    }
  }
  protected deconnect(): void{
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(() => {
      this.router.navigate(['']);
    }, 1500);
  }
  protected changePage(): void{
    this.router.navigate(['/follow'])
  }
  protected getShowPage(): void{
    this.showPage = true;
  }
  private ngOnDestroy(): void{
    this.stationsOfUser.forEach((userStation: Station) => {
      if(this.stations.find((station: SelectData) => station.id === userStation.id) == null){
        this.data.deleteStationOfUser(this.id,userStation.id);
      }
    });
    this.stations.forEach((userStation: SelectData) => {
      if(this.stationsOfUser.find((station: Station) => station.id === userStation.id) == null){
        this.data.addStationOfUser(this.id,userStation.id);
      }
    });

    this.typesOfUser.forEach((userType: Type) => {
      if(this.types.find((type: SelectData) => type.id === userType.id) == null){
        this.data.deleteTypeOfUser(this.id,userType.id);
      }
    });
    this.types.forEach((type: SelectData) => {
      if(this.typesOfUser.find((userType: Type) => type.id === userType.id) == null){
        this.data.addTypeOfUser(this.id,type.id);
      }
    });
  }
}
interface Graph{
  category: string,
  counter: Counter[],
}
interface UserForm{
  newLogin: string,
  password: string,
  newPassword: string
}