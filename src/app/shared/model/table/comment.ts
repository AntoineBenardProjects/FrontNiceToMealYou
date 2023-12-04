export interface Comment extends Rating{
    comment?: string
    id_place: string,
    id_user: string,
    tested: boolean
}

export interface Rating{
    quantity?: number,
    quality_price?: number,
    service?: number,
    price?: number,
    service_range?: number[],
    quality_price_range?: number[],
    quantity_range?: number[],
    price_range?: number[],
}