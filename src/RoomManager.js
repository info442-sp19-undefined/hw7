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

}