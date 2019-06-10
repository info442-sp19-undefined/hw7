import React, { Component } from "react";
import firebase from "firebase/app";
import "./css/room.css";
import { Button} from "reactstrap";

export class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      readyToStart: false
    };

    this.parentState = this.props.location.state;
    this.handleStart = this.handleStart.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleCancel() {
        let roomRef = firebase.database().ref("Rooms").child(this.parentState.uid);
        roomRef.set({
            game_active: false
        });
  }

  handleStart() {
    let roomRef = firebase.database().ref('Rooms');
    roomRef.orderByChild('uid').equalTo(this.parentState.uid).limitToFirst(1).once("value", snapshot => {
      if (snapshot.child('players').numChildren() >= 1) {
        this.setState({
            readyToStart: true
        });
      } else {
        console.log("less than one player")
        document.getElementById('error').innerHTML = "Can't start the game when you only have 1 player!";
        document.getElementById('error').style.visibility = "visible";
      }
    })
  }

  render() {
    let isEnabled = this.state.uid !== "" && this.state.fname !== "";
    return(
      <div>
        <div className="errorContainer">
              <div id="error"
                className="alert alert-danger"
                  role="alert"
                  style={{ visibility: 'hidden' }}
              >
            </div>
        </div>
        <Button onClick={this.handleStart} disabled={!isEnabled}>
          <ModalQuestions questionList={this.parentState.questions} max={this.parentState.numQuestions} uid={this.parentState.uid} />
        </Button>
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
      this.addToFire = this.addToFire.bind(this);
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
      this.setState({ questionNumber: num });
  }

  handleAnswers(question, answer1, answer2, gotClicked) {
      //this.incrementCount(gotClicked);
      let roomRef = firebase.database().ref("Rooms").child(this.props.uid).child("analysis");
      roomRef.once("value").then(function(snapshot){
          let key = snapshot.val();
          let n = 0;
          const randomKeys = Object.keys(key);
          while(n < randomKeys.length) {
              if(key[randomKeys[n]]["questionAsked"] === question) {
                  console.log("is it true");
                  break;
              } else {
                  n = n + 1;
              }
          }

          let questionRef = roomRef.child(randomKeys[n]);
          
          if(gotClicked === 1) {
              let number = key[randomKeys[n]]["answerOneCount"] + 1;
              questionRef.update({
                  answerOneCount: number

              })
          } else {
              let number = key[randomKeys[n]]["answerTwoCount"] + 1;
              questionRef.update({
                  answerTwoCount: number
              })
          }
      })
  }

  incrementCount(target) {
      if (target === 1) {
          let newNum = this.state.answer1Count + 1;
          this.setState({
              answer1Count: newNum
          });
      }
      let newNum = this.state.answer2Count + 1;
      this.setState({
          answer2Count: newNum
      });
  }

  addToFire() {
      let n = 0;
      let roomRef = firebase.database().ref("Rooms").child(this.props.uid);
      while (n < this.props.max) {
          let entries = this.props.questionList;
          let displayQuestion = entries[n];
          let displayQuestionModal = displayQuestion[0];
          let displayButton = displayQuestion[1];
          let displayButton1 = displayButton[0];
          let displayButton2 = displayButton[1];
          roomRef.child("analysis").push({
              questionAsked: displayQuestionModal,
              answerOne: displayButton1,
              answerTwo: displayButton2,
              answerOneCount: 0,
              answerTwoCount: 0
          });
          n = n + 1;
      }
  }


  render() {
      if (this.props.questionList.length !== 0 && this.state.questionNumber < this.props.questionList.length) {
          this.addToFire();
          let entries = this.props.questionList;
          let displayQuestion = entries[this.state.questionNumber];
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
      return (
          <div>
              <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <p>Organizer has not posted question yet</p>
              </Modal>
          </div>
      )
  }
}