import React from 'react'
import PropTypes from 'prop-types'

const Members = ({ user, onLogout }) => {
    return (
        <div className='container-fluid'>
            <div className='row'>
                <main role='main' className='col-md-12 ml-sm-auto col-lg-12 pt-3 px-4'>
                    <h1>Members Only</h1>

                    <p>
                        Welcome Back, {user.firstName} {user.lastName} ({user.emailAddress})
                    </p>

                    <button className='btn btn-primary btn-sm' onClick={onLogout}>Logout</button>
                </main>
            </div>
        </div>
    )
}

Members.propTypes = {
    user: PropTypes.object.isRequired,
    onLogout: PropTypes.func.isRequired
}

export default Members
