import React, { Component } from 'react'
//styles
import styles from './Login.module.css'
//Assets
import openSignInWindow from '../../Login-Popup/openPopup'
import loginSpotify from '../../resources/loginSpotify.png'

export default class Login extends Component {

    logUserIn = (apiEndpoint, action) => {
        openSignInWindow(apiEndpoint, action)
    }

    render() {
        return (
            <div className={styles.loginContainer}>
                <button className={styles.loginButton} onClick={()=>this.logUserIn(this.props.apiEndpoint, 'authenticate')}>Login with Spotify</button>
                <img className={styles.loginBackground} src={loginSpotify} alt="login"/>
            </div>
        )
    }
}
