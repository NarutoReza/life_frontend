import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Pen, Trash, X } from 'lucide-react';
import { toast } from 'react-toastify';
import {Dialog, DialogPanel, DialogTitle} from '@headlessui/react';

function AudioReview() {
  const [audioList, setAudioList] = useState([]);
  // console.log("audioList...", audioList);
  const [audioIndex, setAudioIndex] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioFileStatus, setAudioFileStatus] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null);
  console.log("selected audio...", selectedAudio);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAllAudios = async () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}api/audio/list`)
      .then(res => {
        setAudioList(res.data.data);
      })
      .catch(err => {
        console.log(err);
      })
  };

  useEffect(() => {
    getAllAudios();
  }, []);

  const getAudioFile = async (name) => {
    setAudioFileStatus('Loading...');
    setAudioFile(null);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/audio/get-audio`,
        { name: name },
        { responseType: 'blob' }
      );
      const blob = res.data;
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioFile(reader.result);
        setAudioFileStatus('');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      const errorMsg =
        (err.response && err.response.data && err.response.data.message) || err.message;
      toast.error(errorMsg);
      setAudioFileStatus(errorMsg);
      setAudioFile(null);
    }
  };

  const handleEditAudio = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}api/audio/edit-audio`, {name: selectedAudio.name, audioId: selectedAudio._id})
      .then((res) => {
        toast.success(res.data.message);
        getAllAudios();
        setIsEditModalOpen(false);
        setSelectedAudio(null);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message || error.message);
        setIsLoading(false);
      });
  };

  const handleDeleteAudio = async(e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}api/audio/delete-audio`, {audioId: selectedAudio._id})
      .then((res) => {
        toast.success(res.data.message);
        getAllAudios();
        setIsDeleteModalOpen(false);
        setSelectedAudio(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message || error.message);
      });
  };

  return (
    <div style={{display: 'flex', flexWrap:'wrap', gap: '20px'}}>
      {
        audioList && audioList.map((item, index) => (
          <div key={index} style={{maxWidth: '350px', width: '100%', border: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px'}}>
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
              <p>{item?.name}</p>
              <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                <button type='button' style={{width: 'fit-content', cursor: 'pointer'}} onClick={() => {
                  if(audioIndex === index) {
                    setAudioIndex(null);
                  } else {
                    setAudioIndex(index);
                    getAudioFile(item?.name)
                  }
                }}>
                <ChevronDown style={{width: '16px', height: '16px', rotate: `${audioIndex === index ? '180deg' : '0deg'}`, transition: 'all 0.3s ease-in-out'}} />
                </button>
              </div>
            </div>
            {
              audioIndex === index && (
                <div style={{width: '100%'}}>
                  {
                    audioFile === null
                    ? (<p>{audioFileStatus}</p>)
                    : (
                      <div style={{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center'}}>
                        <audio src={audioFile} controls style={{width: '90%'}} />

                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '20px', marginLeft: 'auto'}}>
                          <button type='button' style={{width: 'fit-content', cursor: 'pointer'}} onClick={() => {
                            setIsEditModalOpen(true);
                            setSelectedAudio(item);
                          }}>
                            <Pen style={{width: '16px', height: '16px'}} />
                          </button>
                          
                          <button type='button' style={{width: 'fit-content', cursor: 'pointer'}} onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectedAudio(item);
                          }}>
                            <Trash style={{width: '16px', height: '16px'}} />
                          </button>
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            }
          </div>
        ))
      }

      {
        isEditModalOpen && (
          <Dialog
            open={isEditModalOpen}
            as='div'
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAudio(null);
            }}
          >
            <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 10, width: '100vw', overflowY: 'auto', marginTop: '50px'}}>
              <div style={{display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <DialogPanel transition>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', backgroundColor: 'white', width: '100%', minWidth: '450px'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 'calc(100% - 40px)', }}>
                      <DialogTitle as='h3'>Edit File</DialogTitle>
                      <button type='button' onClick={() => {
                        setIsEditModalOpen(false);
                        setSelectedAudio(null);
                      }}><X style={{width: '16px', height: '16px'}} /></button>
                    </div>

                    <form onSubmit={handleEditAudio} style={{width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px'}}>
                      <div style={{display: 'flex', flexDirection: 'column', padding: '0 20px'}}>
                        <label>Audio Title</label>
                        <input name='name' type='text' placeholder='Enter audio file title' value={selectedAudio?.name} required onChange={e => setSelectedAudio({...selectedAudio, name: e.target.value})} />
                      </div>
                      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <button type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "Edit"}</button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        )
      }

      {
        isDeleteModalOpen && (
          <Dialog
            open={isDeleteModalOpen}
            as='div'
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedAudio(null);
            }}
          >
            <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 10, width: '100vw', overflowY: 'auto', marginTop: '50px'}}>
              <div style={{display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <DialogPanel transition>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', backgroundColor: 'white', width: '100%', minWidth: '450px'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: 'calc(100% - 40px)', }}>
                      <DialogTitle as='h3'>Delete File</DialogTitle>
                      <button type='button' onClick={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedAudio(null);
                      }}><X style={{width: '16px', height: '16px'}} /></button>
                    </div>

                    <button type='button' onClick={handleDeleteAudio} style={{marginBottom: '20px'}}>Delete</button>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        )
      }
    </div>
  )
};

export default AudioReview;