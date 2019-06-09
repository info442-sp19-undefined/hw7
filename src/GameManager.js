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
    ModalFooter,
    ModalBody
} from "reactstrap";
import { Redirect } from 'react-router-dom';
const questionFile = require("./questions.json");
const MAX_QUESTIONS = 15;
const MIN_QUESTIONS = 1;

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
            },
            analysis: {
                placeholder: "Placeholder"
            }
        });
        this.setState({ created: true });
    }

    isValid(str, field) {
        if ( field === 'fname' && /^[a-zA-Z ]+$/.test(str)) {
          return true;
        } else if (field === 'roomName') {
            return true;
        } else if (str === "") {
            return true;
        }
        return false;
    }
    
    handleChange = (e) => {
        // Check the inputs are valid
        if (this.isValid(e.target.value, e.target.name)) {
            // Remove Error message
            document.getElementById('fname').style.borderColor = "grey";
            document.getElementById('error').style.visibility = "hidden";

            let str = e.target.value.replace(/ /g, '_');
            this.setState({
                [e.target.name]: str
            });
        } else if(e.target.name === 'numQuestions') {
            this.setState({
                [e.target.name]: e.target.value
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
                <div className="errorContainer">
                    <div id="error"
                        style={{visibility: 'hidden'}}
                        className="alert alert-danger"
                        role="alert">
                    </div>
                </div>
                <Form id="newRoom-form">
                    <h1 className="header">Settings</h1>
                    <Label style={{marginTop: "40px"}}> Organizer Name </Label>
                    <Input
                        placeholder={this.state.fname}
                        name="fname"
                        onChange={this.handleChange}
                        id="fname"
                        style={{ borderRadius: "20px", paddingLeft: "24px" }}
                    />
                    <Label style={{marginTop: "20px"}}>Custom Room Name</Label>
                    <Input
                        placeholder={this.state.roomName}
                        name="roomName"
                        onChange={this.handleChange}
                        id="roomName"
                        style={{ borderRadius: "20px", paddingLeft: "24px" }}
                    />
                    <Label style={{ marginTop: "20px" }}>Number of Icebreaker Questions</Label>
                    <InputGroup>
                        <Input
                            placeholder={this.state.numQuestions}
                            name="numQuestions"
                            min={MIN_QUESTIONS}
                            max={MAX_QUESTIONS}
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
            toggleCustom: false,
            go:false,
            selected: ""
        }

        this.handleRandomDeck = this.handleRandomDeck.bind(this);
        this.toggleCustom = this.toggleCustom.bind(this);
        this.redirect = this.redirect.bind(this);
        this.setDeck = this.setDeck.bind(this);
        this.parentState = this.props.location.state;
    }

    componentDidMount() {
        // Check file whether file is empty
        if (questionFile.length === 0) {
            alert("An error occured while finding the questions, please try again later or contact the owner of the website");
        }
    }

    setDeck(deck, category) {
        this.setState({
            questions: deck,
            selected: category
        });
    }

    handleQuestionDeck = (e) => {
        let category = e.target.id;
        let deck = Object.entries(this.getQuestions(category));

        if (deck !== undefined) {
            let max = parseInt(this.parentState.numQuestions);
            let questionDeck = [];
            for (let obj of deck) {
                questionDeck.push(obj);

                if (questionDeck.length === max) {
                    this.setDeck(questionDeck, category);
                    break;
                }
            }
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

    handleRandomDeck() {
        let max = parseInt(this.parentState.numQuestions);
        let deck = [];

        for (let category of questionFile) {
            let questionDeck = Object.entries(category.questions);
            let randomTotal = Math.floor(Math.random() * (4 - 1) + 1);
            let count = 0;

            while(count <= randomTotal && deck.length !== max) {
                let index = Math.floor(Math.random() * 15);

                if (!deck.includes(questionDeck[index])) {
                    deck.push(questionDeck[index])
                } else {
                    deck.push(questionDeck[index + 1 % 2])
                }

                // Check deck has correct number of questions and prevent from adding more questions
                if (deck.length === max) {
                    this.setDeck(deck, "random");
                    break;
                }
                count++;
            }
        }
    }

    toggleCustom() {
        this.setState({ toggleCustom: !this.state.toggleCustom });
    }

    redirect() {
        this.setState({ go: !this.state.go });
    }

    render() {
        let isEnabled = (this.state.questions.length === 0);
        let goButton = null;
        if (this.state.go) {
            return <Redirect push to={{pathname: "/" + this.parentState.roomName + "/Room/", uid: this.parentState.uid, deck:this.state.questions}} />;
        } else {
            goButton = (
                <button className="goToRoom" disabled={isEnabled} onClick={this.redirect}>
                    Go to Room
                </button>
            );
        }

        return (
            <div id="category">
                <h1>Categories</h1>
                <Row>
                    <Col>
                        <div id={this.state.selected === "travel" ? "selected": "travel"}>
                            <div className="cata" onClick={this.handleQuestionDeck} id="travel">
                                <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/travel.png")} id="travel" alt="travel" />
                            </div>
                        </div>
                        <h3>Travel</h3>
                    </Col>
                    <Col>
                        <div id={this.state.selected === "food" ? "selected": "food"}>
                            <div className="cata" onClick={this.handleQuestionDeck} id="food">
                                <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/food.png")} id="food" alt="food" />
                            </div>
                        </div>
                        <h3>Food</h3>
                    </Col>
                    <Col>
                        <div id={this.state.selected === "sports" ? "selected" : "sports"}>
                            <div className="cata" onClick={this.handleQuestionDeck} id="sports">
                                <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/sports.png")} id="sports" alt="sports" />
                            </div>
                        </div>
                        <h3>Sports</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div id={this.state.selected === "music" ? "selected" : "music"}>
                            <div className="cata" onClick={this.handleQuestionDeck} id="music">
                                <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/music.png")} id="music" alt="music" />
                            </div>
                        </div>
                        <h3>Music</h3>
                    </Col>
                    <Col>
                        <div id={this.state.selected === "movies" ? "selected" : "movies"}>
                            <div className="cata" onClick={this.handleQuestionDeck} id="movies">
                                <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/movie.png")} id="movies" alt="movie" />
                            </div>
                        </div>
                        <h3>Movies</h3>
                    </Col>
                    <Col>
                        <div id={this.state.selected === "books" ? "selected" : "books"}>
                            <div className="cata" onClick={this.handleQuestionDeck} id="books">
                                <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/book.png")} id="books" alt="book" />
                            </div>
                        </div>
                        <h3>Books</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div id={this.state.selected === "animals" ? "selected" : "animals"}>
                            <div className="cata" onClick={this.handleQuestionDeck} id="animals">
                                <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/animal.png")} id="animals" alt="animal" />
                            </div>
                        </div>
                        <h3>Animals</h3>
                    </Col>
                    <Col>
                        <div id={this.state.selected === "random" ? "selected" : "random"}>
                            <div className="cata" onClick={this.handleRandomDeck} id="random">
                                <img className="cataimg" onClick={this.handleRandomDeck} src={require("./icons/random.png")} id="random" alt="random" />
                            </div>
                        </div>
                        <h3>Random</h3>
                    </Col>
                    <Col>
                        <div id={this.state.selected === "customized" ? "selected" : "customized"}>
                            <div className="cata" onClick={this.toggleCustom} id="customized">
                                <img className="cataimg" onClick={this.toggleCustom} src={require("./icons/customized.png")} id="customized" alt="customized" />
                            </div>
                        </div>
                        <h3>Custom</h3>
                    </Col>
                </Row>
                <AddQuestion fun={this.setDeck} open={this.state.toggleCustom} toggle={this.toggleCustom} state={this.parentState}/>
                <ModalQuestions questionList={this.state.questions} max={this.parentState.numQuestions} uid={this.parentState.uid}/>
                {goButton}
            </div>
        );
    }
}

class AddQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customDeck: [],
            question: "",
            answer2: "",
            answer1: "",
            selected: ""
        };
        
        this.removeQuestion = this.removeQuestion.bind(this);
        this.setDeck = this.setDeck.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNewQuestions = this.handleNewQuestions.bind(this);
        this.handleSelected = this.handleSelected.bind(this);
    }

    handleNewQuestions() {
        let deck = this.state.customDeck;
        if(this.isDuplicate()) {
            // Remove Error message
            document.getElementById('error').style.visibility = "hidden";
            deck.push([this.state.question, [this.state.answer1, this.state.answer2]]);
            document.getElementById("message").innerHTML = "You have " + (parseInt(this.props.state.numQuestions) - this.state.customDeck.length) + " questions to make!";
        } else {
            this.setState({
                question: "",
                answer1: "",
                answer2: ""
            });
            document.getElementById('addForm').reset();
            document.getElementById('error').innerHTML = "This is a duplicate question";
            document.getElementById('error').style.visibility = "visible";
        }

        this.setState({
            customDeck: deck,
            question: "",
            answer1: "",
            answer2: ""
        });
        document.getElementById('addForm').reset();
        this.renderOptions();
    }

    isValid(str) {
        if (/^[a-zA-Z0-9? ]+$/.test(str)) {
          return true;
        } else if (str === "") {
            return true;
        }
        return false;
    }

    isDuplicate() {
        let deck = this.state.customDeck;

        if (deck.length !== 0) {
            for (let obj of deck) {
                if (obj[0] === this.state.question) {
                    return false;
                }
            }
        }
        return true;
    }

    handleChange = (e) => {
        // Check the inputs are valid
        if (this.isValid(e.target.value)) {
            // Remove Error message
            document.getElementById(e.target.name).style.borderColor = "inherit";
            document.getElementById('error').style.visibility = "hidden";

            this.setState({
                [e.target.name]: e.target.value.trim()
            });
        } else {
            this.setState({ [e.target.name]: "" });
            e.target.value = "";
            document.getElementById('error').innerHTML = "Please enter a correct name without symbols.";
            document.getElementById('error').style.visibility = "visible";
            document.getElementById(e.target.name).style.borderColor = "red";
        }
    }

    handleSelected = (e) => {
        this.setState({
            selected: e.target.value
        });
    }

    renderOptions() {
        let data = this.state.customDeck;
        let select = document.getElementById('customQuestion');
        if(select !== null) {
            select.innerHTML = "";
        }

        for(let obj of data) {
            let opt = document.createElement('option');
            let key = obj[0];
            let val = obj[1];
            opt.value = key;
            opt.selected = this.state.selected === opt.value;
            opt.innerHTML = key + ": " + val;
            select.appendChild(opt);
        }
    }

    removeQuestion() {
        let deck = this.state.customDeck;
        for (let entry of deck) {
            if (entry[0] === this.state.selected) {
                deck.splice(entry[0], 1);
           }
        }
        this.renderOptions();
        document.getElementById("message").innerHTML = "You have " + (parseInt(this.props.state.numQuestions) - this.state.customDeck.length) + " questions to make!";
    }

    setDeck() {
        this.props.fun(this.state.customDeck, "customized");
        this.props.toggle();
        this.setState({
            customDeck: []
        });
    }

    render() {
        const closeBtn = <button className="close" onClick={this.props.toggle}>&times;</button>;
        let isEnabled = (this.state.question !== "" && this.state.answer1 !== "" && this.state.answer2 !== "");
        let maxReached = (parseInt(this.props.state.numQuestions) === this.state.customDeck.length);
        return(
            <div>
                <Modal className="addCustomQuestions" isOpen={this.props.open} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.toggle} close={closeBtn} >Build your own deck of questions!</ModalHeader>
                    <ModalBody>
                        <div className="errorContainer">
                            <div id="error"
                                className="alert alert-danger"
                                role="alert"
                                style={{ visibility: 'hidden' }}
                            >
                            </div>
                        </div>
                        <h2 id="message">You have {parseInt(this.props.state.numQuestions) - this.state.customDeck.length} questions to make!</h2>
                        <Form id="addForm">
                            <Row>
                                <Col className="addQuestionContainer" sm={6}>
                                    <Label for="question">Question</Label>
                                    <Input
                                        type="question"
                                        name="question"
                                        id="question"
                                        placeholder={this.state.question}
                                        onChange={this.handleChange}
                                    />
                                    <Label for="exampleCity">Answer 1</Label>
                                    <Input type="answer1"
                                        name="answer1"
                                        id="answer1"
                                        onChange={this.handleChange}
                                    />
                                    <Label for="exampleState">Answer 2</Label>
                                    <Input type="answer2"
                                        name="answer2"
                                        id="answer2"
                                        onChange={this.handleChange}
                                    />
                                    <Button color="success" className="add" onClick={this.handleNewQuestions} disabled={!isEnabled || maxReached}>Add Question</Button>
                                </Col>
                                <Col className="questionListContainer" sm={6}>
                                    <Label for="customQuestion" sm={10} style={{right:"40px", position:"relative"}}>Current List of Questions</Label>
                                    <img className="delete" alt="delete" onClick={this.removeQuestion} src={require("./icons/trash.svg")}/>
                                    <Input type="select"
                                        name="Question List"
                                        id="customQuestion"
                                        multiple
                                        onChange={this.handleSelected}
                                    >
                                    </Input>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.setDeck} disabled={!maxReached}>Add to Deck</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

class ModalQuestions extends Component {
    constructor(props) {
      super(props);
      this.state = {
        modal: false,
        questionNumber: 0,
        answer1Count: 0,
        answer2Count: 0
      };
      this.toggle = this.toggle.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
      this.incrementCount = this.incrementCount.bind(this);
    }

    // this.props.max is the max number of questions
    // this.props.questionList is the list of questions to display
    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }

    nextQuestion() {
        let num = this.state.questionNumber + 1;
        this.setState({ questionNumber: num});
    }

    handleAnswers(question, answer1, answer2, gotClicked) {
        console.log("in handle answers");
        console.log("what is the question", question);
        console.log("what is the first answer", answer1);
        console.log("what is the second answer", answer2);
        console.log("who got clicked on?", gotClicked);
        this.incrementCount(gotClicked);
        let roomRef = firebase.database().ref("Rooms").child(this.props.uid);
        roomRef.set({
            analysis: {
                questionAsked: question,
                answerOne: answer1,
                answerTwo: answer2,
                answerOneCount: this.state.answer1Count,
                answerTwoCount: this.state.answer2Count
            }
        });
    }

    incrementCount(target) {
        if (target === 1) {
            let prevState = this.state.answer1Count++;
            this.setState(prevState=>({
                answer1Count: prevState
            }));
        } 
        this.setState(prevState=>({
            answer2Count: prevState.answer2Count++
        }));
    }

    render() {
        if(this.props.questionList.length !== 0 && this.state.questionNumber < this.props.questionList.length) {
            let entries = this.props.questionList;
            console.log("what are the entries");
            console.log(entries);
            let displayQuestion = entries[this.state.questionNumber];
            console.log("what is displayQuestion", displayQuestion);
            let displayQuestionModal = displayQuestion[0];
            let displayButton = displayQuestion[1];
            let displayButton1 = displayButton[0];
            let displayButton2 = displayButton[1];
            return (
                <div>
                  <Button color="danger" onClick={this.toggle}>{this.props.buttonLabel}</Button>
                  <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{displayQuestionModal}</ModalHeader>
                    <ModalFooter>
                      <Button color="primary" onClick={() => this.handleAnswers(displayQuestionModal, displayButton1, displayButton2, 1)}>{displayButton1}</Button>{' '}
                      <Button color="primary" onClick={() => this.handleAnswers(displayQuestionModal, displayButton1, displayButton2, 2)}>{displayButton2}</Button>{' '}
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