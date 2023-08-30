// import { Component, ElementRef, OnInit } from '@angular/core';
// import { Observable, Subject, Subscription, filter } from 'rxjs';
// import { Data } from 'src/data';
// import { CardParams } from '../model/cardParams';
// import { CircleNoteParams } from '../model/circle-notes-params';
// import { Horaires } from '../model/horaires';
// import { TypePicture } from '../model/typePicture';
// import { DatabaseService } from '../services/database.service';
// import { PlacesService } from '../services/places.service';
// import { desktopParams, mobileParams } from '../shared/circleNoteParams';
// import { Router } from '@angular/router';
// import { ColorPalette } from 'src/assets/style-infos/palettes';
// import { ThemeService } from '../services/theme.service';
// import { SelectData, SelectInfos } from '../shared/model/designs';
// import { Address } from '../model/address';
// import { Restaurant } from '../model/places';

// @Component({
//   selector: 'app-restaurants-page',
//   templateUrl: './restaurants-page.component.html',
//   styleUrls: ['./restaurants-page.component.scss']
// })
// export class RestaurantsPageComponent implements OnInit {

//   filterSubscriber: Subscription = new Subscription();
//   private themeSubscriber: Subscription = new Subscription();

//   constructor(private data: DatabaseService,
//     private placeService: PlacesService,
//     private router: Router,
//     private elementRef: ElementRef,
//     private themeService: ThemeService) {
//     this.filterSubscriber = placeService.setFilterToSave().subscribe((id: string) => {
//       // this.clearSessionStorageData = false;
//       // let allTypeSelected: string[] = [];
//       // let allLigneSelected: string[] = [];
//       // let allArrondissementSelected: string[] = [];
//       // let opened: string[] = [];
//       // let tested: string[] = [];
//       // let findAll = this.allType.options.find((element: MatOption) => element.value === 0 && element.selected );
//       // if(findAll == null){
//       //   this.allType.options.forEach((element: MatOption) => {
//       //     if(element.selected)  allTypeSelected.push(element.value);
//       //   });
//       // } else{
//       //   allTypeSelected.push("0");
//       // }

//       // findAll = this.allLigne.options.find((element: MatOption) => element.value === 0 && element.selected );
//       // if(findAll == null){
//       //   this.allLigne.options.forEach((element: MatOption) => {
//       //     if(element.selected)  allLigneSelected.push(element.value.name);
//       //   });
//       // } else{
//       //   allLigneSelected.push("0");
//       // }

//       // findAll = this.allArrondissement.options.find((element: MatOption) => element.value === 0 && element.selected );
//       // if(findAll == null){
//       //   this.allArrondissement.options.forEach((element: MatOption) => {
//       //     if(element.selected)  allArrondissementSelected.push(element.value);
//       //   });
//       // } else{
//       //   allArrondissementSelected.push("0");
//       // }

//       // this.opened.options.forEach((element: MatOption) => {
//       //   if(element.selected)  opened.push(element.value);
//       // });
//       // this.tested.options.forEach((element: MatOption) => {
//       //   if(element.selected)  tested.push(element.value);
//       // });
//       // sessionStorage.setItem("page","Restaurant");
//       // sessionStorage.setItem("scrollPosition", JSON.stringify(window.pageYOffset));
//       // sessionStorage.setItem("orderNote",JSON.stringify(this.orderNote));
//       // sessionStorage.setItem("orderAlphabetical",JSON.stringify(this.orderAlphabetical));
//       // sessionStorage.setItem("typeFilter",JSON.stringify(allTypeSelected));
//       // sessionStorage.setItem("arrondissementFilter",JSON.stringify(allArrondissementSelected));
//       // sessionStorage.setItem("ligneFilter",JSON.stringify(allLigneSelected));
//       // sessionStorage.setItem("openedFilter",JSON.stringify(opened));
//       // sessionStorage.setItem("testedFilter",JSON.stringify(tested));
//       // router.navigate(['/showed',id]);
//     });

//     this.themeSubscriber = themeService.getPalette().subscribe((Palette: ColorPalette) => {
//       this.elementRef.nativeElement.style.setProperty('--mainColor', Palette.mainColor);
//       this.elementRef.nativeElement.style.setProperty('--white', Palette.white);
//       this.elementRef.nativeElement.style.setProperty('--black', Palette.black);
//       this.elementRef.nativeElement.style.setProperty('--secondColor', Palette.secondColor);
//       this.elementRef.nativeElement.style.setProperty('--thirdColor', Palette.thirdColor);
//     });
//   }
  
//   private allRestaurants: Restaurant[];
//   protected filteredRestaurants: Restaurant[];
//   protected cardParams: CardParams[] = [];
//   protected circleNoteParams: CircleNoteParams

//   protected selectsInfos: SelectInfos = {
//     backgroundColor: 'var(--mainColor)',
//     textColor: 'var(--white)',
//     hoverBackgroundColor: 'var(--mainColor)',
//     hoverTextColor: 'var(--white)'
//   }
//   protected openSidebar: boolean = true;
//   protected typesSelect:SelectData[] = [];
//   protected lignesSelect: SelectData[] = [];
//   protected getLignesData: boolean = false;
//   protected arrondissementsSelect: SelectData[] = [];
//   protected testedAndOpenedSelect: SelectData[] = [
//     {id: "Oui",name: "Oui"},
//     {id: "Non", name: "Non"}
//   ];
//   private filterInfos: FilterInfo[] = [
//     {name: "type", data: []},
//     {name: "open", data: []},
//     {name: "ligne", data: []},
//     {name: "arrondissement", data: []},
//     {name: "test", data: []},
//   ];
//   protected nothing: boolean = false;
//   protected getData: boolean = false;

//   protected initFilters: boolean = false;
//   protected orderNote: boolean = false;
//   protected orderAlphabetical: boolean = true;
//   protected clearSessionStorageData: boolean = true;

//   protected addressesSelectInfos: SelectInfos = {
//     backgroundColor: 'var(--mainColor)',
//     textColor: 'var(--white)',
//     hoverBackgroundColor: 'var(--mainColor)',
//     hoverTextColor: 'var(--white)',
//     width: 30,
//     fontSize: 20
//   }


//   ngOnInit(): void {
//     this.initStyle();
//     this.initOptions();
//     this.initData();
//   }
//   initStyle(){
//     let windowWidth = window.innerWidth;
//     let windowHeight = window.innerHeight;
//     if(windowHeight > windowWidth){
//       this.circleNoteParams = mobileParams;
//     } else{
//       this.circleNoteParams = desktopParams;
//     }
//   }
//   initData(){
//     let getAllData: Subject<boolean> = new Subject();
//     let countData: number = 0;

//     this.data.getAllRestaurants().subscribe((restaurants: Restaurant[]) => {
//       this.allRestaurants = restaurants;
//       this.filteredRestaurants = restaurants;
//       countData++;
//       if(countData === 2){
//         getAllData.next(true);
//       }
//     });
//   }
//   initOptions(){
//     Data.forEach((type: TypePicture) => {
//       if(type.place === "Restaurant") {
//         const selectValue: SelectData = {
//           id: type.type,
//           name: type.type
//         }
//         this.typesSelect.push(selectValue);
//       }
//     });
//     for(let i = 1; i < 21; i++){
//       const selectValue: SelectData = {
//         name: i.toString(),
//         id: i.toString()
//       }
//       this.arrondissementsSelect.push(selectValue);
//     }
//   }

//   sort(event: SelectData[], filterName: string){
//     let getOpen: Subject<boolean> = new Subject();
//     let setCardParams: Subject<boolean> = new Subject();
//     this.filteredRestaurants = this.allRestaurants.slice();
//     let typeFilter!: SelectData[];
//     let openFilter!: SelectData[];
//     let testFilter!: SelectData[];
//     let ligneFilter!: SelectData[];

//     this.filterInfos.forEach((filter: FilterInfo) => {
//       if(filter.name === filterName)  filter.data = event;
//       switch(filter.name){
//         case 'type':
//           typeFilter = filter.data;
//         break;
//         case 'open':
//           openFilter = filter.data;
//         break;
//         case 'test':
//           testFilter = filter.data;
//         break;
//         case 'ligne':
//           ligneFilter = filter.data;
//         break;
//       }
//     });

//     if(typeFilter.length > 0) this.filterByType(typeFilter);
//     if(testFilter.length > 0) this.filterByTesting(testFilter);
//     if(openFilter.length > 0) this.filterByOpening(openFilter).subscribe(() => {
//       getOpen.next(true);
//     });
//     if(ligneFilter.length > 0) this.filterByLigne(ligneFilter).subscribe(() => {
//       setCardParams.next(true);
//     });

//     setCardParams.subscribe((res: boolean) => {
//       this.setCardParams(this.filteredRestaurants);
//     });
//   }
//   filterByType(data: SelectData[]){
//     if(data.length > 0){
//       this.filteredRestaurants = this.filteredRestaurants.filter((restaurant: Restaurant) => {
//         let toSuppress: boolean = true;
//         data.forEach((element: SelectData) => {
//           if(restaurant.type === element.name)  toSuppress = false;
//         });
//         return !toSuppress;
//       });
//     }
    
//   }
//   filterByLigne(data: SelectData[]): Observable<boolean>{
//     let toReturn: Subject<boolean> = new Subject();
//     let indexToSuppress: number[] = [];
//     let setFilter: Subject<boolean> = new Subject();
//     let counter: number = 0;
//     this.filteredRestaurants.forEach((restaurant: Restaurant,index: number) => {
//     });

//     setFilter.subscribe(() => {
//       indexToSuppress.sort((a,b) => {
//         if(a>b) return 1;
//         return -1;
//       });
//       indexToSuppress.forEach((index: number,i: number) => {
//         this.filteredRestaurants.splice(index-i,1);
//       });
//       toReturn.next(true);
//     });

//     return toReturn.asObservable();
//   }
//   filterByOpening(data: SelectData[]): Observable<boolean>{
//     let toReturn: Subject<boolean> = new Subject();
//     let indexToSuppress: number[] = [];
//     let setFilter: Subject<boolean> = new Subject();
//     let counter: number = 0;
//     this.filteredRestaurants.forEach((restaurant: Restaurant,index: number) => {
//       this.data.getHorairesOfPlace(restaurant.id).subscribe((horaires: Horaires[]) => {
//         const isOpened: boolean = this.placeService.isOpened(horaires);
//         let toKeep: boolean = false;
//         data.forEach((element: SelectData) => {
//           let open: boolean = true;
//           if(element.name === "Non")  open = false;
//           if(isOpened === open)  toKeep = true;
//         });
//         counter++;
//         if(!toKeep) indexToSuppress.push(index);
//         if(counter === this.filteredRestaurants.length) setFilter.next(true);
//       });
//     });

//     setFilter.subscribe(() => {
//       indexToSuppress.sort((a,b) => {
//         if(a>b) return 1;
//         return -1;
//       });
//       indexToSuppress.forEach((index: number,i: number) => {
//         this.filteredRestaurants.splice(index-i,1);
//       });
//       toReturn.next(true);
//     });

//     return toReturn.asObservable();
//   }
//   filterByTesting(data: SelectData[]){
//     this.filteredRestaurants = this.filteredRestaurants.filter((restaurant: Restaurant) => {
//       let toSuppress: boolean = true;
//       data.forEach((element: SelectData) => {
//         let test: boolean = true;
//         if(element.name === "Non")  test = false;
//         if(restaurant.tested === test)  toSuppress = false;
//       });
//       return !toSuppress;
//     });
//   }
//   sortByOrder(){
//     this.orderAlphabetical = true;
//     this.orderNote = false
//     this.cardParams.sort(this.compareOrder);
//   }
//   sortByNote(){
//     this.orderAlphabetical = false;
//     this.orderNote = true
//     this.cardParams.sort(this.compareNote);
//   }
//   compareNote(a: CardParams,b: CardParams){
//     let comparison = 0;
//     if(a.data.qualite_prix > b.data.qualite_prix) comparison = -1;
//     else  comparison = 1;

//     return comparison;
//   }
//   compareOrder(a: CardParams,b: CardParams){
//     let comparison = 0;
//     if(a.data.name.toUpperCase() > b.data.name.toUpperCase()) comparison = 1;
//     else  comparison = -1;

//     return comparison;
//   }

//   toggleSidebar(){
//     this.openSidebar = !this.openSidebar;
//   }

//   setCardParams(data: any[]){
//     if(data.length === 0)  this.nothing = true;
//     else{
//       this.nothing = false;
//       let counter: number = 0;
//       this.cardParams = [];
//       let triggerSort: Subject<boolean> = new Subject();
//       data.forEach((place: Restaurant,index: number) => {
//         let params: CardParams = {
//           pictures: [],
//           circleNoteParams: this.circleNoteParams,
//           addressesSelect: [],
//           horaires: [],
//           data: place
//         }
//       });

//       triggerSort.subscribe(() => {
//         const noteSorter: string = sessionStorage.getItem("orderNote");
//         const alphabeticalSorter: string = sessionStorage.getItem("orderAlphabetical");  
//         if(noteSorter != null){
//           const filterValues = JSON.parse(noteSorter);
//           if(filterValues)  this.cardParams.sort(this.compareNote);
//         }
//         if(alphabeticalSorter != null){
//           const filterValues = JSON.parse(alphabeticalSorter);
//           if(filterValues)  this.cardParams.sort(this.compareOrder);
//         }
//         this.nothing = false;
//         this.getData = true;
//       });
//     }
    
    
//   }

//   scroll(){
//     if(!this.initFilters){
//       const scroll: number = JSON.parse(sessionStorage.getItem("scrollPosition"));
//       this.initFilters = true;
//       setTimeout(() => {
//         window.scrollBy({
//           left: 0,
//           top: scroll,
//           behavior: 'smooth'
//         });
//       },0);
//     }
//   }

//   ngOnDestroy(): void {
//     this.filterSubscriber.unsubscribe();
//     this.themeSubscriber.unsubscribe();
//     if(this.clearSessionStorageData){
//       sessionStorage.clear();
//     }
//   }

// }

// interface FilterInfo{
//   name: string,
//   data: SelectData[]
// }
