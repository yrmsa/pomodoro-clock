import React from 'react';
import './App.css';
import TimeSet from './components/TimeSet'
import Footer from './components/Footer';

class App extends React.Component {

  constructor() {
    super();
    this.loop = undefined;
    this.state = {
      breakTime: 5,
      sessionTime: 25,
      timeCounter: 25 * 60,
      isPlay: false,
      title: 'Session'
    }
    this.sessionEndedAudio = new Audio(process.env.PUBLIC_URL + "/audio/accomplished-579.ogg");
    this.sessionEndedAudio.preload = 'auto';
    this.breakEndedAudio = new Audio(process.env.PUBLIC_URL + "/audio/plucky-564.ogg");
    this.breakEndedAudio.preload = 'auto';
  }

  handleIncrease = (title) => {
    if(title === 'Session Length') {
      if(this.state.sessionTime < 60){
        this.setState({
          sessionTime: this.state.sessionTime + 1, 
        });
        if(this.loop === undefined) {
          this.setState({
            timeCounter: (this.state.timeCounter + 1 * 60)
          })
        }
      }
    } else {
      if(this.state.breakTime < 60) {
        this.setState({
          breakTime: this.state.breakTime + 1
        })
      }
    }
  }

  handleDecrease = (title) => {
    if(title === 'Session Length') {
      if(this.state.sessionTime > 1){
        this.setState({
          sessionTime: this.state.sessionTime - 1, 
        });
        if(this.loop === undefined) {
          this.setState({
            timeCounter: (this.state.timeCounter - 1 * 60)
          })
        }
      }
    } else {
      if(this.state.breakTime > 1) {
        this.setState({
          breakTime: this.state.breakTime - 1
        })
      }
    }
  }

  minuteToSecond = (count) => {
    const minute = Math.floor(count / 60);
    let second = count % 60;
    
    second = second < 10 ? '0' + second : second

    return `${minute}:${second}`
  }

  

  handlePlay = () => {
    const {isPlay} = this.state;
    if(isPlay) {
      this.setState({
        isPlay: false
      });

      clearInterval(this.loop);
    } else {
      this.setState({
        isPlay: true
      });
      console.log(this.state.isPlay);

      this.loop = setInterval(() => {
        const { timeCounter, title, breakTime, sessionTime } = this.state;
        
        if(timeCounter === 0) {
          if(Notification.permission === 'granted') {
            let message;
            if(title === 'Session') {
              message = `Great job, give yourself a break!`;
            }
            else if(title === 'Break'){
              message = `Ready for the next Session?`;
            }
            let notification = new Notification(message, {silent: true});
            setTimeout(() => {
              notification.close();
            }, 5000)
          }
          if(title === 'Session') {
            this.sessionEndedAudio.play();
          }
          else {
            this.breakEndedAudio.play();
          }
          this.setState({
            title: (title === 'Session') ? 'Break' : 'Session',
            timeCounter: (title === 'Session') ? (breakTime * 60) : (sessionTime * 60)
          })
        }
        else {
          this.setState({
            timeCounter: timeCounter - 1
          })
        }
      }, 1000);
    }
  }

  handleReset = () => {
    const {isPlay} = this.state;
    if(isPlay){
      console.log('click reset');
      clearInterval(this.loop);
      this.loop = undefined;
      this.setState({
        timeCounter: this.state.sessionTime * 60,
        isPlay: false,
        title: 'Session'
      });
      if(Notification.permission === 'granted'){
        let message = `Time reset`;
        let notification = new Notification(message, {silent: true});
        setTimeout(() => {
          notification.close();
        }, 2000)
      }
    }
  }

  componentDidMount() {
    if(Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  componentWillUnmount() {
    clearInterval(this.loop);
  }

  handleSkip = () => {

    const { title, sessionTime, breakTime, isPlay } = this.state;
    if(isPlay){
      this.setState({
        timeCounter: 0
      })
    }
  }


  render() {
    const {sessionTime, breakTime, timeCounter, isPlay, title} = this.state;

    const sessionTimer = {
      title: 'Session Length',
      time: sessionTime,
      increaseHandler: () => this.handleIncrease(sessionTimer.title),
      decreaseHandler: () => this.handleDecrease(sessionTimer.title)
    }
  
    const breakTimer = {
      title: 'Break Length',
      time: breakTime,
      increaseHandler: () => this.handleIncrease(breakTimer.title),
      decreaseHandler: () => this.handleDecrease(breakTimer.title)
    }

    return (
      <div className="App">
        <h1>Pomodoro Clock</h1>
        <div className='flex'>
          <TimeSet {...breakTimer} />
          <TimeSet {...sessionTimer} />
        </div>
        <div className='timer'>
          <h3>{title}</h3>
          <h4>{this.minuteToSecond(timeCounter)}</h4>
          <div className='flex'>
            <button onClick={this.handlePlay}>{isPlay ? 'Pause' : 'Play'}</button>
            <button onClick={this.handleSkip}>Skip</button>
            <button onClick={this.handleReset}>Reset</button>
          </div>
        </div>
        <Footer className='footer-wrapper'/>
      </div>
    );
  }

}

export default App;
