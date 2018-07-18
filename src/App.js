import React, { Component } from 'react';

import awsmobile from './aws-exports';
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
    langSelected:''
  }
  updateIndex = index => {
    this.setState({ index });
    this.setState({ langSelected:buttons[index]});
  }
  onChangeText = (e) => {
    this.setState({ sentence: e.target.value })
  }
  translate = async () => {
    if (this.state.sentence === '') return
    const code = codes[this.state.index].code
    try {
      this.setState({ loading: true });
      const translation = await API.graphql(graphqlOperation(query, { sentence: this.state.sentence, code: code }))
      const { sentence } = translation.data.getTranslatedSentence
      const mp3Url = awsmobile.aws_s3_url+sentence;
      this.setState({ mp3Url});
      this.playSound();
    } catch (error) {
      console.log('error translating : ', error)
      this.setState({ loading: false })
    }
  }
  playSound = () => {
    const audio = new Audio(this.state.mp3Url);
    try {
      audio.play().then(()=>{
        this.setState({loading: false });
      },(err)=>{
        console.dir('error',err);
      });
    }
    catch (error) {
      console.log('playback failed due to audio decoding errors, '+ error);
    }
  }
  render() {
    
    return (
     <div className="body">
      <div>
        <textarea 
        value={this.state.sentence} 
        onChange={this.onChangeText} 
        placeholder="Enter a text"
        />
        <ButtonGroup activebtn={this.state.index} buttons={buttons} onButtonClick={this.updateIndex} />
        <div className="btn-container">
          <button disabled={this.state.loading}
            className="btn btn-primary"
            onClick={this.translate}><span className="button-text" >Translate {this.state.langSelected && 'to '+this.state.langSelected}</span> { this.state.loading &&<span className="symbol"></span>
          }
          </button>
          { this.state.enableplay &&
            <button
            className="btn btn-primary"
            onClick={this.playSound}>Play Sound 
            </button>
          }
        </div>
      </div>
     </div>
    );
  }
}
