const validationService = () => {
    const required = (field, message) => {
        let validationErrors = []

        if (field.trim() === '' || field.trim().length === 0) {
            validationErrors.push(message)
        }

        return validationErrors
    }

    const validateEmail = (emailAddress) => {
        let validationErrors = []

        if (emailAddress.trim() === '' || emailAddress.trim().length === 0) {
            validationErrors.push('Email Address is required.')
        } else {
            const regularExpression = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

            if (!regularExpression.test(emailAddress.toLowerCase())) {
                validationErrors.push('Email Address should be in valid email@address.com format.')
            }
        }

        return validationErrors
    }

    const validatePasswords = (password, confirmationPassword) => {
        let validationErrors = []

        if (password.trim() === '' || password.trim().length === 0) {
            validationErrors.push('Password is required.')
        }

        if (confirmationPassword.trim() === '' || confirmationPassword.trim().length === 0) {
            validationErrors.push('Confirmation Password is required.')
        }

        if (password.trim().length > 0 && confirmationPassword.trim().length > 0) {
            if (password !== confirmationPassword) {
                validationErrors.push('Passwords must match.')
            }
        }

        return validationErrors
    }

    return {
        required,
        validateEmail,
        validatePasswords
    }
}

export default validationService