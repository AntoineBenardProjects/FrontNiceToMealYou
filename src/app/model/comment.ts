export interface Comment{
    comment?: string
    id_place: string,
    id_user: string
}

export interface RestaurantsGrades extends Comment{
    quantity?: number,
    quality_price?: number,
    service?: number
}