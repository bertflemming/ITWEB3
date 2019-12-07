import React from 'react';
import { userService } from './UserService';

export interface IProps {

    websocket: WebSocket;
}

export interface IState {
    websocket: WebSocket;
    scores: string[];
    n: number;
}

class HighscorePage extends React.Component<IProps, IState> {
        constructor(props: any) {
        super(props);
        this.state = {
            websocket: this.props.websocket,
            scores: ['','','','',''],
            n: 1,
        };

        this.setN = this.setN.bind(this);
    }

    private oldN = 1;

    componentDidMount(){
        this.connect();
    }

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

    render() {
        return (
            <div>
                <input type="range" min="1" max="20" className="slider" value={this.oldN} onInput={this.setN} />
                <p>n1: {this.oldN}</p>
                <ol>
                    {this.state.scores.map(s => <li>{s}</li>)}
                </ol>
            </div>

        );
    }

    private setN(e: any) {
        this.state.websocket.send('HS '+ this.state.n);
        this.setState({ n: e.target.value });       
      }
}

export default HighscorePage;