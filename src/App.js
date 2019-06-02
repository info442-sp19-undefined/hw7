import React, { Component } from 'react';
import './css/App.css';
import { GameManager, Categories } from './GameManager';
import JoinRoom from './JoinRoom';
import { Route, Switch, Redirect } from 'react-router-dom';
const uniqid = require('uniqid');
// To do later: loading spin
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: uniqid()
        };
    }

    render() {
        //Home 
        let Home = () => {
            return  (
                <div className="main">
                    <h1>Dive-In!</h1>
                    <div className="logoContainer">
                        <img src={require("./icons/logo.png")} name="logo" alt="logo"/>
                    </div>
                    <div className="buttonContainer">
                        <div>
                            <a href="/JoinRoom">
                                <button style={{width: "200px"}}> Join a Room </button>
                            </a>
                        </div>
                        <div>
                            <a href="/NewRoom" >
                                <button style={{ width: "200px" }}> New Room </button>
                            </a>
                        </div>
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
                    <Route  path="/NewRoom" render={() => <GameManager data={this.state} />} />
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