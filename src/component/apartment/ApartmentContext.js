import {createContext} from "react"

export const apartmentInfo = {
    name: 'Apartment',
    latitude: '24',
    longitude: '90'
}

export const ApartmentContext = createContext(apartmentInfo)