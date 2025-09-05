import React, { useState, useRef, useEffect } from 'react';
import { Video, Mic, Square, Play, Pause, Share, AlertTriangle } from 'lucide-react';
import RecordButton from './RecordButton';
import AlertButton from './AlertButton';

const Recording = ({ user }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState('audio'); // 'audio' or 'video'
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [mediaStream, setMediaStream] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    // Load saved recordings from localStorage
    const savedRecordings = localStorage.getItem('pocket-protector-recordings');
    if (savedRecordings) {
      setRecordings(JSON.parse(savedRecordings));
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const startRecording = async (type = 'audio') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { 
          type: type === 'video' ? 'video/webm' : 'audio/webm' 
        });
        const url = URL.createObjectURL(blob);
        
        const newRecording = {
          id: Date.now(),
          type,
          url,
          timestamp: new Date().toISOString(),
          duration: recordingTime,
          location: null // Will be populated by geolocation if available
        };

        // Try to get location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            newRecording.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            updateRecordings(newRecording);
          }, () => {
            updateRecordings(newRecording);
          });
        } else {
          updateRecordings(newRecording);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
      setRecordingTime(0);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
  };

  const updateRecordings = (newRecording) => {
    const updatedRecordings = [...recordings, newRecording];
    setRecordings(updatedRecordings);
    localStorage.setItem('pocket-protector-recordings', JSON.stringify(updatedRecordings));
  };

  const sendAlert = async () => {
    if (!user?.emergencyContacts?.length) {
      alert('No emergency contacts configured. Please add contacts in settings.');
      return;
    }

    // In a real app, this would send SMS/email alerts
    // For demo, we'll simulate the alert
    setAlertSent(true);
    
    const alertData = {
      timestamp: new Date().toISOString(),
      message: `ALERT: ${user.email || 'User'} has initiated an emergency recording.`,
      location: null
    };

    // Try to get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        alertData.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log('Alert sent with location:', alertData);
      }, () => {
        console.log('Alert sent without location:', alertData);
      });
    } else {
      console.log('Alert sent without location:', alertData);
    }

    // Reset alert status after 5 seconds
    setTimeout(() => setAlertSent(false), 5000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const deleteRecording = (id) => {
    const updatedRecordings = recordings.filter(recording => recording.id !== id);
    setRecordings(updatedRecordings);
    localStorage.setItem('pocket-protector-recordings', JSON.stringify(updatedRecordings));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Incident Recording</h1>
        <p className="text-gray-300">
          Document interactions safely and discreetly
        </p>
      </div>

      {/* Recording Controls */}
      <div className="bg-surface rounded-lg p-6 mb-6 border border-gray-700">
        {!isRecording ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Start Recording</h3>
            <div className="flex space-x-4">
              <RecordButton
                variant="record"
                onClick={() => startRecording('audio')}
                className="flex-1"
              >
                <Mic className="w-5 h-5 mr-2" />
                Audio Only
              </RecordButton>
              <RecordButton
                variant="record"
                onClick={() => startRecording('video')}
                className="flex-1"
              >
                <Video className="w-5 h-5 mr-2" />
                Video
              </RecordButton>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">
                Recording {recordingType} - {formatTime(recordingTime)}
              </span>
            </div>
            
            <RecordButton
              variant="stop"
              onClick={stopRecording}
              className="mx-auto"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </RecordButton>
          </div>
        )}
      </div>

      {/* Emergency Alert */}
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h3 className="text-red-200 font-semibold">Emergency Alert</h3>
        </div>
        <p className="text-red-200 text-sm mb-4">
          Send your location and situation details to emergency contacts
        </p>
        <AlertButton
          variant={alertSent ? "confirm" : "trigger"}
          onClick={sendAlert}
          disabled={alertSent}
        >
          {alertSent ? "Alert Sent!" : "Send Emergency Alert"}
        </AlertButton>
      </div>

      {/* Recordings List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Saved Recordings ({recordings.length})
        </h3>
        
        {recordings.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recordings yet</p>
            <p className="text-sm">Start recording to document interactions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recordings.map((recording) => (
              <div key={recording.id} className="bg-surface rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {recording.type === 'video' ? (
                      <Video className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Mic className="w-5 h-5 text-green-400" />
                    )}
                    <span className="text-white font-medium">
                      {recording.type === 'video' ? 'Video' : 'Audio'} Recording
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {formatTime(recording.duration)}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">
                  {new Date(recording.timestamp).toLocaleString()}
                </p>
                
                <div className="flex space-x-2">
                  <a
                    href={recording.url}
                    download={`recording-${recording.id}.webm`}
                    className="flex-1 bg-primary hover:bg-blue-600 text-white py-2 px-3 rounded-md text-sm text-center transition-colors"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Incident Recording',
                          text: 'Incident recording from Pocket Protector',
                          files: [new File([recording.url], `recording-${recording.id}.webm`)]
                        });
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteRecording(recording.id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legal Notice */}
      <div className="mt-6 bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
        <h4 className="text-yellow-200 font-semibold mb-2">Recording Guidelines</h4>
        <ul className="text-yellow-200 text-sm space-y-1">
          <li>• You have the right to record police in public spaces</li>
          <li>• Inform officers you are recording if asked directly</li>
          <li>• Do not interfere with police duties while recording</li>
          <li>• Check local laws - some areas have specific restrictions</li>
          <li>• Keep recordings secure and backed up</li>
        </ul>
      </div>
    </div>
  );
};

export default Recording;