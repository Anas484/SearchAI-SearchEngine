import React from 'react'
import heroImg from './assets/hero.png'
import './App.css'

function Card(props) {
    return (
    <>
      <div className='card'>
        <h1>Welcome to React</h1>
        <div>
          <img src={heroImg} alt="Hero Image" className='hero-img' />
          <p>This is a simple React app.</p>
            <p>Name: {props.name}</p>
          <button className='butt' onClick={()=>window.location.href=props.link}>Info</button>
        </div>
      </div> 
    </>
    );
}

export default Card