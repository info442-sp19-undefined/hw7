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
    z
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
            // Remove Error message
            document.getElementById('fname').style.borderColor = "white";
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
                <div id="error"
                    className="alert alert-danger"
                    role="alert">
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
            toggleCustom: false
        }
        this.handleQuestionDeck = this.handleQuestionDeck.bind(this);
        this.handleRandomDeck = this.handleRandomDeck.bind(this);
        this.toggleCustom = this.toggleCustom.bind(this);
        this.setDeck = this.setDeck.bind(this);
        this.parentState = this.props.location.state;
    }

    componentDidMount() {
        // Check file whether file is empty
        if (questionFile.length === 0) {
            alert("An error occured while finding the questions, please try again later or contact the owner of the website");
        }
    }

    setDeck(deck) {
        this.setState({
            questions: deck
        });
    }
    handleQuestionDeck = (e) => {
        let category = e.target.id;
        if (category !== 'random' || category !== 'customized') {
            let deck = Object.entries(this.getQuestions(category));

            if (deck !== undefined) {
                this.setDeck(deck);
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
                    this.setDeck(deck);
                    break;
                }
                count++;
            }
        }
    }

    toggleCustom() {
        this.setState({ toggleCustom: !this.state.toggleCustom });
    }

    render() {
        let isEnabled = (this.state.questions.length !== 0);
        return (
            <div id="category">
                <h1>Categories</h1>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.handleQuestionDeck} id="travel">
                            <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/travel.png")} id="travel" alt="travel" />
                        </div>
                        <h3>Travel</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.handleQuestionDeck} id="food">
                            <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/food.png")} id="food" alt="food" />
                        </div>
                        <h3>Food</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.handleQuestionDeck} id="sports">
                            <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/sports.png")} id="sports" alt="sports" />
                        </div>
                        <h3>Sports</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.handleQuestionDeck} id="music">
                            <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/music.png")} id="music" alt="music" />
                        </div>
                        <h3>Music</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.handleQuestionDeck} id="movies">
                            <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/movie.png")} id="movies" alt="movie" />
                        </div>
                        <h3>Movies</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.handleQuestionDeck} id="books">
                            <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/book.png")} id="books" alt="book" />
                        </div>
                        <h3>Books</h3>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" onClick={this.handleQuestionDeck} id="animals">
                            <img className="cataimg" onClick={this.handleQuestionDeck} src={require("./icons/animal.png")} id="animals" alt="animal" />
                        </div>
                        <h3>Animals</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.handleRandomDeck} id="random">
                            <img className="cataimg" onClick={this.handleRandomDeck} src={require("./icons/random.png")} id="random" alt="random" />
                        </div>
                        <h3>Random</h3>
                    </Col>
                    <Col>
                        <div className="cata" onClick={this.toggleCustom} id="customized">
                            <img className="cataimg" onClick={this.toggleCustom} src={require("./icons/customized.png")} id="customized" alt="customized" />
                        </div>
                        <h3>Custom</h3>
                    </Col>
                </Row>
                <AddQuestion fun={this.setDeck} open={this.state.toggleCustom} toggle={this.toggleCustom}/>
                <ModalQuestions questionList={this.state.questions} max={this.parentState.numQuestions} />
                <Button href="/Room" disabled={isEnabled}>Go to Room</Button>
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
            answer1: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.isDuplicate = this.isDuplicate.bind(this);
        this.handleNewQuestions = this.handleNewQuestions.bind(this);
    }

    handleNewQuestions() {
        let deck = this.state.customDeck;
        if(this.isDuplicate()) {
            // Remove Error message
            document.getElementById(e.target.name).style.borderColor = "inherit";
            document.getElementById('error').style.visibility = "hidden";

            deck.push([{ [this.state.question]:  [this.state.answer1,this.state.answer2] }]);
        } else {
            this.setState({
                question: "",
                answer1: "",
                answer2: ""
            });
            f
            document.getElementById('error').innerHTML = "This is a duplicate question";
            document.getElementById('error').style.visibility = "visible";
            document.getElementById(e.target.name).style.borderColor = "red";
        }

        this.setState({ customDeck: deck });
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
        let deck = Object.keys(Object.entries(this.state.customDeck));
        console.log(deck)
        for (let key in deck) {
            console.log(key)
            console.log(key === this.state.question)
            if(key === this.state.question) {
                return false;
            };
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
                [e.target.name]: e.target.value
            });
        } else {
            this.setState({ [e.target.name]: "" });
            e.target.value = "";
            document.getElementById('error').innerHTML = "Please enter a correct name without symbols.";
            document.getElementById('error').style.visibility = "visible";
            document.getElementById(e.target.name).style.borderColor = "red";
        }
    }

    renderOptions() {
        let data = this.state.customDeck;
        let select = document.getElementById('customQuestion');
        if(select !== null) {
            select.innerHTML = "";
        }

        data.map(obj => {
            let opt = document.createElement('option');
            let entry = Object.entries(obj);
            let key = Object.keys(entry[0][1])
            let values = Object.values(entry[0][1]);
            opt.value = key;
            opt.innerHTML = key + ": " + values;
            select.appendChild(opt);
        });
    }

    render() {
        const closeBtn = <button className="close" onClick={this.props.toggle}>&times;</button>;
        let isEnabled = (this.state.question !== "" && this.state.answer1 !== "" && this.state.answer2 !== "");
        let maxReached = (parseInt(this.props.state.numQuestions) === this.state.customDeck.length);
        this.renderOptions();

        return(
            <div>
                <Modal className="addCustomQuestions" isOpen={this.props.open} toggle={this.props.toggle}>
                    <ModalHeader toggle={this.toggle} close={closeBtn} >Build your own deck of questions!</ModalHeader>
                    <ModalBody>
                        <div className="errorContainer">
                            <div id="error"
                                className="alert alert-danger"
                                role="alert"
                            >
                            </div>
                        </div>
                        <Form>
                            <Row>
                                <Col className="addQuestionContainer" sm={6}>
                                    <Label for="question">Question</Label>
                                    <Input
                                        type="question"
                                        name="question"
                                        id="question"
                                        placeholder={this.state.question}
                                        onChange={this.handleChange}
                                        disabled={maxReached}
                                    />
                                    <Label for="exampleCity">Answer 1</Label>
                                    <Input type="answer1"
                                        name="answer1"
                                        id="answer1"
                                        onChange={this.handleChange}
                                        disabled={maxReached}
                                    />
                                    <Label for="exampleState">Answer 2</Label>
                                    <Input type="answer2"
                                        name="answer2"
                                        id="answer2"
                                        onChange={this.handleChange}
                                        disabled={maxReached}
                                    />
                                    <Button color="success" className="add" onClick={this.handleNewQuestions} disabled={!isEnabled || maxReached}>Add Question</Button>
                                </Col>
                                <Col className="questionListContainer" sm={6}>
                                    <Label for="customQuestion" sm={10} style={{right:"15px", position:"relative"}}>Current List of Questions</Label>
                                    <img className="delete" alt="delete" src={require("./icons/trash.svg")}/>
                                    <Input type="select"
                                        name="Question List"
                                        id="customQuestion"
                                        multiple
                                    >
                                    </Input>
                                </Col>
                            </Row>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.props.fun}>Add to Deck</Button>
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
        questionNumber: 0
      };
      this.toggle = this.toggle.bind(this);
      this.nextQuestion = this.nextQuestion.bind(this);
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

    render() {
        if(this.props.questionList.length !== 0 && this.state.questionNumber < this.props.questionList.length) {
            const entries = this.props.questionList;
            let displayQuestion = entries[this.state.questionNumber];
            let displayQuestionModal = displayQuestion[0];
            let displayButton = entries[this.state.questionNumber][1];
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
