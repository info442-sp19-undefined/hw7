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
    Form,
    Modal,
    ModalHeader,
    ModalFooter
} from "reactstrap";
import { Redirect } from 'react-router-dom';
const questionFile = require("./questions.json");
export class GameManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "First Name",
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
        this.setState({ uid: this.props.data.uid, roomName: "Room-" + this.props.data.uid });
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

    isValid(str, field) {
        if ( field === 'fname' && /^[a-zA-Z ]+$/.test(str)) {
          return true;
        } else if (field === 'roomName') {
            return true;
        }
        return false;
    }
    
    handleChange = (e) => {
        // Check the inputs are valid
        if (this.isValid(e.target.value, e.target.name)) {
            document.getElementById('fname').style.borderColor = "white";
            let str = e.target.value.replace(/ /g, '_');
            this.setState({
                [e.target.name]: str
            });
        } else {
            this.setState({ fname: "" });
            e.target.value = "";
            document.getElementById('error').innerHTML = "Please enter a correct name without symbols.";
            document.getElementById('error').style.visibility = "visible";
            document.getElementById('fname').style.borderColor = "red";
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
            return <Redirect push to={{pathname: "/" + this.state.roomName + "/Categories/", state: this.state}} />;
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
                    <div id="error"
                        className="alert alert-danger"
                        role="alert"
                        style={{ visibility: "hidden" }}>    
                    </div>
                    <h1 className="header">Settings</h1>
                    <Label style={{marginTop: "40px"}}> Organizer Name </Label>
                    <Input 
                        placeholder={this.state.fname} 
                        name="fname" 
                        onChange={this.handleChange} 
                        id="fname" 
                        style={{ width: "300px", borderRadius: "20px", paddingLeft: "24px" }} 
                    />
                    <Label style={{marginTop: "20px"}}>Custom Room Name</Label>
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
                            placeholder={this.state.numQuestions}
                            name="numQuestions"
                            min={1}
                            max={15}
                            type="number"
                            step="1"
                            defaultValue={5}
                            onChange={this.handleChange}
                        />
                        <InputGroupAddon addonType="append">Questions</InputGroupAddon>
                     </InputGroup>
                    <Label check style={{marginTop: "30px", marginLeft: "40px", fontSize: "16px", color: "#226597", fontWeight: "600"}}>
                        <input type="checkbox" 
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
        super(props);
        this.state = {
            questions: [],
            custom: false
        }
        this.setQuestionDeck = this.setQuestionDeck.bind(this);
        this.parentState = this.props.location.state;
    }

    componentDidMount() {
        // Check file whether file is empty
        if (questionFile.length === 0) {
            alert("An error occured while finding the questions, please try again later or contact the owner of the website");
        }
    }

    setQuestionDeck = (e) => {
        let category = e.target.id;
        if (category !== 'random' || category !== 'customized') {
            let deck = this.getQuestions(category);
            if (deck !== undefined) {
                this.setState({
                    questions: deck
                });
            } else {
                alert("An error occured while finding the questions, please try again later or contact the owner of the website");
            }
        } else {
            this.setState({ custom: true });
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

    addToDeck() {
        this.state.questions.push("hi");
    }
    render() {
        let isEnabled = (this.state.questions.length !== 0);
        return (
            <div id="category">
                <h1>Categories</h1>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="travel">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/travel.png")} id="travel" alt="travel" />
                        </div>
                        <h3>Travel</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="food">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/food.png")} id="food" alt="food" />
                        </div>
                        <h3>Food</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="sports">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/sports.png")} id="sports" alt="sports" />
                        </div>
                        <h3>Sports</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="music">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/music.png")} id="music" alt="music" />
                        </div>
                        <h3>Music</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="movies">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/movie.png")} id="movies" alt="movie" />
                        </div>
                        <h3>Movies</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="books">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/book.png")} id="books" alt="book" />
                        </div>
                        <h3>Books</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="animals">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/animal.png")} id="animals" alt="animal" />
                        </div>
                        <h3>Animals</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="random">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/random.png")} id="random" alt="random" />
                        </div>
                        <h3>Random</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.setQuestionDeck} id="customized">
                            <img className="cataimg" onClick={this.setQuestionDeck} src={require("./icons/customized.png")} id="customized" alt="customized" />
                        </div>
                        <h3>Custom</h3>
                    </Col>
                </Row>
                <ModalQuestions questionList={this.state.questions} max={this.parentState.numQuestions} />
                <Button href="/Room" disabled={isEnabled}>Go to Room</Button>
            </div>
        );
    }
}
class ModalQuestions extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: false,
        questionNumber: 0
      };
      this.toggle = this.toggle.bind(this);
    }

    // this.props.max is the max number of questions
    // this.props.questionList is the list of questions to display
  
    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }

    nextQuestion() {
        console.log("did the question number increase?");
        console.log(this.state.questionNumber);
        let num = this.state.questionNumber;
        this.setState({ questionNumber: num + 1});
        console.log(this.state.questionNumber);
    }

    render() {
        if(this.props.questionList.length !== 0) {
            const entries = Object.entries(this.props.questionList);
            let displayQuestion = entries[this.state.questionNumber];
            let displayQuestionModal = displayQuestion[this.state.questionNumber];
            let values = Object.values(this.props.questionList);
            let displayButton = values[this.state.questionNumber];
            let displayButton1 = displayButton[this.state.questionNumber];
            let displayButton2 = displayButton[this.state.questionNumber + 1];
            return (
                <div>
                  <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{displayQuestionModal}</ModalHeader>
                    <ModalFooter>
                      <Button color="primary" onClick={this.toggle}>{displayButton1}</Button>{' '}
                      <Button color="primary" onClick={this.toggle}>{displayButton2}</Button>{' '}
                      <Button color="primary" onClick={this.nextQuestion}>Next Question</Button>{' '}
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