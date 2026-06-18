import Reactn from 'react'
import auth from './auth-helper'

const PrivateRoute = ({ children }) => {
    if (auth.isAuthenticated()) {
        return children
    }
    if (!auth.isAuthenticated()) {
        return
    }
}

export default PrivateRoute
