import React, { Component } from 'react';
import firebase from 'firebase/app';
let uniqid = require('uniqid');

class GameManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    generateRoomId() {
        return uniqid();
    }

    handleCreateRoom(organizer, category, settings) {
        let uid = this.generateRoomId()
        let roomRef = firebase.database().ref('Rooms').push();
        roomRef.set({
            roomId: uid,
            room_name: "Room-" + uid,
            organizer: organizer,
            category: category,
            settings: settings
        });
        return uid;
    }

    handleJoin(player, id) {

    }

    render() {
        return (
             <div>
        Coming Soon!
            </div>
        );
    }
}

export default GameManager;