import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

import Errors from '../UI/Errors'

const Register = ({ authenticationService, validationService }) => {
    const navigate = useNavigate()

    const firstNameRef = useRef(null)
    const lastNameRef = useRef(null)
    const emailAddressRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)

    const [errors, setErrors] = useState([])

    const onSubmit = async (e) => {
        e.preventDefault()

        let mounted = true
        let validationErrors = []

        validationErrors.push(validationService.required(firstNameRef.current.value.trim(), 'First Name is required.'))
        validationErrors.push(validationService.required(lastNameRef.current.value.trim(), 'Last Name is required.'))
        validationErrors.push(validationService.validateEmail(emailAddressRef.current.value.trim()))
        validationErrors = [...validationErrors, ...validationService.validatePasswords(passwordRef.current.value.trim(), confirmPasswordRef.current.value.trim())]

        validationErrors = validationErrors.filter(x => x.length > 0)

        if (validationErrors.length === 0) {
            validationErrors = await authenticationService.register(firstNameRef.current.value.trim(), lastNameRef.current.value.trim(), emailAddressRef.current.value.trim(), passwordRef.current.value)

            if (validationErrors.length === 0) {
                authenticationService.setVerificationEmail(emailAddressRef.current.value.trim().toLowerCase())

                mounted = false

                navigate('/verify', { replace: true })
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
                                    <div className='form-register text-center'>
                                        <form className='form-register' onSubmit={onSubmit}>
                                            <div className='form-group'>
                                                <div className='mb-5'>
                                                    <h1 className='h3 font-weight-normal'>Register to Continue</h1>
                                                    <p>
                                                        Already a user? <Link to='/login'>Click here to Login</Link>.
                                                    </p>
                                                </div>

                                                <Errors errors={errors} />

                                                <label htmlFor='FirstName' className='sr-only'>First Name</label>
                                                <input ref={firstNameRef} type='text' id='FirstName' name='firstName' className='form-control first' placeholder='Enter First Name' />

                                                <label htmlFor='LastName' className='sr-only'>Last Name</label>
                                                <input ref={lastNameRef} type='text' id='LastName' name='lastName' className='form-control' placeholder='Enter Last Name' />

                                                <label htmlFor='EmailAddress' className='sr-only'>Email Address</label>
                                                <input ref={emailAddressRef} type='email' id='EmailAddress' name='emailAddress' className='form-control' placeholder='Enter Email Address' />

                                                <label htmlFor='Password' className='sr-only'>Password</label>
                                                <input ref={passwordRef} type='password' id='Password' name='password' className='form-control' placeholder='Enter Password' />

                                                <label htmlFor='ConfirmPassword' className='sr-only'>Confirm Password</label>
                                                <input ref={confirmPasswordRef} type='password' id='ConfirmPassword' name='password' className='form-control last' placeholder='Enter Confirm Password' />
                                            </div>
                                            <div className='form-group'>
                                                <input type='submit' className='btn btn-primary btn-block' value='Register' />
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

Register.propTypes = {
    authenticationService: PropTypes.object.isRequired,
    validationService: PropTypes.object.isRequired
}

export default Register
