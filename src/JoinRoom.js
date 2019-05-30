import React, { Component } from "react";
import firebase from "firebase/app";
import "./css/room.css";
import { Form, Input, Label, Button, Row, Col } from "reactstrap";
import { Redirect } from 'react-router-dom';
class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      uid: "",
      icon: "profile1.png",
      roomName: "room",
      joined:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleJoin() {
    let roomRef = firebase.database().ref('Rooms');
    roomRef.orderByChild('uid').equalTo(this.state.uid).limitToFirst(1).once("value", snapshot => {
      if (snapshot.exists()) {
        // Adds player information to correct room in firebase
        roomRef.child(this.state.uid).child('players').set({
          name: this.state.fname,
          icon: this.state.icon
        });

        // Sets the state so that the it redirects to the correct room and displays the correct path
        roomRef.child(this.state.uid).child('room_name').once("value").then(data => {
          if (data.val() !== null) {
            this.setState({
              roomName: data.val(),
              joined: true
            });
          }
        });
      } else {
        alert("Oh no! Seems that room doesn't exist!");
        document.getElementById('join-form').reset();
      }
    })
  }

  onClick = e => {
    this.setState({
      icon: e.target.name
    });
  }
  render() {
    let isEnabled = this.state.uid !== "" && this.state.fname !== "";

    // Render different buttons whether the user has successfully been added to the room or not
    let button = null;
    if (this.state.joined) {
      return <Redirect push to={"/" + this.state.roomName + "/Categories/"} />;
    } else {
      button = (
        <Button onClick={this.handleJoin} disabled={!isEnabled}>
          Add player
        </Button>
      );
    }
    return (
      <div>
        <Form id="join-form">
          <h1 className="header"> Create Profile </h1>
          <Label>Name</Label>
          <Input
            placeholder="First Name"
            name="fname"
            onChange={this.handleChange}
            id="fname"
          />
          <Label>Room #</Label>
          <Input
            placeholder="Room Number"
            name="uid"
            onChange={this.handleChange}
            id="uid"
          />
          <Label>Select Profile Image</Label>
          <Row>
            <Col>
              <div className="image">
                <img
                  name="profile1.png"
                  alt="big penguin"
                  src={require("./icons/profile1.png")}
                  onClick={this.onClick}
                />
              </div>
            </Col>
            <Col>
              <div className="image">
                <img
                  name="profile2.png"
                  alt="otter"
                  src={require("./icons/profile2.png")}
                  onClick={this.onClick}
                />
              </div>
            </Col>
            <Col>
             <div className="image">
                <img
                  name="profile3.png"
                  alt="polar bear"
                  src={require("./icons/profile3.png")}
                  onClick={this.onClick}
               />
              </div>
            </Col>
            <Col>
              <div className="image">
                <img
                  name="profile4.png"
                  alt="fat baby penguin"
                  src={require("./icons/profile4.png")}
                  onClick={this.onClick}
                />
              </div>
            </Col>
          </Row>
          {button}
        </Form>
      </div>
    );
  }
}

export default JoinRoom;