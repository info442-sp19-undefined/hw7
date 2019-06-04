import React, {
    Component
} from "react";
import firebase from "firebase/app";
import './css/room.css';
import {
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Button,
    Col,
    Row,
    Form
} from "reactstrap";
import {
    Redirect
} from 'react-router-dom';
const uniqid = require("uniqid");
const questionFile = require("./questions.json");

export class RoomManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // fname: "First Name",
            // uid: "",
            // roomName: "",
            // numQuestions: 5,
            // toggleAnalysis: false,
            // created: false
        };
        this.parentState = this.props.location.state;
    }

    handleWaitingRoom() {
        let roomRef = this.parentState.uid;
        roomRef.set({
            organizer: this.state.fname,
            uid: this.state.uid,
            room_name: this.state.roomName,
            settings: {
                Number_Questions: this.state.numQuestions,
                showAnalysis: this.state.toggleAnalysis
            }
        });
        this.setState({
            created: true
        });
    }

    render() {
        
        
    }
}

export class UserList extends Component {
    render() {

        return(
            <div id="room">
            <h1>Waiting Room: {this.parentState.roomName}</h1>
                <h2>Organizer</h2>
                    <Row>
                        <Col>
                            <div className="player" onClick={this.setQuestionDeck}>
                                <img className="cataimg" src={require("./icons/travel.png")} name="travel" alt="travel" />
                            </div>
                        </Col>
                    </Row>
                <h2>Player</h2>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/travel.png")} name="travel" alt="travel" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/food.png")} name="food" alt="food" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/sports.png")} name="sports" alt="sports" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/music.png")} name="music" alt="music" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/movie.png")} name="movie" alt="movie" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/book.png")} name="book" alt="book" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/animal.png")} name="animal" alt="animal" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" id="random" src={require("./icons/random.png")} name="random" alt="random" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" id="customized" src={require("./icons/customized.png")} name="customized" alt="customized" />
                        </div>
                    </Col>
                </Row>
                <Button href="/In-game" disabled={isEnabled}>Start Game >>></Button>
            </div>

        );
    }
}

export class UserInfo extends Component {
    let 

    render() {
        //This is an everyday function; you can include any code you want here
        let name = "Ethel";
        let descriptor = "Aardvark";

        //Return a React element (JSX) that is how the component will appear
        return (
            <div>
                <h1>{name}</h1>
                <p>Hello, my name is {name} and I am a {descriptor}</p>
            </div>
            <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/travel.png")} name="travel" alt="travel" />
                        </div>
        );        
    }
}

