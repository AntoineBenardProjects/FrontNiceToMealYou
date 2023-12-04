import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export interface Type{
    id?: string,
    name: string,
    picture: string,
    category: string,
    color: string,
    icon: string,
    faIcon?: IconDefinition
}

export interface TypeOfPlace{
    id_type: string,
    id_place: string
}

export interface TypeStatistics{
    open: number,
    total: number
}