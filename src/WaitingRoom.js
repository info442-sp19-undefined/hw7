import React, { Component } from "react";
import firebase from "firebase/app";
import "./css/room.css";
import { Form, Input, Label, Button, Row, Col } from "reactstrap";
import { Redirect } from 'react-router-dom';

export class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToStart: false
    };

    this.onClick = this.onClick.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  handleStart() {
    let roomRef = firebase.database().ref('Rooms');
    roomRef.orderByChild('uid').equalTo(this.state.uid).limitToFirst(1).once("value", snapshot => {
      if (snapshot.child('players').numChildren() >= 1) {
        this.setState({
            readyToStart: true
        });
      } else {
        console.log("less than one player")
        document.getElementById('error').innerHTML = "Can't start the game when you only have 1 player!";
        document.getElementById('error').style.visibility = "visible";
      }
    })
  }

  render() {
    let isEnabled = this.state.uid !== "" && this.state.fname !== "";

    // Render different buttons whether the user has successfully been added to the room or not
    let button = null;
    if (this.state.readyToStart) {
      return <Redirect push to={{ pathname: "/" + this.state.roomName + "/Categories/", state: this.state }} />;
    } else {
      button = (
        <Button onClick={this.handleStart} disabled={!isEnabled}>
          Start Game
        </Button>
      );
    }

    
  }
}