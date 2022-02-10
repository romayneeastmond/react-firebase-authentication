import React from 'react'
import PropTypes from 'prop-types'

const Errors = ({ errors }) => {
    return (
        <>
            {(errors !== null && errors !== undefined && errors.length > 0) &&
                <div className='alert alert-danger text-left small' role='alert'>
                    <div>
                        <p>
                            Something has gone wrong!
                        </p>
                        <ul className='errors'>
                            {
                                errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

Errors.propTypes = {
    errors: PropTypes.array.isRequired
}

export default Errors
