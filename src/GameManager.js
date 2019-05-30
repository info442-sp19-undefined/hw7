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
    Row,
    Form
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
            <div>
                <Form id="join-form">
                    <h1 className="header">Settings</h1>
                    
                    <Label style={{marginTop: "40px"}}> Organizer Name </Label>
                    <Input 
                        placeholder="First Name" 
                        name="fname" 
                        onChange={this.handleChange} 
                        id="fname" 
                        style={{ width: "320px", borderRadius: "20px", paddingLeft: "24px" }} 
                    />
                    
                    
                    <Label style={{marginTop: "20px"}}>Custom Room Name</Label>
                    <Input 
                        placeholder={this.state.roomName} 
                        name="roomName" 
                        onChange={this.handleChange} 
                        id="roomName" 
                        style={{ width: "100%", borderRadius: "20px", paddingLeft: "24px" }} 
                    />
                    
                    
                    <Label style={{marginTop: "20px"}}>Number of Icebreaker Questions</Label>
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
                   
                    
                    <Label check style={{marginTop: "30px", marginLeft: "40px", fontSize: "16px", color: "#226597", fontWeight: "600"}}>
                            <Input type="checkbox" 
                            name="toggleAnalysis" 
                            onClick={this.onClick} 
                            /> Show Analysis
                    </Label>

                    <div>
                    <a href="/Categories"> 
                        <Button 
                            onClick={this.handleCreateRoom} 
                            disabled={!isEnabled}
                            style={{ fontSize: "18px", borderRadius: "20px", width: "200px", height: "2em", 
                            background: "#226597", color: "white", display: "flex",
                            justifyContent: "center", padding: "0px", marginLeft: "auto", marginRight: "auto",  marginTop: "50px"}} 

                        >
                            Create Room
                        </Button>
                    </a>
                    </div> 
                </Form>
            </div>
        );
    }
}

export class Categories extends Component {
    constructor(props) {
        super(props)
        this.state = {
            category: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        this.setState({
            category: e.target.name
        });
    }
    render() {
        return (
            <div>
                <h1>Categories</h1>
                <Row>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/travel.png")} name="travel" alt="travel" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/food.png")} name="food" alt="food" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/sports.png")} name="sports" alt="sports" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/music.png")} name="music" alt="music" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/movie.png")} name="movie" alt="movie" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/book.png")} name="book" alt="book" />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" onClick={this.handleChange} src={require("./icons/animal.png")} name="animal" alt="animal" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" id="random" onClick={this.handleChange} src={require("./icons/random.png")} name="random" alt="random" />
                        </div>
                    </Col>
                    <Col>
                        <div className="cata" >
                            <img className="cataimg" id="customized" onClick={this.handleChange} src={require("./icons/customized.png")} name="customized" alt="customized" />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}
