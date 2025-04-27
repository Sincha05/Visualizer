import React from 'react';

function Bar({ height }) {
  return (
    <div
      className="bar"
      style={{
        height: `${height}px`,
        width: `10px`,
        backgroundColor: 'teal',
        margin: '2px',
        display: 'inline-block',
      }}
    ></div>
  );
}

export default Bar;
