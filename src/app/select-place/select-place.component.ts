import { Component, EventEmitter, Output } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { IconDefinition, faXmark } from '@fortawesome/free-solid-svg-icons';
import { crossButtonSelectPlaceComponent, validButtonSelectPlaceComponent } from '../shared/model/design/buttonsDesign';
import { AutocompleteInfos, ButtonInfos, InputInfos, SelectData } from '../shared/model/designs';
import { autocompleteInfosSelectPlace, searchInputSelectPlace } from '../shared/model/design/inputsDesign';
import { Place } from '../shared/model/table/places';
import { PlaceOfUser } from '../shared/model/table/user';
import { Message } from '../shared/model/params/message';

@Component({
  selector: 'select-place',
  templateUrl: './select-place.component.html',
  styleUrls: ['./select-place.component.scss']
})
export class SelectPlaceComponent {

  constructor(private databaseService: DatabaseService){}
//////////////////////////////////////////////  Variables  //////////////////////////////////////////////
/*  Metadata   */
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
/*  Style Infos  */
  protected validButtonInfos: ButtonInfos = validButtonSelectPlaceComponent;
  protected crossButtonInfos: ButtonInfos = crossButtonSelectPlaceComponent;
  protected searchInputInfos: InputInfos = searchInputSelectPlace;
  protected autocompleteInfos: AutocompleteInfos = autocompleteInfosSelectPlace;
/*  Icon  */
  protected crossIcon: IconDefinition = faXmark;
/*  Select  */
  protected autocompletePlaces: SelectData[] = [];
/*  Algo  */
  protected placeSearch: string = "";
  protected selectedPlace: string = "";

  ngOnInit(): void{
    this.databaseService.getAllVisiblePlacesOfUser(localStorage.getItem("id")).subscribe((visiblePlaces: Place[]) => {
      visiblePlaces.forEach((place: Place) => {
        this.autocompletePlaces.push({
          id: place.id,
          name: place.name,
          originalData: place
        })
      });
    });
  }

  setValue(event: any){
    this.placeSearch = event.target.value
  }
  add(event: string){
    this.selectedPlace = event;
  }
  onClose(trigger: boolean){
    if(trigger){
      const newPlaceOfUser: PlaceOfUser = {
        idPlace: this.selectedPlace,
        idUser: localStorage.getItem("id")
      }
      this.databaseService.addPlaceOfUser(newPlaceOfUser).subscribe((res: Message) => {
        this.close.next(true);
      });
    }  else{
      this.close.next(true);
    }
    
  }
}
