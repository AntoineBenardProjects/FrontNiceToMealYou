import { SelectData } from "../shared/model/designs";
import { CircleNoteParams } from "./circle-notes-params";
import { Horaires } from "./horaires";
import { Pictures } from "./pictures";
import { Restaurant } from "./places";

export interface CardParams{
    pictures :Pictures[],
    circleNoteParams?: CircleNoteParams,
    horaires: Horaires[],
    addressesSelect?: SelectData[]
    data?: Restaurant
}