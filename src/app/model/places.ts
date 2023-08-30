export interface Place{
    id: string,
    name: string,
    tested: boolean,
    category: string,
    address: string,
    type?: string,
    lat?: number,
    lng?: number,
    website?: string,
    google_note?: number,
    total_google_note?: number,
    visible?: boolean,
    isOpen?: boolean
}

export interface Restaurant extends Place {
    link_menu?: string,
    vegetarian?: boolean,
    delivery?: boolean
}