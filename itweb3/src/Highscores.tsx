import React from 'react';
import { userService } from './UserService';

export interface IProps {

    //websocket: WebSocket;
}

export interface IState {
    //websocket: WebSocket;
    scores: string[];
    n: number;
}

class HighscorePage extends React.Component<IProps, IState> {
        constructor(props: any) {
        super(props);
        this.state = {
            //websocket: this.props.websocket,
            scores: ['','','','',''],
            n: 1,
        };

        this.setN = this.setN.bind(this);
    }

    private oldN = 1;
    private ws = new WebSocket('ws://localhost:4000/api');

    componentDidMount(){
        this.connect();
    }

    connect(){
        this.ws = new WebSocket('ws://localhost:4000/api');
        
        this.ws.onopen = () => {
          console.log('websocket connected');
          this.ws.send('HS '+ this.state.n);
        }

        this.ws.onmessage = m => {
            var data = JSON.parse(m.data);
            this.setState({scores: (data)});
            this.oldN = this.state.n;
        }
    
        this.ws.onclose = e => {
          console.log('websocket closed: '+e.reason);
          setTimeout(() => {
            this.connect();
          }, 1000);
        }
    
        this.ws.onerror = err => {
          console.error("websocket error: " + err.timeStamp);
          this.ws.close();
        }
      }

    /*
    connect(){
        this.state.websocket.send('HS '+ this.state.n);
        this.state.websocket.onmessage = m => {
            console.log("onmessage");
            console.log("n5: " + this.state.n)
            var data = JSON.parse(m.data);
            this.setState({scores: (data)});
            this.oldN = this.state.n;
        }
    }
    */

    render() {
        return (
            <div>
                {this.ws.readyState !== 1 ? <p>Cannot connect to highscore server</p> : <input type="range" min="1" max="20" className="slider" value={this.oldN} onInput={this.setN} disabled={this.ws.readyState !== 1}/>}
                <p>n1: {this.oldN}</p>
                <ol>
                    {this.state.scores.map(s => <li>{s}</li>)}
                </ol>
            </div>

        );
    }

    private setN(e: any) {
        if(this.ws.readyState === 1){
            this.ws.send('HS '+this.state.n);
        }
        //this.state.websocket.send('HS '+ this.state.n);
        this.setState({ n: e.target.value });       
      }
}

export default HighscorePage;