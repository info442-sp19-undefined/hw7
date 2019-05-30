import React, { Component } from 'react';
import './css/App.css';
import { GameManager, Categories } from './GameManager';
import JoinRoom from './JoinRoom';
import { Route, Switch, Redirect } from 'react-router-dom';

// To do later: loading spin
class App extends Component {
    render() {
    //Home 
    let Home = () => {
        return  (
            <div className="main">
                <h1>Dive-In!</h1>
                <img src={require("./icons/logo.png")} name="logo" alt="logo"/>
                <div className="buttonContainer">
                    <a href="/JoinRoom">
<<<<<<< HEAD
                        <button onClick={() => this.updateUserType("Player")} style={{width: "200px"}}> Join a Room </button>
                    </a>
                    <a href="/NewRoom">
                        <button onClick={() => this.updateUserType("Organizer")} style={{width: "200px"}}> New Room </button>
=======
                        <button> Join a Room </button>
                    </a>
                    <a href="/NewRoom">
                        <button> New Room </button>
>>>>>>> 8a617a8c93b1493a512d24ccc641aa4a3d5f9676
                    </a>
                </div>
            </div>
        );
    }
    //To switch components
    return ( 
        <div className="App" >
            <header className="App-header" >
                <Switch>
                    <Route exact path="/" render={Home} />
                    <Route path="/NewRoom" component={GameManager} />
                    <Route path="/JoinRoom" component={JoinRoom}/>
                    <Route path="/:name/Categories/" component={Categories}/>
                    <Redirect to='/' />
                </Switch>
            </header>
        </div>
    );
    }
}

export default App;