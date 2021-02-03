import {mount} from "enzyme"
import ApartmentUI from "../component/apartment/ApartmentUI";

const data = {
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

const filterApartments = () => {

}

describe("Apartment tests", () => {
    it("Accepts apartment props", () => {
        const wrapper = mount(<ApartmentUI data = {data} filterApartments = {filterApartments}/>)
        expect(wrapper.props().data).toEqual(data)
    });
})