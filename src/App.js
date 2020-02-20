import React from 'react';
import './App.css';
import { clearInterval } from 'timers';
import { setInterval } from 'timers';

class Pomodoro extends React.Component{
  constructor(props) {
    super(props);
    this.state = { 
      break: 5,
      session: 25,
      runFlag : false,
      sessionType: "session",
      time: 1500000 // 1500 secs equals 25 mins
     }
     this.setTime = this.setTime.bind(this);
     this.currentTime = this.currentTime.bind(this);
     this.startStop = this.startStop.bind(this);
     this.handleTimer = this.handleTimer.bind(this);
     this.playBeep = this.playBeep.bind(this);
     this.stopBeep = this.startStop.bind(this);
     this.reset = this.reset.bind(this);
     this.setBreak = this.setBreak.bind(this);
     this.setSession = this.setSession.bind(this)
  }
  setBreak(e) {
    this.setTime("break", e.target.value, this.state.break, "session")
  }

  setSession(e) {
    this.setTime("session", e.target.value, this.state.session, "break")
  }

  /* Function for setting break and session time and it's used into TimeSettings component */
  setTime(stateToUpdate, sign, currentLength, sessionNewType){
    if(this.state.runFlag) return; // doesn't allow to change the time during the countdown
    if(this.state.sessionType === sessionNewType) {
      if(sign === "-" && currentLength !== 1){
        this.setState({
          [stateToUpdate] : currentLength - 1
        });
      } else if(sign === "+" && currentLength !== 60){
        this.setState({
          [stateToUpdate] : currentLength + 1
        });
      }
    } else {
      if(sign === "-" && currentLength !== 1){
        this.setState({
          [stateToUpdate] : currentLength - 1,
          time : currentLength * 60000 - 60000
        });
      } else if(sign === "+" && currentLength !== 60){
        this.setState({
          [stateToUpdate] : currentLength + 1,
          time : currentLength * 60000 + 60000
        });
      }
    }
  }

  /* Function that shows the current time */
  currentTime(){
    let min = Math.floor(this.state.time / 60000);
    let sec = Math.floor(this.state.time % 60000) / 1000;
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
  }

  startStop(){
    if(this.state.runFlag) {
      clearInterval(this.countdown);
      this.setState({
        runFlag : false
      });
      return;
    }
    clearInterval(this.countdown);
    /* setInterval is a method that calls a function or runs some code
     after specific intervals of time */
    this.countdown = setInterval(this.handleTimer, 1000);
    this.setState({
      runFlag: true
    });
  }

  handleTimer(){
    if(this.state.time === 0 && this.state.sessionType === "session") {
      this.playBeep();
      this.setState({
        sessionType: "break",
        time: this.state.break * 60000
      });
      return;
    }
    if (this.state.time === 0 && this.state.sessionType === "break"){
      this.playBeep();
      this.setState({
        sessionType: "session",
        time: this.state.session * 60000
      });
      return;
    }
    this.setState({
      time: this.state.time - 1000
    });
  }

  reset(){
    this.stopBeep();
    clearInterval(this.countdown);
    this.setState({
      break: 5,
      session: 25,
      runFlag : false,
      sessionType: "session",
      time: 1500000
    });
  }

  playBeep(){
    let beep = document.getElementById("beep");
    beep.currentTime = 0;
    beep.play();
  }

  stopBeep(){
    let beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
  }

  render() { 
    return ( 
      <div className="wrapper">
        <TimeSettings 
        labelType="break-label"
        string="break"
        decrement="break-decrement"
        increment="break-increment"
        timeLength="break-length"
        setTime={this.setBreak}
        displayLength={this.state.break} />
        <button id="start_stop" onClick={this.startStop}>
          {this.state.runFlag ? "pause" : "start"}
        </button>
        <div className="clock-wrap">
        <div className="clock" id="time-left">
        <div id="timer-label">
          {this.state.sessionType}
        </div>
          {this.currentTime()}
        </div>
        </div>
                
        <button id="reset" onClick={this.reset}>
          reset</button>

        <TimeSettings 
        labelType="session-label"
        string="session"
        decrement="session-decrement"
        increment="session-increment"
        timeLength="session-length"
        setTime={this.setSession}
        displayLength={this.state.session} />
        

        <audio
          src="https://goo.gl/65cBl1"
          id="beep"
          preload="true"
        />
      </div>
     );
  }
}

/* Component for setting break and session times */
const TimeSettings = props => {
  return (
    <div className="time-settings">
      <div id = {props.labelType}>
        {props.string}
        </div>
        <button
        id = {props.decrement} 
        value="-" 
        onClick={props.setTime}> - </button>
        <div id={props.timeLength}>
          {props.displayLength}
        </div>
        <button
        id = {props.increment} 
        value="+"
        onClick={props.setTime}> + </button>
    </div>
  )
}
export default Pomodoro;
