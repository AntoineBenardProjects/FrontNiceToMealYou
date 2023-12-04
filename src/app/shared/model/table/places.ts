export interface Place{
    id: string,
    name: string,
    category: string,
    address: string,
    lat: number,
    lng: number,
    website: string,
    visible: boolean,
    isOpen?: boolean,
    id_creator: string,
    id_city: string,
    creation: string,
    phone?: string,
    promotion: string
    postal: string,
    link_menu?: string,
    prix_pinte?: number,
    prix_cocktail?: number,
    prix_coffee?: number,
}
export interface City{
    id: string,
    name: string,
    department: string,
    reg: string,
    land: string
}