import React, { Component } from "react";
import firebase from "firebase/app";
import './css/room.css';
import {
    FormGroup,
    InputGroup,
    InputGroupAddon,
    Input,
    Label,
    Button,
    Col,
    Row
} from "reactstrap";
const uniqid = require("uniqid");

export class GameManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            uid: "",
            roomName: "",
            numQuestions: 5,
            toggleAnalysis: false
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
                showAnalysis: this.state.toggleAnalysis
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
        let isEnabled = (this.state.fname !== "" || this.state.numQuestions !== 0);
        return (
            <div className="Settings">
                <h1 className="header">Settings</h1>
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
                            defaultValue={5}
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
                <a href="/Categories">
                    <Button onClick={this.handleCreateRoom} disabled={!isEnabled}>Next</Button>
                </a>
            </div>
        );
    }
}

export class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category: "",
            questions:[]
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        this.setState({
            category: e.target.name,
            questions: []
        });
        this.getQuestions();
    }

    getQuestions() {
        fetch('../src/questions.json').then(function (response) {
            console.log("does it go in the first bit");
            return response.text();
        }).then(function(data) {
            console.log("does it go in the second bit");
            console.log(data);
            this.setState({questions:data});
            return data;
        }).catch(function(error) {
            //function to catch the error if the questions is not loaded
            alert("An error occured while finding the questions, please try again later or contact the owner of the website");
            console.log(error);
        })
    }

    render() {
        return (
            <div>
                <h1>Categories</h1>
                <Row>
                    <Col>
                        <div>
                            <p>Travel</p>
                            <img onClick={this.handleChange} src={require("./icons/travel.png")} name="travel" alt="travel" />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <p>Food</p>
                            <img onClick={this.handleChange} src={require("./icons/food.png")} name="food" alt="food" />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <p>Sports</p>
                            <img onClick={this.handleChange} src={require("./icons/sports.png")} name="sports" alt="sports" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <p>Music</p>
                            <img onClick={this.handleChange} src={require("./icons/music.png")} name="music" alt="music" />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <p>Movies</p>
                            <img onClick={this.handleChange} src={require("./icons/movie.png")} name="movie" alt="movie" />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <p>Books</p>
                            <img onClick={this.handleChange} src={require("./icons/book.png")} name="book" alt="book" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <p>Animals</p>
                            <img onClick={this.handleChange} src={require("./icons/animal.png")} name="animal" alt="animal" />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <p>Random</p>
                            <img id="random" onClick={this.handleChange} src={require("./icons/random.png")} name="random" alt="random" />
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <p>Customize</p>
                            <img id="customized" onClick={this.handleChange} src={require("./icons/customized.png")} name="customized" alt="customized" />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
