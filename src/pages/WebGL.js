import React from 'react';

function WebGL() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <iframe
        src="/webgl.html"
        title="WebGL Viewer"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        sandbox="allow-scripts allow-same-origin allow-fullscreen allow-modals allow-popups"
      >
      </iframe>
    </div>

  )
};

export default WebGL;