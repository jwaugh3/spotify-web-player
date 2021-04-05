import React, { Component } from 'react'
//Style
import styles from './Player.module.css'
import './slider.css'
//Assets
import Slider from 'react-rangeslider'
import ScaleLoader from 'react-spinners/ScaleLoader'


export default class Player extends Component{
    
    state = {
    
    }

    componentDidMount(){
       this.props.handleSetup()
    }

    //Controls
    previousTrack = () => {
        this.props.player.previousTrack();
    }

    togglePlay = () => {
        this.props.player.togglePlay();
    }

    nextTrack = () => {
        this.props.player.nextTrack();
    }

    //seek position
    changePosition = (value) => {
        this.props.player.seek(value)
        this.props.changeState({position: value})
    }

     //change volume
    changeVolume = (value) => {
        this.props.player.setVolume(value)
        this.props.changeState({
            volume: value
        })
    }

    render(){

        let renderedVolumeIcon = []
        let volume = this.props.state.volume

        switch(true){
            case (volume > 0 && volume <= .5):
                renderedVolumeIcon.push(<div key='low' className={styles.volumeIcon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></div>)
                break;
            case (.5 <= volume && volume <= 1):
                renderedVolumeIcon.push(<div key='high' className={styles.volumeIcon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></div>)
                break;
            default:
                renderedVolumeIcon.push(<div key='defaultVolume' className={styles.volumeIcon}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></div>)
                break;
        }

        return (
            <div  className={styles.playContainer}>
            {this.props.initialized ?
            <div className={styles.playContainer}>
                    <div className={styles.navigationContainer}>
                        <div className={styles.playlistButton} onClick={()=>this.props.viewHandler('playlist')}><u>Playlists</u>❯</div>
                    </div>

                    <div className={styles.infoContainer}>
                        <div className={styles.infoSubContainer}>
                            <div className={styles.imageContainer}>
                                <img src={this.props.state.albumImage} className={styles.albumImage}/>
                            </div>
                            <div className={styles.trackText}>{this.props.state.trackName}</div>
                            <div className={styles.artistText}>{this.props.state.artistName}</div>
                        </div>
                    </div>

                    <div className={styles.controlContainer}>
                        <div className={styles.controlSubContainer}>
                            
                            <div className={styles.previousButton} onClick={()=>this.previousTrack()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg></div>

                            {this.props.state.playing ? 
                                <div className={styles.pauseButton} onClick={()=>this.togglePlay()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg></div>
                                :
                                <div className={styles.playButton} onClick={()=>this.togglePlay()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
                            }

                            <div className={styles.nextButton} onClick={()=>this.nextTrack()}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg></div>
                        
                        </div>
                        <div className={styles.durationContainer}>
                            <div className={styles.sliderContainer}>
                                <Slider
                                    min={0}
                                    max={this.props.state.duration}
                                    step={1}
                                    value={this.props.state.position}
                                    tooltip={false}
                                    onChange={this.changePosition}
                                />
                            </div>
                            <div className={styles.volumeContainer}>
                                <div className={styles.volumeSlider}>
                                    <Slider
                                        min={0.01}
                                        max={0.99}
                                        step={0.01}
                                        value={volume}
                                        tooltip={false}
                                        onChange={this.changeVolume}
                                        orientation="vertical"
                                    />
                                </div>
                                {renderedVolumeIcon}
                            </div>
                        </div>
                    </div>
                    </div>
                :
                <ScaleLoader color={'#1ED760'} size={150} />
            }
            </div>
        )
    }
}