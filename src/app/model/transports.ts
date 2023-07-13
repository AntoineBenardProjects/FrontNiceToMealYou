export interface Station{
    reg: string,
    lignes: string[],
    name: string,
    transport: string,
    idPlace: string
}

export interface Coords{
    lat: number,
    lng: number
}