import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Video from './pages/Video';
import Pdf from './pages/Pdf';
import AudioRecorder from './pages/Audio';
import WebGL from './pages/WebGL';
import AudioReview from './pages/AudioReview';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Video />} />
        <Route path='/video' element={<Video />} />
        <Route path='/pdf' element={<Pdf />} />
        <Route path='/audio' element={<AudioRecorder />} />
        <Route path='/webgl' element={<WebGL />} />
        <Route path='/audio-review' element={<AudioReview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
