import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth'
import { addDoc, query, collection, getDocs, where } from 'firebase/firestore'
import { auth, db } from './firebaseConfiguration'

const authenticationService = () => {
    const login = async (emailAddress, password) => {
        let verified = false
        let user = {}
        let validationErrors = []

        await signInWithEmailAndPassword(auth, emailAddress, password)
            .then(async (res) => {
                const q = query(collection(db, 'users'), where('uid', '==', res.user.uid))

                const doc = await getDocs(q)
                const data = doc.docs[0].data()

                user = {
                    id: auth.currentUser.uid,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    emailAddress: auth.currentUser.email
                }

                if (auth.currentUser.emailVerified === true) {
                    verified = true
                } else {
                    validationErrors = await sendVerification()
                }
            })
            .catch((error) => {
                validationErrors.push(error.message.replace('Firebase: ', ''))
            })

        return { verified, user, validationErrors }
    }

    const logout = () => {
        try {
            auth.signOut()

            window.localStorage.removeItem('firebaseAuthenticationDemonstration_user')
        } catch {

        }
    }

    const register = async (firstName, lastName, emailAddress, password) => {
        let validationErrors = []

        await createUserWithEmailAndPassword(auth, emailAddress.trim().toLowerCase(), password)
            .then(async (res) => {
                sendEmailVerification(auth.currentUser, { url: process.env.REACT_APP_VERIFY_URL })

                await addDoc(collection(db, 'users'), {
                    uid: res.user.uid,
                    firstName,
                    lastName,
                    emailAddress: emailAddress.trim().toLowerCase(),
                    method: 'registration'
                }).then(() => {

                }).catch((error) => {
                    validationErrors.push(error.message.replace('Firebase: ', ''))
                })
            })
            .catch((error) => {
                validationErrors.push(error.message.replace('Firebase: ', ''))
            })

        return validationErrors
    }

    const sendVerification = async () => {
        let validationErrors = []

        await sendEmailVerification(auth.currentUser, { url: process.env.REACT_APP_LOGIN_URL })
            .then(() => {

            })
            .catch((error) => {
                validationErrors.push(error.message.replace('Firebase: ', ''))
            })

        return validationErrors
    }

    const forgetMe = () => {
        window.localStorage.removeItem('firebaseAuthenticationDemonstration_rememberMe')
        window.localStorage.removeItem('firebaseAuthenticationDemonstration_rememberMeEmail')
    }

    const getLoginValues = () => {
        let result = {
            rememberMe: false,
            emailAddress: ''
        }

        if (window.localStorage.getItem('firebaseAuthenticationDemonstration_rememberMe') === 'true') {
            result.rememberMe = true

            if (window.localStorage.getItem('firebaseAuthenticationDemonstration_rememberMeEmail') !== null) {
                result.emailAddress = window.localStorage.getItem('firebaseAuthenticationDemonstration_rememberMeEmail')
            }
        }

        return result
    }

    const getLoggedInUser = () => {
        if (window.localStorage.getItem('firebaseAuthenticationDemonstration_user') !== null) {
            return JSON.parse(window.localStorage.getItem('firebaseAuthenticationDemonstration_user'))
        }

        return null
    }

    const getVerificationEmail = () => {
        window.localStorage.getItem('firebaseAuthenticationDemonstration_email')
    }

    const rememberMe = (emailAddress) => {
        window.localStorage.setItem('firebaseAuthenticationDemonstration_rememberMe', 'true')
        window.localStorage.setItem('firebaseAuthenticationDemonstration_rememberMeEmail', emailAddress.trim().toLowerCase())
    }

    const setLoggedInValues = (user) => {
        window.localStorage.setItem('firebaseAuthenticationDemonstration_user', JSON.stringify(user))
        window.localStorage.removeItem('firebaseAuthenticationDemonstration_email')
    }

    const setVerificationEmail = (emailAddress) => {
        window.localStorage.setItem('firebaseAuthenticationDemonstration_email', emailAddress.trim().toLowerCase())
    }

    return {
        forgetMe,
        getLoginValues,
        getLoggedInUser,
        getVerificationEmail,
        login,
        logout,
        register,
        rememberMe,
        sendVerification,
        setLoggedInValues,
        setVerificationEmail
    }
}

export default authenticationService