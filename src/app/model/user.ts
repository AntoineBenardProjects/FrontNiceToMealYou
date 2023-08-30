export interface User{
    id: string,
    login: string,
    password: string,
    role: string,
    img: string
}

export interface PlaceOfUser{
    idUser: string,
    idPlace: string
}