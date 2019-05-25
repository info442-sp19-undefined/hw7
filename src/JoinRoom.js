import React, { Component } from "react";
import firebase from "firebase/app";
import "./css/room.css";
import { Form, Input, Label, Button, Row, Col } from "reactstrap";
class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      uid: "",
      icon: "profile1.png",
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
      if(snapshot.exists()) {
        roomRef.child(this.state.uid).child('players').set({
          name: this.state.fname,
          icon: this.state.icon
        })
        this.setState({joined:true});
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
    if (!this.state.joined) {
        button = (
          <Button onClick={this.handleJoin} disabled={!isEnabled}>
            Add New Player
          </Button>
        )
      } else {
        button = ( 
          <Button href="/Categories">
            Join Room
          </Button>
        )
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