import React from 'react';
import './Section2.css';  // Importing the CSS file
import Heading from '../../Heading/Heading';
const Section2 = () => {
  return (
    <div className='total-section2'>
    <div className="section2-container">
      {/* <h2>NEW ARRIVALS</h2>
      <img src='./Leaf.png' alt='New Arrivals' className='leafimg' /> */}
      <Heading>NEW ARRIVALS</Heading>

      <div className="cards-container">
       
        <div className="card">
          <img src="./cardPic.png" alt="Card 1" className='cardimg'/>
          <div className="card-text">
            <div className="text-left">
              <h1>Card 1</h1>
              <h4>Explore now!</h4>
            </div>
            <div className="arrow-right">
              &rarr; {/* Right arrow symbol */}
            </div>
          </div>
        </div>
        <div className="card">
          <img src="./cardPic.png" alt="Card 2" className='cardimg'/>
          <div className="card-text">
            <div className="text-left">
              <h1>Card 2</h1>
              <h4>Explore now!</h4>
            </div>
            <div className="arrow-right">
              &rarr; {/* Right arrow symbol */}
            </div>
          </div>
        </div>
        <div className="card">
          <img src="./cardPic.png" alt="Card 3" className='cardimg'/>
          <div className="card-text">
            <div className="text-left">
              <h1>Card 3</h1>
              <h4>Explore now!</h4>
            </div>
            <div className="arrow-right">
              &rarr; {/* Right arrow symbol */}
            </div>
          </div>
        </div>
      </div>
      <button className='seeallbut'>see all   &rarr;</button>
    </div>
    </div>
  );
}

export default Section2;
