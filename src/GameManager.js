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
const questionFile = require("./questions.json");
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

    handleChange(e) {
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

    onClick(e) {
        this.setState({
            [e.target.name]: e.target.checked
        });
    }
    render() {
        let isEnabled = (this.state.fname === "");
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
                <Button onClick={this.handleCreateRoom}>Add player</Button>
                <Button href="/Categories">Set Categories</Button>
            </div>
        );
    }
}

export class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questions:[]
        }
        this.setQuestionDeck = this.setQuestionDeck.bind(this);
    }

    componentDidMount() {
        // Check file whether file is empty
        if (questionFile.length === 0) {
            alert("An error occured while finding the questions, please try again later or contact the owner of the website");
        }
    }

    setQuestionDeck(e) {
        let deck = this.getQuestions(e.target.name);
        if (deck !== undefined) {
            this.setState({
                questions: deck
            });
        } else {
            alert("An error occured while finding the questions, please try again later or contact the owner of the website");
        }
    }

    getQuestions(category) {
        for (let questionSet of questionFile) {
            if (questionSet.category === category) {
                return questionSet.questions;
            }
        }
        return undefined;
    }

    render() {
        let isEnabled = (this.state.questions !== []);
        return (
            <div>
                <h1>Categories</h1>
                <Row>
                    <Col>
                        <div>
                            <div>
                                <img onClick={this.setQuestionDeck} src={require("./icons/travel.png")} name="travel" alt="travel"/>
                            </div>
                            <p>Travel</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <img onClick={this.setQuestionDeck} src={require("./icons/food.png")} name="food" alt="food" />
                            </div>
                            <p>Food</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <img onClick={this.setQuestionDeck} src={require("./icons/sports.png")} name="sports" alt="sports" />
                            </div>
                            <p>Sports</p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <div>
                                <img onClick={this.setQuestionDeck} src={require("./icons/music.png")} name="music" alt="music"/>
                            </div>
                            <p>Music</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <img onClick={this.setQuestionDeck} src={require("./icons/movie.png")} name="movie" alt="movie" />
                            </div>
                            <p>Movies</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <img onClick={this.setQuestionDeck} src={require("./icons/book.png")} name="book" alt="book" />
                            </div>
                            <p>Books</p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <div>
                                <img onClick={this.setQuestionDeck} src={require("./icons/animal.png")} name="animal" alt="animal" />
                            </div>
                            <p>Animals</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <img id="random" onClick={this.setQuestionDeck} src={require("./icons/random.png")} name="random" alt="random" />
                            </div>
                            <p>Random</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <div>
                                <img id="customized" onClick={this.setQuestionDeck} src={require("./icons/customized.png")} name="customized" alt="customized" />
                            </div>
                            <p>Customize</p>
                        </div>
                    </Col>
                </Row>
                <Button href="/Room" disabled={isEnabled}>Go to Room</Button>
            </div>
        );
    }
}
