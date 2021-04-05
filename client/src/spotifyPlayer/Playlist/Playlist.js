import React, { Component } from 'react'
//Styles
import styles from './Playlist.module.css'
//Assets
import FilterResults from 'react-filter-search'
import stackIcon from '../../resources/stackIcon.png'
import blockIcon from '../../resources/blockIcon.png'

export default class Playlist extends Component {

    state = {
        playlistList: [],
        search: '',
        data: [],
        style: 'block'
    }

    componentDidMount(){
        this.updatePlaylistList()
    }

    updatePlaylistList = async () => {
		fetch('https://api.spotify.com/v1/users/' + this.props.state.userID + '/playlists?offset=0&limit=50', {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + this.props.token
			}
		})
			.then((res) => {
                return res.json()
            })
			.then((data) => {
                console.log(data)
				let playlistItems = [];
				data.items.forEach((playlistItem) => {
					playlistItems.push({
						name: playlistItem.name,
						uri: playlistItem.uri,
                        image: playlistItem.images[0].url,
                        songCount: playlistItem.tracks.total
					});
				});
				this.setState({ playlistList: playlistItems }, ()=>{console.log(playlistItems)});
			});
	};

    handleChange = (event) => {
        const { value } = event.target;
        this.setState({ search: value });
      };

    changeLayout = () => {
        if(this.state.style === 'block'){
            this.setState({style: 'stack'})
        } else if(this.state.style === 'stack'){
            this.setState({style: 'block'})
        }
    }

    render(){
        return (
            <div className={styles.viewContainer}>
                <div className={styles.navigationContainer}>
                    <div className={styles.playerButton} onClick={()=>this.props.viewHandler('player')}>❮<u>Player</u></div>
                    <div className={styles.iconContainer} onClick={()=>this.changeLayout()}><img src={this.state.style === 'stack' ? blockIcon : stackIcon} alt="icon"/></div>
                    <input id="search" placeholder="search" type="text" value={this.state.search} onChange={this.handleChange} />
                </div>

                <div className={styles.playlistNameContainer}>
                    <p className={styles.playlistName}>
                        {this.props.state.username.split(' ')[0]}'s Playlists
                    </p>
                </div>

                <div className={styles.playlistContainer}>
                    <FilterResults
                        value={this.state.search}
                        data={this.state.playlistList}
                        renderResults={results => (

                            <div className={this.state.style === 'stack' ? styles.stackLayout : styles.blockLayout}>
                                {this.state.style === 'stack' ? 
                                    results.map(el => (
                                        <div key={el.name} className={styles.playlistItem}>
                                            <img className={styles.playlistImage} src={el.image} />
                                            <p className={styles.nameText}>{el.name}</p>
                                            <p className={styles.countText}>{el.songCount}</p>
                                            <div className={styles.playButton} onClick={()=>this.props.handlePlaylistChange(el.uri)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                                        </div>
                                    ))
                                    :
                                    results.map(el => (
                                        <div key={el.name} className={styles.playlistItemblock}>
                                            <div className={styles.gradient} onClick={()=>this.props.handlePlaylistChange(el.uri)}>
                                            <div className={styles.playButtonblock}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                                            </div>
                                            <img className={styles.playlistImageblock} src={el.image} />
                                            <p className={styles.nameTextblock}>{el.name}</p>
                                            <p className={styles.countTextblock}>{el.songCount}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    />
                </div>
            </div>
          );
    }
}