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
      players:[]
    };

    this.parentState = this.props.location.state;
    this.checkPlayers = this.checkPlayers.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid);
    this.checkPlayers(roomRef);
  }

  // For loader
  componentWillUpdate() {
    let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid);
    roomRef.child("readyToStart").once("value").then(snapshot => {
      if(snapshot.val() !== false) {
        this.setState({
          readyToStart: true
        });
      }
    });

    this.checkPlayers(roomRef);
  }

  checkPlayers(roomRef) {
    roomRef.child("players").once("value").then(snapshot => {
      if (snapshot.exists()) {
        let array = Object.entries(snapshot.val());
        let players = [];

        for (let entry of array) {
          players.push(entry[1]);
        }

        this.setState({
          players: players
        });
      }
    });
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
        console.log("less than one player")
        document.getElementById('error').innerHTML = "Can't start the game when you only have 1 player!";
        document.getElementById('error').style.visibility = "visible";
      }
    });
  }
  
  renderPlayers() {

  }

  render() {
    let isEnabled = this.state.uid !== "" && this.state.fname !== "";
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
        </div>
      );
    } else {
      screen = (
        <div id="playersContainer">
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
        {screen}
      </div>
    )
    
  }
}