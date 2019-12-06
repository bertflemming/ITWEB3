import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import HighscorePage from './Highscores';
import GameView from './GameView';
import {userService} from './UserService';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

export interface IState {
  ws: WebSocket;
}

class App extends React.Component<{}, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      ws: new WebSocket('ws://localhost:4000/api'),
    };
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

  public render() {
    return (
      <div className="App">
        <header className="App-header">
        <Router>
      <div>
        <ul>
            <Link to="/">Game</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            <Link to="/logout">Logout</Link>
            <Link to="/highscores">Highscores</Link>
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
              <Login/>            
          </Route>
          <Route path="/logout">
              {userService.logout}     
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