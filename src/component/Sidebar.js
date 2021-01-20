import React, {Component} from 'react'
import {Link} from "react-router-dom";

class Sidebar extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <nav id="sidebar">

                <div className="sidebar-header pointer"
                    id="sidebarCollapse">

                    <div className="sidebar-title">Apartment Rental</div>
                </div>

                <ul className="list-unstyled components">

                    <li>
                        <Link to="/app/users">
                            <i className="fa fa-user"/>
                            Users
                        </Link>
                    </li>

                    <li>
                        <Link to="/app/apartment">
                            <i className="fa fa-home"/>
                            Apartments
                        </Link>
                    </li>

                </ul>
            </nav>

        )
    }
}

export default Sidebar