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
      roomName: "",
      joined:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.handleJoin = this.handleJoin.bind(this);
  }

  isValid(str, field) {
    if ( field === 'fname' && /^[a-zA-Z ]+$/.test(str)) {
      return true;
    } else if ( field === 'uid') {
      return true;
    }
    return false;
  }

  handleChange = e => {
    if (this.isValid(e.target.value, e.target.name)) {
      document.getElementById('fname').style.borderColor = "white";
      document.getElementById('error').style.visibility = "hidden";
      this.setState({
        [e.target.name]: e.target.value
      }); 
    } else {
      e.target.value = "";
      this.setState({ fname: "" });
      document.getElementById('error').innerHTML = "Please enter a correct name without symbols.";
      document.getElementById('error').style.visibility = "visible";
      document.getElementById('fname').style.borderColor = "red";
    }
  }

  handleJoin() {
    let roomRef = firebase.database().ref('Rooms');
    roomRef.orderByChild('uid').equalTo(this.state.uid).limitToFirst(1).once("value", snapshot => {
      if (snapshot.exists()) {
        // Adds player information to correct room in firebase
        roomRef.child(this.state.uid).child('players').push({
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
        document.getElementById('error').innerHTML = "Oh no! Seems that room doesn't exist!";
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
      return <Redirect push to={{pathname: "/" + this.state.roomName + "/Categories/", state: this.state }} />;
    } else {
      button = (
        <Button onClick={this.handleJoin} disabled={!isEnabled}
        style={{ fontSize: "18px", borderRadius: "20px", width: "200px", height: "2em", 
        background: "#226597", color: "white", display: "flex",
        justifyContent: "center", padding: "0px", marginLeft: "auto", marginRight: "auto",  marginTop: "50px"}} >
          Add New Player
        </Button>
      );
    }
    
    return (
      <div>
        <div id="error"
            className="alert alert-danger"
            role="alert"
            style={{ visibility: "hidden" }}>
        </div>
        <Form id="join-form">
          <h1 className="header"> Create Profile </h1>
          <Label>Name</Label>
          <Input
            placeholder="First Name"
            name="fname"
            onChange={this.handleChange}
            id="fname"
            style={{ borderRadius: "20px", paddingLeft: "24px", marginLeft: "auto", marginRight: "auto"}}
          />
          <label style={{marginTop: "8%"}}>Room #</label>
          <Input
            placeholder="Room Number"
            name="uid"
            onChange={this.handleChange}
            id="uid"
            style={{ borderRadius: "20px", paddingLeft: "24px",  marginLeft: "auto", marginRight: "auto"}}
          />
          <Label style={{marginTop: "2em"}}>Select Profile Image</Label>
          <Row className="profileimgs">
            <Col style={{width: "60px"}}>
              <div style={{width: "60px"}}>
                <img
                  className="profileimg"
                  name="profile1.png"
                  alt="big penguin"
                  src={require("./icons/profile1.png")}
                  onClick={this.onClick}
                />
              </div>
            </Col>
            <Col style={{ width: "60px"}}>
              <div style={{width: "60px"}}>
                <img
                  className="profileimg"
                  name="profile2.png"
                  alt="otter"
                  src={require("./icons/profile2.png")}
                  onClick={this.onClick}
                />
              </div>
            </Col>
            <Col style={{width: "60px"}}>
             <div style={{width: "60px"}}>
                <img
                  className="profileimg"
                  name="profile3.png"
                  alt="polar bear"
                  src={require("./icons/profile3.png")}
                  onClick={this.onClick}
               />
              </div>
            </Col>
            <Col style={{width: "60px"}}>
              <div style={{width: "60px"}}>
                <img
                  className="profileimg"
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