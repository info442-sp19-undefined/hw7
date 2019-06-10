import React, { Component } from "react";
import firebase from "firebase/app";
import "./css/room.css";
import { Button} from "reactstrap";

export class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToStart: false,
      players:[]
    };

    this.parentState = this.props.location.state;
    this.handleStart = this.handleStart.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid).child('players');
    roomRef.once("value").then(snapshot => {
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
    let roomRef = firebase.database().ref('Rooms');
    roomRef.orderByChild('uid').equalTo(this.parentState.uid).limitToFirst(1).once("value", snapshot => {
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
    if(this.props.userType === "organizer") {

    } else {

    }
    return(
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
    )
    
  }
}