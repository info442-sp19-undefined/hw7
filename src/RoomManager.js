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
    handleCancel() {
        let uid = this.props.location.uid;
        console.log(uid)
    }
    render() {
        return  (
            <div>
                <button onClick={this.handleCancel} />
            </div>
        );
    }
}

export class UserList extends Component {
    render() {

        return(
            <div id="room">
                <h1>Waiting Room</h1>
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
            <div>
                <h1>{name}</h1>
                <p>Hello, my name is {name} and I am a {descriptor}</p>
            </div>
            <div className="cata" onClick={this.setQuestionDeck}>
                            <img className="cataimg" src={require("./icons/travel.png")} name="travel" alt="travel" />
                        </div>
            </div>
        );        
    }
}

