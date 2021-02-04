import {mount} from "enzyme"
import Login from "../component/authentication/Login"

describe("Login tests", () => {

    it("Email & password changes according to user inputs", () => {

        const wrapper = mount(<Login />)

        let email = wrapper.find('#email')
        email.simulate('change', {target : {name: 'email', value: 'test-email@email.com'}})

        let password = wrapper.find('#password')
        password.simulate('change', {target : {name: 'password', value: 'password'}})


        expect(wrapper.instance().state.email).toEqual("test-email@email.com")
        expect(wrapper.instance().state.password).toEqual("password")
    });

    it("Login form's email given, but password not given, form is not submittable", () => {

        const handleSubmit = jest.fn()
        const spyOnHandleSubmit = jest.spyOn(Login.prototype, 'handleSubmit')

        const wrapper = mount(<Login handleSubmit={handleSubmit}/>)

        let email = wrapper.find('#email')
        email.simulate('change', {target : {value: 'abcd@abcd.com'}})

        const submitButton = wrapper.find("#loginButton")

        submitButton.simulate('click')
        expect(spyOnHandleSubmit).toHaveBeenCalledTimes(0)
    });

    it("When email & password fields are complete, login form is submittable", () => {

        const handleSubmit = jest.fn()
        const spyHandleSubmit = jest.spyOn(Login.prototype, 'handleSubmit')
        const wrapper = mount(<Login handleSubmit = {handleSubmit} />)

        let email = wrapper.find('#email')
        email.simulate('change', {target : {name: 'email', value: 'test-email@email.com'}})

        let password = wrapper.find('#password')
        password.simulate('change', {target : {name: 'password', value: 'password'}})



        let submitButton = wrapper.find("#loginButton")
        submitButton.simulate('click')


        expect(spyHandleSubmit).toHaveBeenCalledTimes(1)
    })

})
