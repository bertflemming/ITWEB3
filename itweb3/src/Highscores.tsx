import React from 'react';
import { userService } from './UserService';

export interface IProps {

    websocket: WebSocket;
}

export interface IState {
    websocket: WebSocket;
    scores: number[];
}

class HighscorePage extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            websocket: this.props.websocket,
            scores: userService.getHighScores()
        };
    }

    componentDidMount(){
        this.connect();
    }

    connect(){
        this.state.websocket.send('HS');

        this.state.websocket.onmessage = m => {
          console.log('highscores received');
          this.setState({scores: (JSON.parse(m.data))});
          this.render();
        }
    
    }

    render() {
        return (
            <div>
                <ol>
                    {this.state.scores.map(s => <li>{s}</li>)}
                </ol>
            </div>

        );
    }
}

export default HighscorePage;