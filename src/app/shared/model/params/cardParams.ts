import { Comment } from "../table/comment";
import { Horaires } from "../table/horaires";
import { Pictures } from "../table/pictures";
import { Place } from "../table/places";
import { Station } from "../table/transports";
import { Type } from "../table/type";
import { User } from "../table/user";

export interface PlaceCardParams{
    place: Place,
    horaires: Horaires[],
    stations: Station[],
    types: Type[],
    comments: Comment[],
    pictures: Pictures[],
    users: User[],
    startAnimation?: boolean,
    user?: boolean
}

export interface StationCardParams{
    station: Station,
    width: number,
    height: number
}

export interface TypeCardParams{
    type: Type,
    width: number,
    height: number
}

export interface UserCardParams{
    id: string,
    width: number,
    height: number,
    small?: boolean,
    accessToCard: boolean
}