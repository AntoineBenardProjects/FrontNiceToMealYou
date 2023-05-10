import { Address } from "./address";
import { Bar } from "./bar";
import { CircleNoteParams } from "./circle-notes-params";
import { Horaires } from "./horaires";
import { Ligne } from "./ligne";
import { Pictures } from "./pictures";
import { Station } from "./station";

export interface CardParams{
    pictures :Pictures[],
    circleNoteParams: CircleNoteParams,
    stationsInPlace: Station[],
    lignesInStation: Ligne[],
    addresses: Address[],
    horaires: Horaires[],
    data: Bar
}