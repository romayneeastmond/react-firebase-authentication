import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { login } from '../../store/authenticationSlice'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import Errors from '../UI/Errors'

const Login = ({ authenticationService, validationService }) => {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const emailAddressRef = useRef(null)
    const passwordRef = useRef(null)
    const rememberMeRef = useRef(null)

    const [errors, setErrors] = useState([])

    useEffect(() => {
        const result = authenticationService.getLoginValues()

        rememberMeRef.current.checked = result.rememberMe
        emailAddressRef.current.value = result.emailAddress
    }, [authenticationService])

    const onSubmit = async (e) => {
        e.preventDefault()

        let mounted = true
        let validationErrors = []

        validationErrors.push(validationService.validateEmail(emailAddressRef.current.value.trim()))
        validationErrors.push(validationService.required(passwordRef.current.value.trim(), 'Password is required.'))

        validationErrors = validationErrors.filter(x => x.length > 0)

        if (validationErrors.length === 0) {
            const result = await authenticationService.login(emailAddressRef.current.value.trim(), passwordRef.current.value)

            validationErrors = result.validationErrors

            if (validationErrors.length === 0) {
                mounted = false

                if (rememberMeRef.current.checked === true) {
                    authenticationService.rememberMe(emailAddressRef.current.value.trim().toLowerCase())
                } else {
                    authenticationService.forgetMe()
                }

                if (result.verified === true) {
                    const user = { ...result.user, verified: result.verified }

                    authenticationService.setLoggedInValues(user)

                    dispatch(login({ user }))

                    navigate('/members', { replace: true })
                } else {
                    authenticationService.setVerificationEmail(emailAddressRef.current.value.trim().toLowerCase())

                    navigate('/verify', { replace: true })
                }
            }
        }

        if (mounted === true) {
            setErrors(validationErrors)
        }
    }

    return (
        <div className='container-fluid vertical-align'>
            <div className='row'>
                <main role='main' className='col-md-12 ml-sm-auto col-lg-12 pt-3 px-4'>
                    <div className='row justify-content-center'>
                        <div className='col-lg-4 col-md-8'>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className='form-signin text-center'>
                                        <form className='form-signin' onSubmit={onSubmit}>
                                            <div className='form-group'>
                                                <div className='mb-5'>
                                                    <h1 className='h3 font-weight-normal'>Welcome Back</h1>
                                                    <p>
                                                        Do you have an account yet? <Link to='/register'>Click here to Register</Link>.
                                                    </p>
                                                </div>

                                                <Errors errors={errors} />

                                                <label htmlFor='EmailAddress' className='sr-only'>Email Address</label>
                                                <input ref={emailAddressRef} type='email' id='EmailAddress' name='emailAddress' className='form-control' placeholder='Enter Email Address' />

                                                <label htmlFor='Password' className='sr-only'>Password</label>
                                                <input ref={passwordRef} type='password' id='Password' name='password' className='form-control' placeholder='Enter Password' />
                                            </div>
                                            <div className='form-group checkbox mb-3 text-left'>
                                                <label>
                                                    <input ref={rememberMeRef} type='checkbox' name='rememberMe' /> Remember Me
                                                </label>
                                            </div>
                                            <div className='form-group'>
                                                <input type='submit' className='btn btn-primary btn-block' value='Login' />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

Login.propTypes = {
    authenticationService: PropTypes.object.isRequired,
    validationService: PropTypes.object.isRequired
}

export default Login
