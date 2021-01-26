import React, {Component} from "react"

import spinner from '../image/ajax-loader.gif'
import {Redirect} from "react-router-dom";

class Logout extends Component {

    constructor(props) {
        super(props)
        this.state = {
            redirectTo: false
        }

    }

    updateLocalState(response) {

        localStorage.removeItem('token')

        this.setState({
            redirectTo: '/login'
        })
    }

    componentDidMount() {

        this.updateLocalState()
    }

    render() {

        if(this.state.redirectTo) {
            return <Redirect to = {this.state.redirectTo} />
        }

        return (
            <div className="row">

                <div className="col-md-4 offset-md-4 text-center">
                    <img
                        src={spinner}
                        style={{
                            width: 20,
                            height: 20,
                            marginTop: 150
                        }} alt="Loader"
                    />
                </div>
            </div>
        )
    }
}

export default Logout

