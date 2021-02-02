import React, {Component} from "react"
import logo from "../../image/avatar.png"
import {GoogleLogin} from "react-google-login"
import FacebookLogin from "react-facebook-login"
import {NotificationContainer} from "react-notifications"
import Http from "../../service/Http"
import {Redirect} from "react-router-dom"
import {notifySuccess, notifyFailure, notifyInfo} from "../../service/Util"

class Signup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            name: '',
            role: 'CLIENT',
            error: {
                name: '',
                email: '',
                password: '',
                role: ''
            },
            redirectTo: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleValidation = this.handleValidation.bind(this)
        this.isFormValid = this.isFormValid.bind(this)
        this.onSuccessfulSignup = this.onSuccessfulSignup.bind(this)
        this.onSuccessGoogleResponse = this.onSuccessGoogleResponse.bind(this)
        this.onFailureGoogleResponse = this.onFailureGoogleResponse.bind(this)
        this.facebookCallbackResponse = this.facebookCallbackResponse.bind(this)
        this.submit = this.submit.bind(this)
    }

    onSuccessGoogleResponse(response) {

        let reqBody = {
            role : this.state.role,
            token: response.tokenId
        }

        this.submit('signup_google', reqBody)
    }

    onFailureGoogleResponse(response) {

        notifyFailure('Google signup failed')
    }

    submit(uri, reqBody) {

        Http.POST(uri, reqBody)
            .then((response) => {

                notifyInfo('Please follow the link on your email')
                setTimeout(this.onSuccessfulSignup, 3000)
            })
            .catch(error => {

                if(error.response && error.response.data) {
                    notifyFailure(error.response.data.message)
                } else {
                    notifyFailure('Could not connect to server')
                }
            })
    }

    facebookCallbackResponse(response) {

        let reqBody = {
            role : this.state.role,
            token: response.accessToken
        }
        this.submit('signup_facebook', reqBody)
    }

    handleChange(event) {

        const {target} = event
        const value = target.type === 'checkbox' ? target.checked : target.value
        const {name} = target

        this.setState({
            [name]: value
        })
    }

    isFormValid() {

        const {email, password, name, role} = this.state
        return !(email && password && name && role)
    }

    onSuccessfulSignup() {

        this.setState({
            redirectTo: 'login'
        })
    }

    handleSubmit(event) {

        event.preventDefault()

        let reqBody = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            role: this.state.role
        }

        Http.POST('signup', reqBody)
            .then((response) => {

                notifyInfo('Please follow the link on your email')
                setTimeout(this.onSuccessfulSignup, 3000)
            })
            .catch(error => {

                if(error.response && error.response.data) {
                    notifyFailure(error.response.data.message)
                } else {
                    notifyFailure('Could not connect to server')
                }
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

    render() {

        if(this.state.redirectTo) {
            return <Redirect to = {this.state.redirectTo} />
        }

        return (
            <div className="row">

                <div className="col-md-4 offset-md-4">
                    <div className="wrapper-box-signup">

                        <form className="form-signin" onSubmit={this.handleSubmit}>
                            <h2 className="form-signin-heading">Apartment Rental App</h2>

                            <img src={logo} alt="profile-img"
                                 className="profile-img-card"/>

                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="form-control"
                                value={this.state.name}
                                onChange={this.handleChange}
                                onBlur = {this.handleValidation}
                                aria-describedby="helpName"
                                style={ this.state.error.name ? {marginBottom: '2px'} : {}}
                            />

                            {
                                this.state.error.name ? <span id="helpName"
                                                               className="help-block text-danger">
                                    <small>Name is required</small>
                                </span> : null
                            }

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

                            <select className="form-control" name="role" onChange={this.handleChange}>
                                <option value={this.state.role} selected={this.state.role === 'REALTOR'}>REALTOR</option>
                                <option value={this.state.role} selected={this.state.role === 'CLIENT'}>CLIENT</option>
                            </select>

                            <button className="btn btn-lg btn-success btn-block"
                                    type="submit"
                                    disabled={this.isFormValid()}>
                                SIGNUP
                            </button>

                            <div className="row">

                                <div className="col-md-6" style={{paddingLeft: 0}}>
                                    <GoogleLogin
                                        clientId={"758898908443-kvlhgb8bpbtfs0jam1kq6i9m4bc1vst5.apps.googleusercontent.com"}
                                        onSuccess={this.onSuccessGoogleResponse}
                                        onFailure={this.onFailureGoogleResponse}
                                        buttonText={"Login with Google"}
                                        cookiePolicy={"single_host_origin"}
                                        render={props => (
                                            <button className="btn btn-md btn-danger"
                                                    onClick={props.onClick}
                                                    style={{marginTop: '1em', width: '100%', fontWeight: 'bold'}}>
                                                <i className="fa fa-google"></i> SIGNUP
                                            </button>
                                        )}
                                    />
                                </div>

                                <div className="col-md-6" style={{paddingLeft: 0, paddingRight: 0}}>
                                    <FacebookLogin
                                        appId="1530092413856847"
                                        clientToken={"28ea6d92b96d8459717aced13cddc0cd"}
                                        autoLoad={false}
                                        fields="name,email"
                                        callback={this.facebookCallbackResponse}
                                        icon={<i className="fa fa-facebook-square"></i>}
                                        textButton="SIGNUP"/>
                                </div>
                            </div>
                            <span className="signup-invitation">
                                Already have an account? <a href="/login" style={{color: '#4d4fd2'}}>Login</a>
                            </span>

                        </form>
                    </div>
                </div>

                <NotificationContainer/>
            </div>
        )
    }
}

export default Signup