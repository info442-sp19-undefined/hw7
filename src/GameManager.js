import React, { Component } from "react";
import firebase from "firebase/app";
import {
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Input,
    Label
} from "reactstrap";
let uniqid = require("uniqid");

class GameManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            uid: "",
            roomName: "",
            numQuestions: 0,
            toggleAnalysis: false,
            toggleRanking: false,
            timer: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.handleCreateRoom = this.handleCreateRoom.bind(this);
    }

    componentDidMount() {
        let uid = uniqid();
        this.setState({ uid: uid, roomName: "Room-" + uid });
    }

    handleCreateRoom() {
        let roomRef = firebase.database().ref("Rooms").child(this.state.uid);
        roomRef.set({
            organizer: this.state.fname,
            uid: this.state.uid,
            room_name: this.state.roomName,
            settings: {
                Number_Questions: this.state.numQuestions,
                timer: this.state.timer,
                showAnalysis: this.state.toggleAnalysis,
                showRanking: this.state.toggleRanking
            }
        });
    }

    isValid(val, name) {
        if (name === "numQuestions") {
            return val <= 15 && val > 0
        } else if (name === "timer") {
            return val <= 60 && val > 0;
        }
        return true;
    }

    handleChange = (e) => {
        // Check the inputs are valid
        if (this.isValid(e.target.value, e.target.name)) {
            this.setState({
                [e.target.name]: e.target.value
            });
        } else {
            // Resets the input field if the input is over the specified limits
            e.target.value = "";
        }
    }

    onClick = (e) => {
        this.setState({
            [e.target.name]: e.target.checked
        });
    }
    render() {
        return (
            <div className="Settings">
                <FormGroup className="userName">
                    <Label>Organizer Name </Label>
                    <Input placeholder="First Name" name="fname" onChange={this.handleChange} id="fname" />
                </FormGroup>
                <FormGroup className="roomName">
                    <Label>Custom Room Name</Label>
                    <Input placeholder={this.state.roomName} name="roomName" onChange={this.handleChange} id="roomName" />
                </FormGroup>
                <div className="qNumber">
                    <Label>Number of Icebreaker Questions</Label>
                    <InputGroup>
                        <Input
                            placeholder="Maximum is 15"
                            name="numQuestions"
                            min={0}
                            max={15}
                            type="number"
                            step="1"
                            onChange={this.handleChange}
                        />
                        <InputGroupAddon addonType="append">Questions</InputGroupAddon>
                    </InputGroup>
                </div>
                <FormGroup>
                    <Label check>
                        <Input type="checkbox" name="toggleAnalysis" onClick={this.onClick} /> Show Analysis
          </Label>
                </FormGroup>
                <FormGroup>
                    <Label check>
                        <Input type="checkbox" name="toggleRanking" onClick={this.onClick} /> Show Ranking
          </Label>
                </FormGroup>
                <Label>Discussion Time (optional)</Label>
                <InputGroup>
                    <Input
                        placeholder="Time"
                        min={0}
                        max={60}
                        name="timer"
                        type="number"
                        step="1"
                        onChange={this.handleChange}
                    />
                    <InputGroupAddon addonType="append">seconds</InputGroupAddon>
                </InputGroup>
                <button onClick={this.handleCreateRoom}></button>
            </div>
        );
    }
}

export default GameManager;
