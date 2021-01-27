import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {isTokenExpired} from './service/Util'
import PublicLayout from "./component/PublicLayout"
import PrivateLayout from "./component/PrivateLayout"
import Login from './component/Login'
import User from './component/User'
import Logout from "./component/Logout"
import NotFound from './component/NotFound'
import Apartment from './component/Apartment'

const PrivateRoute = ({component: Component, ...rest}) => {

    const token = JSON.parse(localStorage.getItem('token'))
    return token ? (
        <Route {...rest} render = { matchProps => (
            <PrivateLayout>
                <Component {...matchProps} />
            </PrivateLayout>
        )}/>
    ) : <Redirect to="/login"/>
}

const PublicRoute = ({component: Component, ...rest}) => {

    const token = JSON.parse(localStorage.getItem('token'))

    return (token !== null && !isTokenExpired((token)) ? <Redirect to='/app/users'/> :
            <Route {...rest} render={ matchProps => (
                <PublicLayout>
                    <Component {...matchProps} />
                </PublicLayout>
            )}/>
    )
}

class App extends Component {

  render() {

      const token = JSON.parse(localStorage.getItem('token'))
      return (
          <Router>
              <Switch>
                  <Route exact path = "/">
                      <Redirect to = {(token !== null && !isTokenExpired(token) ? '/app/users' : '/login')} />
                  </Route>

                  <PublicRoute path="/login" component={Login}/>
                  <PrivateRoute path="/app/users" component={User}/>
                  <PrivateRoute path="/app/apartments" component={Apartment}/>
                  <PrivateRoute path="/app/logout" component={Logout}/>
                  <Route component = {NotFound}/>
              </Switch>
          </Router>
      )
  }
}

export default App;
