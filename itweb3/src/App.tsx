import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import { Button, Col, Container, Row, NavLink } from 'reactstrap';
import './App.css';
import Game from './Game';
import Register from './Register';
import Login from './Login';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import logo from './logo.svg';

export interface IState {
  gameRunning: boolean;
  gridSize: number;
  score: number;
  dataFromServer: String;
}

class App extends React.Component<{}, IState> {

  constructor(props: any) {
    super(props);

    this.state = {
      gameRunning: false,
      gridSize: 3,
      score: 0,
      dataFromServer: "",
    };

    this.setGridSize = this.setGridSize.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onScoreChange = this.onScoreChange.bind(this);
  }

  ws = new WebSocket('ws://localhost:4000')

  componentDidMount() {
    this.ws.onopen = () => {
    // on connecting, do nothing but log it to the console
    console.log('connected')
    }

    this.ws.onmessage = evt => {
    // listen to data sent from the websocket server
    const message = JSON.parse(evt.data)
    this.setState({dataFromServer: message})
    console.log(message)
    }

    this.ws.onclose = () => {
    console.log('disconnected')
    // automatically try to reconnect on connection loss
    }

}

  public render() {
    return (
      <div className="App">
        <header className="App-header">
        <Router>
      <div>
        <ul>
            <Link to="/">Home</Link>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
          </Route>
          <Route path="/register">
            <Register/>
          </Route>
          <Route path="/login">
              <Login/>            
          </Route>
        </Switch>
      </div>
    </Router>
        </header>
        <Container>
          <Row>
            <Col xs="3">
              <input type="range" min="3" max="5" className="slider" value={this.state.gridSize} onInput={this.setGridSize} onChange={this.setGridSize} />
            </Col>
            <Col xs="6">
              <Game rows={this.state.gridSize} columns={this.state.gridSize} running={this.state.gameRunning} onScoreChange={this.onScoreChange} websocket={this.ws} />
            </Col>
            <Col xs="3">
              <Row>
                <Col xs="12">
                  <Button color="primary" className={this.state.gameRunning ? 'hidden' : ''} onClick={this.onPlay}>Play</Button>
                  <Button color="primary" className={!this.state.gameRunning ? 'hidden' : ''} onClick={this.onPause}>Pause</Button>
                </Col>
              </Row>
              <Row>
                <p>{this.state.score}</p>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  private setGridSize(e: any) {
    this.setState({ gridSize: e.target.value });
  }

  private onPlay(e: any) {
    this.setState({ gameRunning: true });
  }

  private onPause(e: any) {
    this.setState({ gameRunning: false });
  }

  private onScoreChange(prevScore: number, nextScore: number) {
    this.setState({ score: nextScore });
  }
}

export default App;