import React, { Component } from 'react';


import { API, graphqlOperation } from 'aws-amplify';
import codes from './codes';
import query from './query';
import ButtonGroup from './Buttongroup';
import  './App.css';

const buttons = [
  'French',
  'German',
  'Portugese',
  'Spanish'
]

export default class App extends Component {
  state = {
    index: 0,
    codes,
    sentence: '',
    mp3Url: '',
    loading: false,
    enableplay:false
  }
  updateIndex = index => {
    this.setState({ index });
  }
  onChangeText = (e) => {
    this.setState({ sentence: e.target.value })
  }
  translate = async () => {
    if (this.state.sentence === '') return
    const code = codes[this.state.index].code
    try {
      this.setState({ loading: true });
      this.setState({ enableplay: false });
      const translation = await API.graphql(graphqlOperation(query, { sentence: this.state.sentence, code: code }))
      const { sentence } = translation.data.getTranslatedSentence
      const mp3Url = `https://s3.ap-south-1.amazonaws.com/YOURBUCKETNAME/${sentence}`
      this.setState({ mp3Url, loading: false });
      this.setState({ enableplay: true });
    } catch (error) {
      console.log('error translating : ', error)
      this.setState({ loading: false })
    }
  }
  playSound = () => {
    const audio = new Audio(this.state.mp3Url);
    try {
      audio.play();
      this.setState({ sentence: '' })
    }
    catch (error) {
      console.log('playback failed due to audio decoding errors, '+ error);
    }
  }
  render() {
    
    return (
     <div className="body">
      <div>
        <ButtonGroup activebtn={this.state.index} buttons={buttons} onButtonClick={this.updateIndex} />
        <textarea 
        value={this.state.sentence} 
        onChange={this.onChangeText} 
        placeholder="Enter a text"
        />
        <div className="btn-container">
          <button
            className="btn btn-primary"
            onClick={this.translate}>Translate
          </button>
          { this.state.enableplay &&
            <button
            className="btn btn-primary"
            onClick={this.playSound}>Play Sound
            </button>
          }
        </div>
        { this.state.loading &&
        <div className="loader"><span class="symbol"></span></div>
        }
      </div>
     </div>
    );
  }
}
