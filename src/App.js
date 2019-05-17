import React from 'react';
import './App.css';
import GameManager from './GameManager';
import { Route, Switch } from 'react-router-dom';

function App() {
    let Home = () => {
        return  (
            <div>
                <a href="/gameManager">
                    <button> New Room </button>
                </a>
            </div>
        );
    }

    return ( 
        <div className="App" >
            <header className="App-header" >
                <Switch>
                    <Route exact path="/" render={Home} />
                    <Route path="/gameManager" component={GameManager} />
                </Switch>
            </header>
        </div>
    );
}

export default App;