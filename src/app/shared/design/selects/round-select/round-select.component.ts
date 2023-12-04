import { Component, HostBinding, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
import { SelectData, SelectInfos } from 'src/app/shared/model/designs';

@Component({
  selector: 'round-select',
  templateUrl: './round-select.component.html',
  styleUrls: ['./round-select.component.scss']
})
export class RoundSelectComponent {

  @Input() infos: SelectInfos;
  @Input() text: string = "";
  @Input() data: SelectData[] = [];
  @Input() numberData: boolean = false;
  @Input() multiselect: boolean = true;
  @Input() selectAll: boolean = true;
  @Input() addressSort: boolean = false;
  @Input() errorMessage: string = '';

  @Output() selectionChange: EventEmitter<SelectData[]> = new EventEmitter();
  private allOptionAdded: boolean = false;

  protected optionColor: string = "var(--mainColor)";
  protected optionBackgroundColor: string = "var(--var)";
  protected isOpened: boolean = false;
  protected optionsSize: string = '';
  protected selectSize: Size = {
    height: 7,
    width: 15,
    font: 16
  }
  protected dataTable: SelectData[] = [];
  constructor(
    private placesService: PlacesService){}

  @HostBinding('style.--backgroundColor') backgroundColor: string = '';
  @HostBinding('style.--color') textColor: string = '';
  @HostBinding('style.--hoverBackgroundColor') hoverBackgroundColor: string = '';
  @HostBinding('style.--hoverTextColor') hoverTextColor: string = '';
  @HostBinding('style.--borderColor') borderColor: string = '';
  @HostBinding('style.--borderColorActive') borderColorActive: string = '';
  @HostBinding('style.--topHoverBackgroundColor') topHoverBackgroundColor: string = '';
  @HostBinding('style.--topHoverTextColor') topHoverTextColor: string = '';
  @HostBinding('style.--topHoverBorderColor') topHoverBorderColor: string = '';

  protected idDropdown: string = "";
  protected idOptions: string = "";
  private alreadySelected: boolean = false;
  protected errorAnimation: boolean = false;
  protected toShow: string = "";


  setId(){
    let id: string ="";
    for(let i = 0; i < 15; i++){
      id += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return id;
  }

  ngOnInit(){
    this.idDropdown = this.setId();
    this.idOptions = this.setId();

    this.backgroundColor = this.infos.backgroundColor;
    this.textColor = this.infos.textColor;
    this.hoverBackgroundColor = this.infos.hoverBackgroundColor;
    this.hoverTextColor = this.infos.hoverTextColor;
    if(this.infos.width != null)  this.selectSize.width = this.infos.width;
    if(this.infos.height != null)  this.selectSize.height = this.infos.height;
    if(this.infos.fontSize != null) this.selectSize.font = this.infos.fontSize;
    if(this.infos.optionTextColor != null) this.optionColor = this.infos.optionTextColor;
    if(this.infos.optionBackgroundColor != null) this.optionBackgroundColor = this.infos.optionBackgroundColor;
    if(this.infos.borderColor != null) this.borderColor = this.infos.borderColor;
    if(this.infos.borderColorActive != null) this.borderColorActive = this.infos.borderColorActive;
    if(this.infos.topHoverBackgroundColor != null) this.topHoverBackgroundColor = this.infos.topHoverBackgroundColor;
    if(this.infos.topHoverBorderColor != null) this.topHoverBorderColor = this.infos.topHoverBorderColor;
    if(this.infos.topHoverColor != null) this.topHoverTextColor = this.infos.topHoverColor;
    this.data.forEach((element: SelectData) => {
      if(!element.selected)  element.selected = false;
    });
    this.dataTable = this.data.slice();
    this.setSize();
    this.selectFromData();
  }

  ngOnChanges(changes: SimpleChanges) : void{
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'errorMessage': {
            setTimeout(() => {
              changes[propName].currentValue !== '' ? this.errorAnimation = true : this.errorAnimation = false;
            },400);
          }
          break;
          case 'data':{
            if(changes[propName].currentValue !== changes[propName].previousValue){
              this.dataTable = this.data.slice();
              this.sort();
              this.setSize();
              if(!this.alreadySelected){
                this.selectFromData();
              }
            }
          }
          break;
          case 'infos':{
            if(changes[propName].currentValue !== changes[propName].previousValue){
              this.allOptionAdded = false;
              this.backgroundColor = this.infos.backgroundColor;
              this.textColor = this.infos.textColor;
              this.hoverBackgroundColor = this.infos.hoverBackgroundColor;
              this.hoverTextColor = this.infos.hoverTextColor;
              if(this.infos.width != null)  this.selectSize.width = this.infos.width;
              if(this.infos.height != null)  this.selectSize.height = this.infos.height;
              if(this.infos.fontSize != null) this.selectSize.font = this.infos.fontSize;
              if(this.infos.optionTextColor != null) this.optionColor = this.infos.optionTextColor;
              if(this.infos.optionBackgroundColor != null) this.optionBackgroundColor = this.infos.optionBackgroundColor;
              if(this.infos.borderColor != null) this.borderColor = this.infos.borderColor;
              if(this.infos.borderColorActive != null) this.borderColorActive = this.infos.borderColorActive;
              if(this.infos.topHoverBackgroundColor != null) this.topHoverBackgroundColor = this.infos.topHoverBackgroundColor;
              if(this.infos.topHoverBorderColor != null) this.topHoverBorderColor = this.infos.topHoverBorderColor;
              if(this.infos.topHoverColor != null) this.topHoverTextColor = this.infos.topHoverColor;
            }
          }
          break;
        }
      }
    }
  }

  protected alreadyClose: boolean = false;

  ngAfterViewInit(){
    window.addEventListener("mouseup", (event) => {
      const dropdownElement: HTMLElement = document.getElementById(this.idDropdown);
      const optionsElement: HTMLElement = document.getElementById(this.idOptions);
      if(dropdownElement != null && optionsElement != null){
        const verifyDropdown: boolean = event.pageY > dropdownElement.offsetTop && event.pageY < dropdownElement.offsetTop + dropdownElement.clientHeight && event.pageX > dropdownElement.offsetLeft && event.pageX < dropdownElement.offsetLeft + dropdownElement.clientWidth
        const verifyOptions: boolean = event.pageY > dropdownElement.offsetTop + optionsElement.offsetTop && event.pageY < dropdownElement.offsetTop + optionsElement.offsetTop + optionsElement.clientHeight && event.pageX > dropdownElement.offsetLeft + optionsElement.offsetLeft && event.pageX < dropdownElement.offsetLeft + optionsElement.offsetLeft + optionsElement.clientWidth

        if((!verifyDropdown && !verifyOptions) && this.isOpened){
          this.isOpened = false;
          this.alreadyClose = true;
          dropdownElement.dataset['open'] = this.isOpened.toString();
        }
      }
    });
  }

  setSize(){
    let sizeDiv: number = this.dataTable.length * this.selectSize.height;
    this.optionsSize = sizeDiv.toString() + "vh";
    this.sort();
  }

  sort(){
    if(this.selectAll && !this.allOptionAdded){
      this.dataTable.push({
        id: "All",
        name: "All",
        selected: false
      });
      this.allOptionAdded = true;
    }

    if(this.numberData){
      this.dataTable.sort((a: SelectData,b: SelectData) => {
        if(a.name === "All")  return -1;
        if(b.name === "All")  return -1;

        let numberA: number = Number(a.name);
        let numberB: number = Number(b.name);
        if(Number.isNaN(Number(a.name))){
          numberA = Number(a.name.substring(0, a.name.length-3));
        }
        if(Number.isNaN(Number(b.name))){
          numberB = Number(b.name.substring(0, b.name.length-3));
        }

        if(Number.isNaN(numberA) || Number.isNaN(numberB) || numberA === 0 || numberB === 0){
          if(a.name > b.name) return 1;
          return -1;
        }

        if(numberA > numberB) return 1;
        return -1;
      });
    } else if(this.addressSort){
      this.dataTable.sort((a: SelectData,b: SelectData) => {
        if(a.name === "All")  return -1;
        if(b.name === "All")  return -1;
        const codePostalA: string = a.name.substring(a.name.length -5,a.name.length);
        const codePostalB: string = b.name.substring(b.name.length -5,b.name.length);

        if(codePostalA > codePostalB) return 1;
        return -1;
      });
    }
    else{
      this.dataTable.sort((a: SelectData,b: SelectData) => {
        if(a.name === "All")  return -1;
        if(b.name === "All")  return -1;

        if(a.name > b.name) return 1;
        return -1;
      });
    }

    this.dataTable = this.placesService.removeDuplicate(this.dataTable);
  }

  selectFromData(){
    this.dataTable.forEach((element: SelectData) => {
      const find: SelectData = this.data.find((res: SelectData) => res.id === element.id);
      if(find != null)  element.selected = find.selected;
    });
    this.alreadySelected = false;
  }

  select(id: string){
    if(this.multiselect){
      const find: SelectData = this.dataTable.find((element: SelectData) => element.id === id);
      find.selected = !find.selected;
      if(find.id === "All"){
        this.dataTable.forEach((element: SelectData) => {
          element.selected = find.selected;
        });
      }
    } else{
      this.dataTable.forEach((value: SelectData) => {
        if(value.id === id){
          value.selected = !value.selected;
        }
        else  value.selected = false;
      });
    }
  }

  sendData(id: string){
    this.alreadySelected = true;
    this.select(id);
    const filterData: SelectData[] = this.dataTable.filter((element: SelectData) => {
      if(element.id !== "All"){
        return true;
      }
      return false;
    }).slice();
    const selected: SelectData[] = this.dataTable.filter((element: SelectData) => element.selected === true);
    if(selected.length > 0){
      this.toShow = selected[0].name;
      if(selected.length > 1) this.toShow += "...";
    }
    else  this.toShow = "";
    this.selectionChange.emit(filterData);
  }

  click(){
    if(!this.alreadyClose) this.isOpened = !this.isOpened;
    else  this.alreadyClose = false;
    const dropdownElement: HTMLElement = document.getElementById(this.idDropdown);
    dropdownElement.dataset['open'] = this.isOpened.toString();
  }

}

interface Size{
  height: number,
  width: number,
  font: number
}