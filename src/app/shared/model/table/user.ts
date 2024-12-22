import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { ERoleUser } from "../enums/Erole";

export class User{
    couv: string = "";
    id: string = "";
    img: string = "";
    login: string = "User 1";
    password: string = "";
    role: ERoleUser = ERoleUser.user;

    constructor(login?: string, password?: string,id?: string,img?: string,couv?: string){
        if(couv) this.couv = couv;
        if(id) this.id = id;
        if(img) this.img = img;
        if(login) this.login = login;
        if(password) this.password = password;
    }
}
export interface Follow{
    accepted?: boolean;
    id_asked: string;
    id_user: string; 
}
export interface PlaceOfUser{
    idPlace: string;
    idUser: string;
}

export interface Statistics{
    categoriesStats: CategoryStat[];
    favType?: Counter;
    nbFollowed: number;
    nbFollowers: number;
    place: number;
    tested: number;
    typeStats: Counter[];
    typeStatsTested: Counter[];
}

export interface CategoryStat{
    background?: string;
    category: string;
    count: number;
    height?: number;
    icon: IconDefinition;
    opacity?: number;
    open?: number;
    tested: number
}

export interface Counter{
    animationFinished?: boolean;
    category?: string;
    counter: number;
    icon?: IconDefinition;
    legend?: string;
    legendWidth?: number;
    percent?: number;
    percentTested?: number;
    tested?: number
    value: string;
}