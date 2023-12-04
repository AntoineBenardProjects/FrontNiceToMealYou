import { ButtonInfos } from "../designs"
import { CategoryStat, Counter } from "./user"

export interface Station{
    reg?: string,
    lignes?: Ligne[],
    name: string,
    lat?: number,
    lng?: number,
    transport?: string,
    id: string
}

export interface Ligne{
    reg?: string,
    name: string,
    transport?: string,
    picture?: string,
    id: string,
    color?: string,
    buttonInfos?: ButtonInfos,
}

export interface StationOfPlace{
    id_user: string,
    id_station: string
}

export interface Coords{
    lat: number,
    lng: number
}

export interface StationStats{
    categoriesStats: CategoryStat[],
    favType?: Counter[],
}