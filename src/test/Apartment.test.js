import {mount} from "enzyme"
import ApartmentUI from "../component/apartment/ApartmentUI"
import Apartment from "../component/apartment/Apartment"
import {data, apartments} from "./data/ApartmentData"
import * as axios from "axios"
import {act} from "@testing-library/react"

jest.mock("axios")

describe("Apartment tests", () => {
    it("Accepts apartment props correctly receives props", () => {
        const filterApartments = () => {

        }

        const wrapper = mount(<ApartmentUI data = {data} filterApartments = {filterApartments}/>)
        expect(wrapper.props().data).toEqual(data)
    });

    it("Apartment loads with correct state according to response from server", async () => {

        axios.get.mockImplementation(() => Promise.resolve({status: 200, data: apartments}))

        let wrapper = mount(<Apartment/>)

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        })

        wrapper.update()

        expect(wrapper.instance().state.apartments).toEqual(apartments.apartmentList)
        expect(wrapper.instance().state.filter.requestingPage).toEqual(1)
        expect(wrapper.instance().state.pages).toEqual(1)
        expect(wrapper.instance().state.loading).toEqual(false)
    });
})