import React, { Component } from "react";
import firebase from "firebase/app";
import "./css/room.css";
import { Button, Label, Col, Row} from "reactstrap";
import { BeatLoader } from 'react-spinners';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { relative } from "path";

const override = {
    display: "block",
    margin: "auto",
    borderColor: "red"
};

export class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToStart: false,
      finished: false,
      players:[]
    };

    this.parentState = this.props.location.state;
    this.handleStart = this.handleStart.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.setPlayer = this.setPlayer.bind(this);
    this.setReady = this.setReady.bind(this);
    this.renderPlayers = this.renderPlayers.bind(this);
  }

  componentWillMount() {
    this.setPlayer(this.checkPlayers());
    this.renderPlayers();
  }

  componentWillUpdate() {
    let ready = this.checkReady();
    let player = this.checkPlayers();

    if (ready !== this.state.readyToStart) {
      this.setReady(ready);
    } else if (player.length !== this.state.players.length) {
      this.setPlayer(player);
      this.renderPlayers();
    }
  }

  setPlayer(state) {
    this.setState({
      players: state
    });
  }

  setReady(state) {
    this.setState({
      readyToStart: state
    });
  }

  checkReady() {
    let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid);
    let ready = false;
    roomRef.child("readyToStart").once("value").then(snapshot => {
      if(snapshot.val() !== false) {
        ready = true;
      }
    });
    return ready;
  }
  
  checkPlayers() {
    let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid);
    let players = [];
    roomRef.child("players").once("value").then(snapshot => {
      if (snapshot.exists()) {
        let array = Object.entries(snapshot.val());

        for (let entry of array) {
          players.push(entry[1]);
        }
      }
    });
    return players;
  }

  handleCancel() {
    let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid);
    roomRef.set({
      game_active: false
    });
  }

  handleStart() {
    let roomRef = firebase.database().ref('Rooms').child(this.parentState.uid);
    roomRef.once("value").then(snapshot => {
      if (this.state.players.length >= 1) {
        roomRef.child('readyToStart').set(true);
      } else {
        document.getElementById('error').innerHTML = "Can't start the game when you only have 1 player!";
        document.getElementById('error').style.visibility = "visible";
      }
    });
  }
  
  renderPlayers() {
    let allPlayers = document.getElementById('playersContainer');
    if (allPlayers !== null) {
      allPlayers.innerHTML = "";
    }
    
    for (let obj of this.state.players) {
      let image = document.createElement('img');
      let name = document.createElement('label');
      let col = document.createElement("div");
      col.style.width = '100px';
      col.style.display = 'flex';

      let key = obj.name;
      let src = require('./icons/' + obj.icon);
      name.innerHTML = key;
      image.src = src;
      image.alt = 'player ' + key;

      col.appendChild(image);
      col.appendChild(name);
      allPlayers.appendChild(col);
    }
  }

  render() {
    let isEnabled = (this.state.uid !== "" && this.state.fname !== "");
    let finishedGame = (!this.state.finished);
    let screen = null;
    if (this.parentState.userType === "organizer") {
      screen = (
        <div>
          <div className="errorContainer">
            <div id="error"
              className="alert alert-danger"
              role="alert"
              style={{ visibility: 'hidden' }}
            >
            </div>
          </div>
          <Button onClick={this.handleStart} disabled={!isEnabled}>
            Start Game
          </Button>
          <Button disabled={finishedGame} onClick={this.handleStart}>
            Analysis
          </Button>
        </div>
      );
    } else {
      screen = (
        <div>
          <div className='sweet-loading'>
          <BeatLoader
            css={override}
            sizeUnit={"px"}
            size={50}
            color={'#123abc'}
            loading={!this.state.readyToStart}
          />
          </div>
        </div>
      );
    }
    return(
    <div>
        <a href={"/Settings"} >
          <img src={require('./icons/setting.svg')} style={{position: relative, left:0, width: "70px"}} alt="setting" />
        </a>
        <a href="/">
          <Label>Leave</Label>
        </a>

        <Row style={{width: "640px", margin:"20px"}}>
          <Col>
            <Label>Room ID</Label>
          </Col>
          <Col>
            <Label>{this.parentState.uid}</Label>

            <CopyToClipboard text={this.parentState.uid}
              onCopy={() => this.setState({ copied: true })}>
              <Button>
                <img src={require("./icons/copy.svg")} alt="copy and paste" />
                </Button>
            </CopyToClipboard>
          </Col>
          <Col>
            {this.state.copied ? <span style={{ color: 'red' }}>Copied.</span> : null}
          </Col>
        </Row> 
        <div id="playersContainer">
        </div>
        {screen}
      </div>
    )
    
  }
}