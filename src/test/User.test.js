import {mount} from "enzyme"
import * as axios from "axios"
import {act} from "@testing-library/react"
import User from "../component/user/User"
import {users} from "./data/UserData"

jest.mock("axios")

describe("User tests", () =>{

    it("User loads with correct state according to response from server", async () => {

        axios.get.mockImplementation(() => Promise.resolve({status: 200, data: users}))

        let wrapper = mount(<User/>)

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        })

        wrapper.update()

        expect(wrapper.instance().state.users).toEqual(users.userList)
        expect(wrapper.instance().state.filter.requestingPage).toEqual(1)
        expect(wrapper.instance().state.pages).toEqual(1)
        expect(wrapper.instance().state.loading).toEqual(false)
    })
})