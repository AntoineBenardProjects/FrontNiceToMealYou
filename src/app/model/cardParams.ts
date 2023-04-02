import { Address } from "./address";
import { Bar } from "./bar";
import { CircleNoteParams } from "./circle-notes-params";
import { Horaires } from "./horaires";
import { LigneInStation } from "./ligneInStation";
import { Pictures } from "./pictures";
import { Restaurant } from "./restaurant";
import { StationInPlace } from "./stationInPlace";

export interface CardParams{
    pictures :Pictures[],
    circleNoteParams: CircleNoteParams,
    stationsInPlace: StationInPlace[],
    lignesInStation: LigneInStation[],
    addresses: Address[],
    horaires: Horaires[],
    data: Bar
}