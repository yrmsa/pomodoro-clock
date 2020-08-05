import React from 'react';
import './Footer.css';
import githubLogo from './GitHub-Mark-Light-64px.png';

const Footer = () => {
  return(
    <div className='footer-wrapper'>
      <a href="https://github.com/shafiqAffandi/pomodoro-clock"><img  src={githubLogo} alt="github"/></a>
    </div>
  );
}

export default Footer;