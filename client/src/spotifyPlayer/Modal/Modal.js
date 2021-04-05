import React, { Component } from 'react'
//Components
import Login from '../Login/Login'
import Player from '../Player/Player'
import Playlist from '../Playlist/Playlist'
//Style
import styles from './Modal.module.css'
//resources
import spotifyLogo from '../../resources/spotifyLogo.png'

export default class Modal extends Component{

    state = {
        displayApp: false,
        initialized: false,
        view: 'player',
        username: '',
        profilePic: '',
        userID: '',
        //player
        deviceID: '',
        position: 0,
        positionMin: 0,
        positionSec: 0,
        duration: 0,
        durationMin: 0,
        durationSec: 0,
        trackName: '',
        albumName: '',
        artistName: '',
        albumImage: '',
        playing: false,
        volume: .2
    }

    handleSetup = () => {
        if(this.state.initialized === false){
            this.tokenCheckInterval = setInterval(() => this.updateUser(), 1000);
            this.playerCheckInterval = setInterval(() => this.playerSetup(), 1000);
        }
    }

    viewHandler = (view) => {
        this.setState({view: view})
    }

    playerSetup = () => {
        if (window.Spotify !== null) {
            //cancel the interval if player created
            clearInterval(this.playerCheckInterval);
            this.setState({initialized: true})

            const token = this.props.token;
            this.player = new window.Spotify.Player({
                name: "Spotify Web App | James' Portfolio",
                getOAuthToken: cb => { cb(token); },
                volume: 0.2
            })

            // Error handling
            this.player.addListener('initialization_error', ({ message }) => { console.error(message); });
            this.player.addListener('authentication_error', ({ message }) => { console.error(message); });
            this.player.addListener('account_error', ({ message }) => { console.error(message); });
            this.player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
            this.player.addListener('player_state_changed', state => this.onStateChanged(state));

            // Ready
            this.player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                this.setState({deviceID: device_id},
                    ()=>{
                        this.transferPlaybackHere();
                    }    
                )
            });

            // Not Ready
            this.player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            this.player.connect();
        }
    }

    //switch device to web app
    transferPlaybackHere() {
        const { deviceID } = this.state;
        const token = this.props.token
        fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "device_ids": [ deviceID ],
            "play": true,
        }),
        });
    }

    onStateChanged(newState) {
        var millisec = require('millisec');
    
        //check for position every second
        this.playerUpdatePosition = setInterval(() => this.checkForPosition(),1000);
    
        //if no longer listening to music, we get a null
        if (newState !== null) {
          const {
            current_track: currentTrack,
          } = newState.track_window;
          const position = newState.position;
          const duration = newState.duration;
          const durationMin = millisec(duration).format('mm');
          const oldDurationSec = millisec(duration).format('ss');
          const durationSec = ("0" + oldDurationSec).slice(-2);   //used to prepend 0 to single digit seconds
          const trackName = currentTrack.name;
          const albumName = currentTrack.album.name;
          const albumImage = currentTrack.album.images.map(image => image.url).slice(0,1);  //get first element of array
          const artistName = currentTrack.artists //get all artists and join with ', '
            .map(artist => artist.name)
            .join(", ");
          const playing = !newState.paused;
          this.setState({
            position,
            duration,
            durationMin,
            durationSec,
            trackName,
            albumName,
            artistName,
            albumImage,
            playing
          });
        }
      }

    //update position of song
    checkForPosition() {
        var millisec = require('millisec');
        
        this.player.getCurrentState().then(state => {
            if(state !== null){
                const position = state.position;
                const positionMin = millisec(position).format('mm');
                const oldPositionSec = millisec(position).format('ss');
                const positionSec = ("0" + oldPositionSec).slice(-2);
                this.setState({
                    position,
                    positionMin,
                    positionSec
                });
            }
        });
    }

    handlePlaylistChange = (uri) => {
        fetch('https://api.spotify.com/v1/me/player/play', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.props.token
            },
            //to set track position for viewers use position and offset
            body: JSON.stringify(
                {
                    "context_uri": uri,
                    "offset": {
                      "position": 0
                    },
                    "position_ms": 0
                  }
            )
        })
    }

    //Personalization

    updateUser = () => {
		if (this.props.token) {

            clearInterval(this.tokenCheckInterval)

			fetch('https://api.spotify.com/v1/me', {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + this.props.token
				}
			})
				.then((res) => res.json())
				.then((data) => {
					this.setState(
						{
							username: data.display_name,
							profilePic: data.images[0].url,
							userID: data.id
						}, ()=>console.log(this.state)
					);
				});
		}
	};

    render(){
        
        let renderedDisplay = []

        switch(true){
            case this.props.token === '':
                renderedDisplay.push(<Login key='login' apiEndpoint="http://localhost:5000/auth/login"/>)
                break;
            case this.props.token !== '' && this.state.view === 'player':
                renderedDisplay.push(<Player key='player' initialized={this.state.initialized} token={this.props.token} viewHandler={this.viewHandler} player={this.player} handleSetup={this.handleSetup} changeState={(value)=>this.setState(value)} state={this.state}/>)
                break;
            case this.props.token !== '' && this.state.view === 'playlist':
                renderedDisplay.push(<Playlist key='playlist' token={this.props.token} viewHandler={this.viewHandler} player={this.player} changeState={this.setState} state={this.state} handlePlaylistChange={this.handlePlaylistChange}/>)
                break;
            default:
                break;
        }

        return(
            <div className={styles.appContainer}>
                <div onClick={()=>this.setState({displayApp: !this.state.displayApp})}>
                    <img src={spotifyLogo} className={styles.spotifyLogo} alt="spotify Logo"/>
                </div>

                {this.state.displayApp ? 
                    <div className={styles.modalPlayer}> 
                        {renderedDisplay}
                    </div>
                : null}
            </div>
        )
    }
}