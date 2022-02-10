import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login, logout } from './store/authenticationSlice'

import Login from './components/Pages/Login'
import Members from './components/Pages/Members'
import Register from './components/Pages/Register'
import Verify from './components/Pages/Verify'

import authenticationService from './services/authenticationService'
import validationService from './services/validationService'

import './App.scss'

const App = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const authenticatedUserValues = useSelector(state => state.authentication.value)

    useEffect(() => {
        const user = authenticationService().getLoggedInUser()

        if (user !== null) {
            dispatch(login({ user }))
        }
    }, [dispatch])

    const isLoggedIn = () => {
        if (authenticatedUserValues.length === 0) {
            return false
        }

        if (authenticatedUserValues.authenticated === true) {
            return true
        }

        return false
    }

    const onLogout = () => {
        authenticationService().logout()
        dispatch(logout({}))

        navigate('/', { replace: true })
    }

    return (
        <>
            <Routes>
                <Route path='/' exact element={isLoggedIn() ? <Members user={authenticatedUserValues.user} onLogout={onLogout} /> : <Login authenticationService={authenticationService()} validationService={validationService()} />} />
                <Route path='/login' element={<Login authenticationService={authenticationService()} validationService={validationService()} />} />
                <Route path='/register' element={<Register authenticationService={authenticationService()} validationService={validationService()} />} />
                <Route path='/members' exact element={isLoggedIn() ? <Members user={authenticatedUserValues.user} onLogout={onLogout} /> : <Login authenticationService={authenticationService()} validationService={validationService()} />} />
                <Route path='/verify' element={<Verify authenticationService={authenticationService()} />} />
            </Routes>
        </>
    )
}

export default App
