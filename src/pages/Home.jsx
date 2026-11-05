import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>FirstMinutes</h1>
      <p>Emergency response starts in the first minutes.</p>

      <Link to="/emergency/report">
        Report Emergency
      </Link>
    </div>
  );
}