import React, {Component} from 'react'
import {Link} from "react-router-dom"
import {getUserRole} from '../../service/Util'

class Sidebar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeTab: window.location.pathname,
            role: getUserRole()
        }
    }


    render() {

        if(this.state.activeTab !== window.location.pathname) {
            this.setState({
                activeTab: window.location.pathname
            })
        }

        return (
            <nav id="sidebar">

                <div className="sidebar-header pointer"
                    id="sidebarCollapse">

                    <div className="sidebar-title">Apartment Rental</div>
                </div>

                <ul className="list-unstyled components">

                    {this.state.role === 'ADMIN' ?

                    <li className={this.state.activeTab === '/app/users' ? 'active' : ''}>
                        <Link to="/app/users">
                            <i className="fa fa-user"/>
                            Users
                        </Link>
                    </li> : null}

                    <li className={this.state.activeTab === '/app/apartments' ? 'active' : ''}>
                        <Link to="/app/apartments">
                            <i className="fa fa-home"/>
                            Apartments
                        </Link>
                    </li>

                    <li>
                        <Link to="/app/logout">
                            <button className="btn btn-lg" style={{width: '100%'}}>
                                Logout
                            </button>
                        </Link>
                    </li>

                </ul>
            </nav>

        )
    }
}

export default Sidebar