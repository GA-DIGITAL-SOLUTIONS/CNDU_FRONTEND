import React from 'react';
import './Section4.css';
import Heading from '../../Heading/Heading';

const Section4 = () => {
  return (
    <div className="section4-container">
      {/* <h2>WHAT WE DO</h2>
      <img src='./Leaf.png' alt='what we do' className='leafimg' /> */}
      <Heading>WHAT WE DO</Heading>
      <div className='Whatwedo-Cards'>
        <div className='card'>
          <img src="./Whatwedologo1.svg" alt="Logo 1" className="whatwedologo" />
          <div className="card-content">
            <h3>Service 1</h3>
            <p>Description for service 1 goes here.</p>
          </div>
        </div>

        <div className='card'>
          <img src="./Whatwedologo2.svg" alt="Logo 2" className="whatwedologo" />
          <div className="card-content">
            <h3>Service 2</h3>
            <p>Description for service 2 goes here.</p>
          </div>
        </div>

        {/* Add more cards here as needed */}
      </div>
    </div>
  );
};

export default Section4;
