import React, {Component} from 'react'
import Http from '../service/Http'
import NotificationManager from 'react-notifications/lib/NotificationManager'
import NotificationContainer from 'react-notifications/lib/NotificationContainer'

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: ''
        }

        this.getUsers = this.getUsers.bind(this)
    }

    componentDidMount() {

        this.getUsers()
    }

    getUsers(params) {

        Http.GET('get_users', params)
            .then((response) => {
                NotificationManager.success('Received users list from server')
                console.log('response: ', JSON.stringify(response))
            })
            .catch((error) => {
                if(error && error.response) {
                    NotificationManager.error(error.response.data.message)
                } else {
                    NotificationManager.error('Could not connect to server')
                }
            })
    }

    render() {

        return (
            <div>
                <div className="row">
                    Hii, this is users
                </div>

                <NotificationContainer/>
            </div>
        )
    }
}

export default User