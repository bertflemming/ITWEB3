import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import HighscorePage from './Highscores';
import GameView from './GameView';
import {userService} from './UserService';
import Logout from './Logout';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

export interface IState {
  ws: WebSocket;
  loggedIn: boolean;
}

class App extends React.Component<{}, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      ws: new WebSocket('ws://localhost:4000/api'),
      loggedIn: false
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);
  }

  componentDidMount() {
    this.connect();
    }

  connect(){
    var ws = new WebSocket('ws://localhost:4000/api');
    
    ws.onopen = () => {
      console.log('websocket connected');
      this.setState({ws: ws});
    }

    ws.onclose = e => {
      console.log('websocket closed: '+e.reason);
    }

    ws.onerror = err => {
      console.error("websocket error: " + err.timeStamp);
      ws.close();
    }
  }

  setLoggedIn(){
    if(this.state.loggedIn){
      userService.logout();
    }
    this.setState({loggedIn: !this.state.loggedIn});
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
        <Router>
      <div>
        <ul>
            <Link to="/" className="btn btn-link">Game</Link>
            {this.state.loggedIn ? null : <Link to="/register" className="btn btn-link">Register</Link>}
            {this.state.loggedIn ? null : <Link to="/login" className="btn btn-link">Login</Link>}
            {this.state.loggedIn ? <Link to="/logout" className="btn btn-link">Logout</Link> : null}
            <Link to="/highscores" className="btn btn-link">Highscores</Link>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <GameView websocket={this.state.ws}/>
          </Route>
          <Route path="/register">
            <Register/>
          </Route>
          <Route path="/login">
              <Login loggedIn={this.state.loggedIn} setLoggedIn={this.setLoggedIn}/>            
          </Route>
          <Route path="/logout">
              <Logout setLoggedIn={this.setLoggedIn}/>     
          </Route>
          <Route path="/highscores">
              <HighscorePage websocket={this.state.ws}/>            
          </Route>
        </Switch>
      </div>
    </Router>
        </header>
      </div>
    );
  }
}

export default App;