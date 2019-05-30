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
                        <button> Join a Room </button>
                    </a>
                    <a href="/NewRoom">
                        <button> New Room </button>
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