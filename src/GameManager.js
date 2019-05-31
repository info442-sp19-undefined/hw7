import React, { Component } from "react";
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
import { Redirect } from 'react-router-dom';
import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
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
            toggleAnalysis: false,
            created: false
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
        this.setState({ created: true });
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
        let isEnabled = (this.state.fname !== "");
        let button = null;
        if (this.state.created) {
            return <Redirect to={{
                pathname: "/" + this.state.roomName + "/Categories/",
                state: { maxQuestions: this.state.numQuestions }
            }} />
        } else {
            button = (
                <Button
                    onClick={this.handleCreateRoom}
                    disabled={!isEnabled}
                    style={{
                        fontSize: "18px",
                        borderRadius: "20px",
                        width: "200px",
                        height: "2em",
                        background: "#226597",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        padding: "0px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "50px"
                    }} >
                    Create Room
                </ Button>
            )
        }
        return (
            <div>
                <Form id="newRoom-form">
                    <h1 className="header">Settings</h1>
                    <Label style={{ marginTop: "40px" }}> Organizer Name </Label>
                    <Input
                        placeholder="First Name"
                        name="fname"
                        onChange={this.handleChange}
                    id="fname"
                        style={{ width: "300px", borderRadius: "20px", paddingLeft: "24px" }}
                    />
                    <Label style={{ marginTop: "20px" }}>Custom Room Name</Label>
                    <Input
                        placeholder={this.state.roomName}
                        name="roomName"
                        onChange={this.handleChange}
                        id="roomName"
                        style={{ width: "300px", borderRadius: "20px", paddingLeft: "24px" }}
                    />
                    <Label style={{ marginTop: "20px" }}>Number of Icebreaker Questions</Label>
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
                        // style={{width: "20px"}}
                        />
                        <InputGroupAddon addonType="append">Questions</InputGroupAddon>
                    </InputGroup>
                    <Label check style={{ marginTop: "30px", marginLeft: "40px", fontSize: "16px", color: "#226597", fontWeight: "600" }}>
                        <input type="check box"
                            name="toggleAnalysis"
                            onClick={this.onClick}
                        /> Show Analysis
                    </Label>
                    {button}
                </Form>
            </div>
        );
    }
}

export class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
            questions: []
        }
        this.setQuestionDeck = this.setQuestionDeck.bind(this);
    }

    componentDidMount() {
        // Check file whether file is empty
        if (questionFile.length === 0) {
            alert("An error occured while finding the questions, please try again later or contact the owner of the website");
        }
    }

    setQuestionDeck = (e) => {
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
        let isEnabled = (this.state.questions.length !== 0);
        return (
            <div id="category">
                <h1>Categories</h1>
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
                <ModalQuestions questionList={this.state.questions} max={this.props.location.state.maxQuestions}/>
                <Button href="/Room" disabled={isEnabled}>Go to Room</Button>
            </div>
        );
    }
}

class ModalQuestions extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: false
      };
      this.toggle = this.toggle.bind(this);
    }
  
    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }

    render() {
        if(this.props.questionList.length !== 0) {
            const entries = Object.entries(this.props.questionList);
            let displayQuestion = entries[0];
            let displayQuestionModal = displayQuestion[0];
            let values = Object.values(this.props.questionList);
            let displayButton = values[0];
            let displayButton1 = displayButton[0];
            let displayButton2 = displayButton[1];
            return (
                <div>
                  <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{displayQuestionModal}</ModalHeader>
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggle}>{displayButton1}</Button>{' '}
                      <Button color="primary" onClick={this.toggle}>{displayButton2}</Button>{' '}
                      <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                  </Modal>
                </div>
              );
        }
        return(
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <p>Organizer has not posted question yet</p>
                </Modal>
            </div>
        )
    }
  }