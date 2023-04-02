import { Bar } from "./bar";

export interface Restaurant extends Bar {
    the_fork: string,
    note_quantity: number
}