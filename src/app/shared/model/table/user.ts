import { IconDefinition } from "@fortawesome/free-solid-svg-icons"

export interface User{
    id: string,
    login: string,
    password: string,
    role: string,
    img: string
}
export interface Follow{
    id_asked: string,
    id_user: string, 
    accepted?: boolean
}
export interface PlaceOfUser{
    idUser: string,
    idPlace: string
}

export interface Statistics{
    place: number,
    tested: number,
    typeStatsTested: Counter[],
    typeStats: Counter[],
    categoriesStats: CategoryStat[],
    nbFollowed: number,
    nbFollowers: number,
    favType?: Counter,
}

export interface CategoryStat{
    category: string,
    open?: number,
    count: number,
    tested: number
}

export interface Counter{
    value: string,
    counter: number,
    percent?: number,
    percentTested?: number,
    legend?: string,
    legendWidth?: number,
    category?: string,
    animationFinished?: boolean,
    icon?: IconDefinition,
    tested?: number
}