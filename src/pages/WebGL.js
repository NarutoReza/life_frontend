import React from 'react';

function WebGL() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <iframe
        src="/webgl.html"  // Make sure this path is correct relative to public
        title="WebGL Viewer"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      >
      </iframe>
    </div>

  )
};

export default WebGL;