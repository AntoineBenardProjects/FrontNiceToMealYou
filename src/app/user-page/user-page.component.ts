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
import { Ligne, Station, StationStats } from '../shared/model/table/transports';
import { TypeCardParams } from '../shared/model/params/cardParams';
import { faWpforms } from '@fortawesome/free-brands-svg-icons';
import { ColorPalette, Palettes } from 'src/assets/style-infos/palettes';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { invalidInputUserComponent, normalInputUserComponent, validInputUserComponent } from '../shared/model/design/inputsDesign';
import { invalidSelectInfosUserComponent, normalSelectInfosUserComponent, selectInfosRegionUserComponent, selectInfosTypeUserComponent, validSelectInfosUserComponent } from '../shared/model/design/selectsDesign';
import { blackLignesUserComponent, invalidButtonUserComponent, normalButtonUserComponent, uploadButtonUserComponent, validButtonUserComponent, whiteButtonPlaceCard } from '../shared/model/design/buttonsDesign';
import { Type, TypeStatistics } from '../shared/model/table/type';
import { categories } from '../shared/data';
import { MovingText } from '../cards/user-card/user-card.component';

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
  protected selectInfosType: SelectInfos = selectInfosTypeUserComponent;
  protected lignesButtonInfos: ButtonInfos = blackLignesUserComponent;
  protected categoriesButtonInfos: ButtonInfos = blackLignesUserComponent;
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
  @HostBinding('style.--loginAndPasswordBackground') loginAndPasswordBackground: string = "var(--white)";
  @HostBinding('style.--typeBackground') typeBackground: string = "var(--white)";
  @HostBinding('style.--stationsBackground') stationsBackground: string = "var(--white)";
  @HostBinding('style.--navigateBackground') navigateBackground: string = "var(--black)";
  @HostBinding('style.--navigateColor') navigateColor: string = "var(--mainColor)";
  protected logoImageSrc: string = "../../assets/logo/white_logo.png";
  private white: string = '';
  private mainColor: string = '';
  protected backgroundColor: string = "var(--mainColor)";
  protected translatePicture: string = "translateX(-60px)";
  protected opacityPicture: number = 0;
  protected opacityNbPlace: number = 0;
  protected heightNavigate: number = 0;
  protected opacityNavigate: number = 0;
  protected widthBackgroundStats: number = 0;
  protected opacityMainInfo: number = 0;
  protected widthBackgroundTitle: number = 0;
  protected heightBackgroundStation: number = 0;
  protected widthBackgroundType: number = 0;
  protected translateYStationPicture: number = -10;
  protected translateXStationPicture: number = -10;
  protected translateLyonText: number = 30;
  protected translateParisStationText: number = 30;
  protected translateYTypePicture: number = -10;
  protected translateXTypePicture: number = -10;
  protected translateToulouseText: number = 30;
  protected translateParisTypeText: number = 30;
  protected showStationsList: boolean = false;
  protected showTypesList: boolean = false;
  protected showLoginInput: boolean = false;
  protected showPassword1Input: boolean = false;
  protected showPassword2Input: boolean = false;
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
  protected isAdmin: string = "";
  protected region: string = "";
  protected stationInfos: StationInfo;
  protected paletteName: string = 'Default';
  private themeSubscriber: Subscription;
  private id: string = localStorage.getItem("id");
  protected img: string = localStorage.getItem("img");
  protected couv: string = localStorage.getItem("couv");
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
  protected stationsList: Station[] = [];
  private stationsOfUser: Station[] = [];
  protected typesList: Type[] = [];
  private typesOfUser: Type[] = [];
  protected animationChange: string = "";
  protected typeInfos: TypeInfo;
  protected statsToShow = "";
  protected passwordChecked: boolean = false;
  protected loginChecked: boolean = false;
  protected loadingValue: number = 0;
  protected loginArray: MovingText[] = [];
  protected sizeOfTitle: number = 0;
  protected counter: number = 0;
  protected animationNumber: boolean = false;

  private ngOnInit(): void{
    this.data.isAdmin(localStorage.getItem("id")).subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
    for(let i = 0; i < this.login.length; i++){
      this.loginArray.push({
        text: this.login[i],
        translate: -30
      });
    }
    this.data.getStatistics(this.id).subscribe((stats: Statistics) => {
      this.nbPlaceOfUser = stats.place;
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
      this.stats.categoriesStats.forEach((categoryStat: CategoryStat) => {
        categoryStat.height = 0;
        categoryStat.background = "";
        categoryStat.opacity = 0;
      });
      this.stats.typeStatsTested.forEach((element:Counter) => {
        let findGraphTested: Graph = this.graphs.find((graph: Graph) => graph.category === element.category);
        let findCounter: Counter = findGraphTested.counter.find((count: Counter) =>{
          count.value === element.value
        });
        if(findCounter != null) findCounter.tested = Number(element.counter);       
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
        this.data.getLignesOfStation(userStation.id).subscribe((lignes: Ligne[]) => {
          this.stationsList.push({
            id: userStation.id,
            name: userStation.name,
            reg: lignes[0].reg,
            lignes: lignes
          })
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
      types.forEach((type: Type) =>{
        type.faIcon = this.placesService.getIconFromName(type.icon);
      });
      this.typesList = this.placesService.getCopyOfElement(types);
      this.typesOfUser.forEach((userType: Type) => {
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
    this.normalButton.backgroundColor = this.titleBackground;
    this.normalButton.colorActive = this.titleBackground;
    const colorLoginAndPassword = this.placesService.shadeColor(this.mainColor, 12);
    this.normalInput.backgroundColor = colorLoginAndPassword;
    this.normalInput.hoverTextColor = colorLoginAndPassword;
    this.validInput.backgroundColor = colorLoginAndPassword;
    this.validInput.hoverTextColor = colorLoginAndPassword;
    this.invalidInput.backgroundColor = colorLoginAndPassword;
    this.invalidInput.hoverTextColor = colorLoginAndPassword;
    this.validButton.backgroundColorActive = colorLoginAndPassword;
    this.validButton.color = colorLoginAndPassword;
    this.invalidButton.backgroundColorActive = colorLoginAndPassword;
    this.invalidButton.color = colorLoginAndPassword;

  }
  private ngAfterViewInit(): void{
    setTimeout(() => {
      this.setAnimation();
    }, 500);
    window.addEventListener("wheel", this.animationOnScroll.bind(this));    
    window.addEventListener("scroll", this.animationOnScroll.bind(this));
  }
  private setAnimation(): void{
    this.translatePicture = 'translateX(0)';
    setTimeout(() => {
      this.opacityNavigate = 1;
      this.widthBackgroundTitle = 100;
      this.normalButton.animationWidth = true;
      this.normalButton = this.placesService.getCopyOfElement(this.normalButton);
    }, 600);
    this.opacityPicture = 1;
    let counter: number = 0;
    this.heightNavigate = 100;
    let interval = setInterval(() => {
      this.loginArray[counter].translate = 0;
      counter += 1;
      if(counter === this.loginArray.length) clearInterval(interval);
    }, 100);
    setTimeout(() => {
      this.opacityNbPlace = 1;
    }, 500);
  }
  private animationOnScroll(): void{
    if(document.getElementById("stats") != null)
    {
      const statsElementTop: number = document.getElementById("stats").getBoundingClientRect().top;
      const offsetAnimationActivationStats: number = 400;
      if(statsElementTop + offsetAnimationActivationStats - window.innerHeight <= 0){
        this.widthBackgroundStats = 100;
        setTimeout(() => {
          this.opacityMainInfo = 1;
        }, 200);
      }
      this.stats.categoriesStats.forEach((stat: CategoryStat,index: number) => {
        const categoryElement: HTMLElement = document.getElementById(stat.category);
        if(categoryElement != null){
          const elementTop = categoryElement.getBoundingClientRect().top;
          const offsetAnimationActivationCategory: number = window.innerWidth * .025 * index + 100;
          if(elementTop + offsetAnimationActivationCategory - window.innerHeight <= 0){
            sessionStorage.getItem("device") === 'desktop' ? stat.height = 25 : stat.height = 55;
            stat.background = 'url(../../assets/common/'+stat.category+'.jpg)';
            if(!this.animationNumber) this.setNumberAnimation();
            setTimeout(() => {
              stat.opacity = 1;
            }, 300);
          }
        }
      });

      const selectStatsElementTop: number = document.getElementById("selectStats").getBoundingClientRect().top;
      const offsetAnimationActivationSelectStats: number = 100;
      if(selectStatsElementTop + offsetAnimationActivationSelectStats - window.innerHeight <= 0){
        this.normalSelectInfos.animationWidth = true;
        this.normalSelectInfos = this.placesService.getCopyOfElement(this.normalSelectInfos);
      }

      const stationsElementTop: number = document.getElementById("stations").getBoundingClientRect().top;
      const offsetAnimationActivationStations: number = 100;
      if(stationsElementTop + offsetAnimationActivationStations - window.innerHeight <= 0){
        this.heightBackgroundStation = 100;
        setTimeout(() => {
          this.translateXStationPicture = 0;
          this.translateYStationPicture = 0;
          this.showStationsList = true;
          setTimeout(() => {
            this.translateParisStationText = 0;
            setTimeout(() => {
              this.translateLyonText = 0;
            }, 200);
          }, 300);
          this.selectInfosRegion.animationWidth = true;
          this.selectInfosRegion = this.placesService.getCopyOfElement(this.selectInfosRegion);
        }, 500);
      }

      const typesElementTop: number = document.getElementById("types").getBoundingClientRect().top;
      const offsetAnimationActivationTypes: number = 200;
      if(typesElementTop + offsetAnimationActivationTypes - window.innerHeight <= 0){
        this.selectInfosType.backgroundColor = this.typeBackground;
        this.selectInfosType.topHoverColor = this.typeBackground;
        this.selectInfosType.optionBackgroundColor = this.typeBackground;
        this.selectInfosType.hoverTextColor = this.typeBackground;
        this.widthBackgroundType = 100;
        setTimeout(() => {
          this.translateXTypePicture = 0;
          this.translateYTypePicture = 0;
          this.showTypesList = true;
          setTimeout(() => {
            this.translateParisTypeText = 0;
            setTimeout(() => {
              this.translateToulouseText = 0;
            }, 200);
          }, 300);
            this.selectInfosType.animationWidth = true;
            this.selectInfosType = this.placesService.getCopyOfElement(this.selectInfosType);
          }, 500);
      }

      const loginAndPasswordElementTop: number = document.getElementById("loginAndPassword").getBoundingClientRect().top;
      const offsetAnimationActivationLoginAndPassword: number = 200;
      if(loginAndPasswordElementTop + offsetAnimationActivationLoginAndPassword - window.innerHeight <= 0){
        this.loginAndPasswordBackground = this.placesService.shadeColor(this.mainColor, 12);
        this.invalidButton.animationWidth = true;
        this.invalidButton = this.placesService.getCopyOfElement(this.invalidButton);
        setTimeout(() => {
          this.showLoginInput = true;
          this.showPassword1Input = true;
          setTimeout(() => {
            this.showPassword2Input = true;
          }, 100);
        }, 200);
      }
    }
  }
  private setNumberAnimation(): void{
    this.animationNumber = true;
    this.counter = 0;
    let endValue: number = Number(this.nbPlaceOfUser);
    let counter = setInterval(() => {
      this.counter += 1;
      if(this.counter === endValue){
        clearInterval(counter);
      }
    }, 20);
  }
  protected navigate(url: string): void{
      this.router.navigate([url]);
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
          this.stationsList.push({
            id:filter[0].id,
            lignes: lignes,
            reg: this.region,
            name: filter[0].name
          });
          this.stations.push(filter[0]);
          this.stations = this.stations.slice();          
        });
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
        this.stationsList = this.stationsList.filter((station: Station) => {
          if(station.id === idToSuppress) return false;
          return true;
        }).slice();
      }
    }
  }
  protected removeStation(id: string): void{
    this.stationInfos = null;
    let option: SelectData = this.stationSelect.find((station: SelectData) => station.id === id);
    option.selected = false;
    this.stations = this.stations.filter((station: SelectData) => {
      if(station.id === id) return false;
      return true;
    }).slice();
    this.stationsList = this.stationsList.filter((station: Station) => {
      if(station.id === id) return false;
      return true;
    }).slice();
  }
  protected selectStation(station: Station): void{
    this.data.getStatisticsOfStation(station.id).subscribe((stats: StationStats[]) => {
      this.stationInfos = {
        station: {
          id: station.id,
          name: station.name
        },
        stats: stats
      }
    });
    
  }
  protected getIconOfCategory(category: string): IconDefinition{
    return this.placesService.getIconOfCategory(category);
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
        filter[0].originalData.faIcon = this.placesService.getIconFromName(filter[0].originalData.icon);
        this.typesList.push(filter[0].originalData);
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
        this.typesList = this.typesList.filter((type: Type) => {
          if(type.id === idToSuppress) return false;
          return true;
        }).slice();
      }
    }
  }
  protected selectType(type: Type): void{
    this.data.getStatsOfType(type).subscribe((stats: TypeStatistics) => {
      this.typeInfos = {
        type: type,
        stats: stats
      }
    });
    
  }
  protected removeType(id: string): void{
    let option: SelectData = this.typeSelect.find((type: SelectData) => type.id === id);
    if(option != null)  option.selected = false;
    this.types = this.types.filter((type: SelectData) => {
      if(type.id === id) return false;
      return true;
    }).slice();
    this.typesList = this.typesList.filter((type: Type) => {
      if(type.id === id) return false;
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
  protected getCouv(event: any): void{
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (_event: any) => {
        if(_event.target.result.length != null){
          this.data.setCouv(this.id, _event.target.result).subscribe((res:Message) => {
            if(!res.error){
              this.couv = _event.target.result;
              localStorage.setItem("couv", _event.target.result);
            }
          });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    
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
    const user: User = new User(this.login,this.userForm.password,this.id);
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
    this.data.getValidLogin(this.userForm.newLogin).subscribe((res: boolean) => {
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
    if(stat == null){
      setTimeout(() => {
        findGraph.counter[index].legend = "";
      },300);
    } else{
      findGraph.counter[index].legend = findGraph.counter[index].percent + "%";
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
  
  private ngOnDestroy(): void{
    window.removeAllListeners("wheel");    
    window.removeAllListeners("scroll");    
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
interface TypeInfo{
  type: Type,
  stats: TypeStatistics
}
interface StationInfo{
  station: Station,
  stats: StationStats[]
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