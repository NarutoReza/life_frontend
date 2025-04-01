import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css';

function Navbar() {
  return (
    <div className='navbar'>
      <ul>
        <li>
          <Link to='/video'>Video</Link>
        </li>
        <li>
          <Link to='/pdf'>Pdf</Link>
        </li>
        <li>
          <Link to='/audio'>Audio</Link>
        </li>
        <li>
          <Link to='/webgl'>WebGL</Link>
        </li>
        <li>
          <Link to='/audio-review'>Audio Review</Link>
        </li>
      </ul>
    </div>
  )
};

export default Navbar;