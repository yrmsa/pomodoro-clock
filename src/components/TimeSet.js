import React from 'react';
import './TimeSet.css'

function TimeSet(props) {

  return(
    <div className='timeset'>
      <h3>{props.title}</h3>
      <div className='timer-setter'>
        <button onClick={props.decreaseHandler}>-</button>
        <span>{props.time}</span>
        <button onClick={props.increaseHandler}>+</button>
      </div>
    </div>
  );
}

export default TimeSet