import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const Video = () => {
  const [video, setVideo] = useState(null);
  console.log("video...", video);

  const getVideo = async () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}api/video/get-video`, {name: "video"}, {responseType: 'blob'})
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setVideo(url);
      })
      .catch((err) => {
        setVideo(null);
        toast.error(err.response.data.message || err.message);
      })
  };

  useEffect(() => {
    getVideo();
  }, []);

  const blobToBase64 = async(blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };



  return (
    <div>
      {
        video ? (
          <video src={video} width="640" height="360" controls />
        ) : (
          <div>Loading video...</div>
        )
      }
    </div>
  )
};

export default Video;