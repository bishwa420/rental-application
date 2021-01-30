import React, {Component} from 'react'
import logo from '../../image/avatar.png'
import Http from '../../service/Http'
import {NotificationContainer, NotificationManager} from 'react-notifications'
import {Redirect} from "react-router-dom"
import {GoogleLogin} from "react-google-login"

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: {
                email: false,
                password: false
            },
            redirectTo: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleValidation = this.handleValidation.bind(this)
        this.isFormValid = this.isFormValid.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.onSuccessGoogleResponse = this.onSuccessGoogleResponse.bind(this)
        this.onFailureGoogleResponse = this.onFailureGoogleResponse.bind(this)
    }

    handleChange(event) {

        const {target} = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const {name} = target

        this.setState({
            [name]: value
        })
    }

    handleValidation(event) {

        const {name} = event.target
        const error = {
            [name]: !this.state[name]
        }

        this.setState(prev_state => ({
            error: {
                ...prev_state.error,
                ...error
            }
        }))
    }

    isFormValid() {

        const {email, password} = this.state
        return !(email && password)
    }

    handleSubmit(event) {

        event.preventDefault()

        const {email, password} = this.state

        let reqBody = {
            email: email,
            password: password
        }

        Http.POST('login', reqBody).then(({data}) => {
                NotificationManager.success('Login success!')
                localStorage.removeItem('token')
                localStorage.setItem('token', JSON.stringify(data.token))
                this.setState({
                    redirectTo: '/app/users'
                })
            }).catch((error) => {

                if(error && error.response) {
                    NotificationManager.error(error.response.data.message, '')
                } else {
                    NotificationManager.error('Could not connect to server')
                }
            })
    }

    onSuccessGoogleResponse(response) {
        console.log('response: ', response)

        let reqBody = {
            token: response.tokenId
        }

        Http.POST('login_google', reqBody)
            .then((response) => {
                localStorage.removeItem('token')
                localStorage.setItem('token', JSON.stringify(response.data.token))
                this.setState({
                    redirectTo: '/app/users'
                })
            })
            .catch(error => {

                if(error && error.response) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error('Could not connect to server')
                }
            })
    }

    onFailureGoogleResponse(response) {

        NotificationManager.error('Could not proceed with Google login')
    }

    render() {

        if(this.state.redirectTo) {
            return <Redirect to = {this.state.redirectTo} />
        }

        return (
            <div className="row">

                <div className="col-md-4 offset-md-4">
                    <div className="wrapper-box">

                        <form className="form-signin" onSubmit={this.handleSubmit}>
                            <h2 className="form-signin-heading">Apartment Rental App</h2>

                            <img src={logo} alt="profile-img"
                                className="profile-img-card"/>

                            <input
                                type="text"
                                name="email"
                                placeholder="Email address"
                                className="form-control"
                                value={this.state.email}
                                onChange={this.handleChange}
                                onBlur = {this.handleValidation}
                                aria-describedby="helpEmail"
                                style={ this.state.error.email ? {marginBottom: '2px'} : {}}
                            />

                            {
                                this.state.error.email ? <span id="helpEmail"
                                className="help-block text-danger">
                                    <small>Email address is required</small>
                                </span> : null
                            }

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="form-control"
                                value={this.state.password}
                                onChange={this.handleChange}
                                onBlur = {this.handleValidation}
                                aria-describedby="helpPassword"
                                style={ this.state.error.password ? {marginBottom: '2px'} : {}}
                            />

                            {
                                this.state.error.password ? <span id="helpPassword"
                                                               className="help-block text-danger">
                                    <small>Password is required</small>
                                </span> : null
                            }

                            <button className="btn btn-lg btn-success btn-block"
                                    type="submit"
                                    disabled={this.isFormValid()}>
                                Login
                            </button>
                            <GoogleLogin
                                clientId={"758898908443-kvlhgb8bpbtfs0jam1kq6i9m4bc1vst5.apps.googleusercontent.com"}
                                onSuccess={this.onSuccessGoogleResponse}
                                onFailure={this.onFailureGoogleResponse}
                                buttonText={"Login with Google"}
                                cookiePolicy={"single_host_origin"}
                                render={props => (
                                    <button className="btn btn-md btn-danger"
                                            onClick={props.onClick}
                                            style={{marginTop: '1em', width: '50%'}}>
                                        <i className="fa fa-google"></i> Login
                                    </button>
                                )}
                            />
                        </form>
                    </div>
                </div>

                <NotificationContainer/>
            </div>
        )
    }
}

export default Login