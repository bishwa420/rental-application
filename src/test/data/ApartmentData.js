export const data = {
    apartments: [],
    loading: true,
    filter: {
        filterMinArea: 0,
        filterMaxArea: 10000000,
        filterMinPrice: 100,
        filterMaxPrice: 2000,
        filterMinRooms: 0,
        filterMaxRooms: 10000000,
        pageSize: 10,
        requestingPage: 1
    },
    pages: 0,
    loadedApartmentInfo: {
        name: 'Apartment',
        latitude: '24',
        longitude: '90'
    },
    showLocationModal: false
}

export const apartments = {
    apartmentList: [
        {
            apartmentId: 1,
            name: "Galaxy Apartments",
            description: "description",
            longitude: "25.098764",
            latitude: "90.121232",
            floorArea: 2000,
            price: 1500,
            roomCount: 5
        },
        {
            apartmentId: 2,
            name: "Micky Mouse Apartments",
            description: "description",
            longitude: "25.098764",
            latitude: "90.121232",
            floorArea: 3000,
            price: 1000,
            roomCount: 2
        },
        {
            apartmentId: 3,
            name: "Tom & Jerry Apartments",
            description: "description",
            longitude: "25.098764",
            latitude: "90.121232",
            floorArea: 3000,
            price: 500,
            roomCount: 10
        }
    ],
    page: {
        firstPage: true,
        lastPage: true,
        number: 1,
        totalPages: 1,
        size: 10,
        totalItems: 3
    }
}