import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import Errors from '../UI/Errors'

const Verify = ({ authenticationService }) => {
    const [emailAddress, setEmailAddress] = useState('')
    const [clickableSubmit, setClickableSubmit] = useState(true)
    const [errors, setErrors] = useState([])

    useEffect(() => {
        setEmailAddress(authenticationService.getVerificationEmail())
    }, [authenticationService])

    const onSubmit = async (e) => {
        e.preventDefault()

        let validationErrors = []

        if (validationErrors.length === 0) {
            const result = await authenticationService.sendVerification()

            validationErrors = result
        }

        setErrors(validationErrors)
        setClickableSubmit(false)
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
                                                    <h1 className='h3 font-weight-normal'>Verify Your Email Address</h1>
                                                    <p>
                                                        Already a user? <Link to='/login'>Click here to Login</Link>.
                                                    </p>
                                                </div>

                                                <Errors errors={errors} />

                                                <p>
                                                    A verification email has been sent{emailAddress !== null ? <> to <strong>{emailAddress}</strong>.</> : <>.</>} Please follow the instruction to verify your email address.
                                                </p>
                                            </div>
                                            {
                                                emailAddress !== null &&
                                                <div className='form-group'>
                                                    <input type='submit' className='btn btn-primary btn-block' value='Resend Email' disabled={!clickableSubmit && (errors === undefined || errors.length === 0)} />
                                                </div>
                                            }

                                            {
                                                (emailAddress === null || (emailAddress !== null && emailAddress.length === 0)) &&
                                                <div>
                                                    Your email address could not be loaded at this time. Please <Link to='/login'>click here to login</Link> again.
                                                </div>
                                            }
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

Verify.propTypes = {
    authenticationService: PropTypes.object.isRequired
}

export default Verify
