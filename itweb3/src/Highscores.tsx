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
            n: 1
        };

        this.setN = this.setN.bind(this);
    }

    componentDidMount(){
        this.connect();
    }

    connect(){
        this.state.websocket.send('HS '+ this.state.n);

        this.state.websocket.onmessage = m => {
            this.setState({scores: (JSON.parse(m.data))});
            this.render();
        }
    }

    render() {
        return (
            <div>
                <input type="range" min="1" max="20" className="slider" value={this.state.n} onInput={this.setN} onChange={this.setN} />
                <p>n: {this.state.n}</p>
                <ol>
                    {this.state.scores.map(s => <li>{s}</li>)}
                </ol>
            </div>

        );
    }

    private setN(e: any) {
        this.setState({ n: e.target.value });
        this.connect();
      }
}

export default HighscorePage;