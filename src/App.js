import React, { Component } from 'react';
import './App.css';
import GameManager from './GameManager';
import { Route, Switch, Redirect } from 'react-router-dom';

// To do later: loading spin

class App extends Component{
    constructor(props) {
        super(props)
        this.state = {
            user: ""
        }
        this.updateUserType = this.updateUserType.bind(this);
    }

    updateUserType(type) {
        this.setState({user: type});
    }
    render() {
    {/*Home page*/}
    let Home = () => {
        return  (
            <div>
                <h1>Dive-In!</h1>
                <div className="buttonContainer">
                    <a href="/">
                        <button onClick={() => this.updateUserType("Player")}> Join a Room </button>
                    </a>
                    <a href="/gameManager">
                        <button onClick={() => this.updateUserType("Organizer")}> New Room </button>
                    </a>
                </div>
            </div>
        );
    }
    {/*To switch components*/}
    return ( 
        <div className="App" >
            <header className="App-header" >
                <Switch>
                    <Route exact path="/" render={Home} />
                    <Route path="/gameManager" component={(props) => <GameManager/>} />
                    <Redirect to='/' />
                </Switch>
            </header>
        </div>
    );
    }
}

export default App;