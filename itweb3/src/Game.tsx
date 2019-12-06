import * as React from 'react';
import { Button } from 'reactstrap';
import Board from './Board';
import Flash from './Flash';
import Grid from './Grid';

export interface IProps {
    columns: number;
    onScoreChange?: (prevScore: number, nextScore: number) => void;
    rows: number;
    running: boolean;
    n: number;
}

export interface IState {
    board: Board;
    currentFlash?: Flash;
    turn: number;
    positionClicked: boolean;
    soundClicked: boolean;
}

class Game extends React.Component<IProps, IState> {

    public static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const nextState: any = { board: prevState.board };

        if (prevState.board.rows !== nextProps.rows || prevState.board.columns !== nextProps.columns) {
            prevState.board.stop();
            nextState.board = new Board(nextProps.rows, nextProps.columns, nextProps.n);
            nextState.running = false;
        }

        if (prevState.board.n !== nextProps.n) {
            prevState.board.stop();
            nextState.board = new Board(nextProps.rows, nextProps.columns, nextProps.n);
            nextState.running = false;
        }

        if (nextProps.onScoreChange) {
            nextState.board.onScoreChange = nextProps.onScoreChange;
        }

        if (nextProps.running) {
            nextState.running = true;
        }

        // if(prevState.turn === 0) {
        //    prevState.board.stop();
        //    nextState.board = new Board(nextProps.rows, nextProps.columns, nextProps.n);
        //    nextState.running = false;
       // }

        return nextState;
    }

    constructor(props: any) {
        super(props);

        this.state = {
            board: new Board(this.props.rows, this.props.columns, this.props.n),
            currentFlash: undefined,
            turn: 29,
            positionClicked: false,
            soundClicked: false,
        }

        this.tryPosition = this.tryPosition.bind(this);
        this.trySound = this.trySound.bind(this);
        this.onFlash = this.onFlash.bind(this);
        this.speak = this.speak.bind(this);
    }

    public componentWillUnmount() {
        this.state.board.stop();
    }

    public componentDidUpdate(prevProps: IProps, prevState: IState, snapshot?: any) {
        if (!prevProps.running && this.props.running) {
            console.log("1");
            this.setState({turn: 29});
            this.state.board.start(this.onFlash);
        }

        if (prevProps.running && !this.props.running) {
            console.log("2");
            this.state.board.stop();
        }
    }

    public render() {
        const props: any = {};
        if (this.state.currentFlash) {
            if(this.props.running){
                props.highlight = this.state.currentFlash.position;
            }
            else {
                props.highlight = undefined;
            }
        }
        return (
            <div>
                <Grid rows={this.state.board.rows} columns={this.state.board.columns} {...props} />
                <p>Turns remaining: {this.state.turn}</p>
                <Button color="secondary" disabled={!this.props.running} onClick={this.tryPosition}>Position</Button>
                <Button color="secondary" disabled={!this.props.running} onClick={this.trySound}>Sound</Button>
            </div>
        );
    }

    private tryPosition() {
        if(!this.state.positionClicked){
            this.state.board.samePosition();
            this.setState({positionClicked: true})
        }
    }

    private trySound() {
        if(!this.state.soundClicked){
            this.state.board.sameSound();
            this.setState({soundClicked: true})
        }
    }

    private onFlash(newFlash: Flash) {
        if(this.state.turn > 0) {
            this.setState({ currentFlash: newFlash });
            
            this.speak(newFlash.sound.toString());

            var oldTurn = this.state.turn;
            this.setState({turn: Number(oldTurn)-1})
            console.log("turn: " + this.state.turn);
            this.setState({positionClicked: false})
            this.setState({soundClicked: false})
            
        }
    }

    private speak(text: string) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = text;
            utterance.voice = speechSynthesis.getVoices().filter((voice) => {
                return voice.name === "Allison";
            })[0];
            window.speechSynthesis.speak(utterance);
        }
    }
}

export default Game;