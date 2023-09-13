export interface Station{
    reg: string,
    lignes: string[],
    name: string,
    transport: string,
    id: string
}

export interface Coords{
    lat: number,
    lng: number
}