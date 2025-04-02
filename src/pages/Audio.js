import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AudioRecorder() {
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const [name, setName] = useState("");

  const startRecording = async () => {
    try {
      // Clear previous recording
      setAudioUrl(null);
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up MediaRecorder for the stream
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setIsProcessing(true);
        // Create a Blob from the audio chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);

        // Create a temporary Audio element to load metadata
        const tempAudio = new Audio();
        tempAudio.src = url;
        tempAudio.preload = "auto";
        tempAudio.addEventListener(
          "canplaythrough",
          () => {
            // Add a short delay to ensure the audio is fully processed
            setTimeout(() => {
              setAudioUrl(url);
              setAudioFile(audioBlob);
              setIsProcessing(false);
            }, 1000);
          },
          { once: true }
        );
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const reRecord = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    startRecording();
  };

  const upload = async (e) => {
    e.preventDefault();
    if(!audioFile && !audioUrl) {
      toast.error("No audio files found");
      return;
    }

    if(!name || name.trim() === "") {
      toast.warning("Please enter an audio name");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', audioFile);

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}api/audio/add-audio`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(res => {
        toast.success(res.data.message);
        setAudioUrl(null);
        setAudioFile(null);
        setName("");
        navigate('/audio-review');
        setUploadStatus('');
      })
      .catch(err => {
        toast.error(err.response.data.message || err.message);
      })
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      {recording && <p>Recording...</p>}
      {!isProcessing && !audioUrl && (
        <button onClick={recording ? stopRecording : startRecording} type='button'>
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
      )}
      {isProcessing && <p>Processing your audio, please wait...</p>}
      <form>
        {audioUrl && (
        <div>
          <label>Name</label>
          <input type='text' name='name' placeholder='Enter audio file name' onChange={e => setName(e.target.value)} required value={name} />
        </div>
      )}
      {audioUrl && !isProcessing && (
        <div>
          <h3>Recorded Audio:</h3>
          <audio src={audioUrl} controls />
          <div style={{ marginTop: '10px' }}>
            <button onClick={reRecord} type='button'>Re-record</button>
            <button onClick={upload} type='submit'>Upload</button>
          </div>
        </div>
      )}
      {uploadStatus && <p>{uploadStatus}</p>}
      </form>
    </div>
  );
}

export default AudioRecorder;