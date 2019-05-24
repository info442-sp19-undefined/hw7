import React, { Component } from "react";
import firebase from "firebase/app";
import "./css/room.css";
import { Input, Label, Button, Row, Col } from "reactstrap";
class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      uid: "",
      icon: "profile1.png"
    };
    this.handleChange = this.handleChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // validateUid() {
  //   firebase.database().ref("Rooms").child("uid").equalTo(this.state.uid).limitToFirst(1).once('value', snap => {
  //     console.log(snap.val())
  //     if(this.state.uid ===  snap.val()) {
  //       console.log("here")
  //       return true;
  //     }
  //   })
  //   console.log("here2")
  //   return false;
  // }

  handleJoin() {
    let postRef = firebase.database().ref("Rooms");
    console.log(postRef.child("uid").getValue())
    //Working on it 
  }

  onClick = e => {
    this.setState({
      icon: e.target.name
    });
  };
  render() {
    const isEnabled = this.state.uid !== "" && this.state.fname !== "";
    return (
      <div>
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
        <Button onClick={this.handleJoin} disabled={!isEnabled}>
          Join
        </Button>
      </div>
    );
  }
}

export default JoinRoom;
