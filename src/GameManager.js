import React, { Component } from 'react';
import firebase from 'firebase/app';

class GameManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    generateRoomId() {
        return 10000000 + Math.floor(Math.random() * 90000000);
    }

    createRoom(organizer, category, settings) {
        let roomId = this.generateRoomId();
        let roomRef = firebase.database().ref('Rooms').child('Room' + roomId);
        
        roomRef.set({
            roomId: roomId,
            room_name: "Room" + roomId,
            organizer: organizer,
            category: category,
            settings: settings
        });
    }
    render() {
        // Dummy test
        this.createRoom("Marie", "sports", {Analysis:true , Timer: 60});

        return(
            <div>
                Coming Soon!
            </div>
        );
    }
}

export default GameManager;