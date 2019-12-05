import React from 'react';
import { userService } from './UserService';

class HighscorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scores: []
        };
        this.state.scores = userService.getHighScores();
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