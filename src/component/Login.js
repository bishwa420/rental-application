import React, {Component} from 'react'
import logo from '../image/avatar.png'

class Login extends Component {

    render() {
        return (
            <div className="row">

                <div className="col-md-4 offset-md-4">
                    <div className="wrapper-box">

                        <form className="form-signin">
                            <h2 className="form-signin-heading">Apartment Rental App</h2>

                            <img src={logo} alt="profile-img"
                                className="profile-img-card"/>

                            <input
                                type="text"
                                placeholder="Email address"
                                className="form-control"
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                className="form-control"
                            />

                            <button className="btn btn-lg btn-success btn-block"
                                    type="submit">
                                Login
                            </button>
                        </form>
                    </div>
                </div>


            </div>
        )
    }
}

export default Login