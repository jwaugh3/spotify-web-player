import { Component } from 'react'
//Components
import SpotifyModal from './spotifyPlayer/Modal/Modal'
//Style
import styles from './App.module.css';

class App extends Component{

  state = {
    spotifyToken: ''
  }

  componentDidMount = async () => {

    window.addEventListener('click', (event)=>{
      //handles player display
      let buttonType = event.srcElement.id
      if(buttonType === 'spotify-player-demo-button'){
        this.setState({displayPlayer: true})
      }
    })

    window.addEventListener("message", async (event) => {
      //handles access token
      if(typeof event.data === 'string'){  
        if(event.data.startsWith('?access_token')){
          let token = event.data.split('=').pop()
          this.setState({spotifyToken: token })
          console.log(token)
        }
      }
    })
  }

  render (){
    return (
      <div className={styles.App}>
        {/* Spotify Player */}
        <div>
          <SpotifyModal token={this.state.spotifyToken} />
        </div>
      </div>
    )
  }
}

export default App;
