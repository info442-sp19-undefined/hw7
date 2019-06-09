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

export class RoomManager extends Component {
    constructor(props){
        super(props);
        this.state = {
            show: false
        }
        this.parentState = this.props.location.state;
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleCancel() {
        let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid);
        roomRef.set({
            game_active: false
        });
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

