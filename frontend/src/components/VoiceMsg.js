import axios from 'axios';
import React, { useState } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';

const VoiceMessage = ({ sender, receiver, onMessageSent }) => {
    const recorderControls = useAudioRecorder();
    const [blob, setBlob] = useState(null);
    const [uploading, setUploading] = useState(false);

    const addAudioElement = (blob) => {
        setBlob(blob);
    };

    const handleSend = async () => {
        if (!blob || !sender || !receiver) {
            alert('Please fill all the fields and record a message.');
            return;
        }

        const formData = new FormData();
        formData.append('voiceMessage', blob, 'voiceMessage.webm');
        formData.append('sender', sender);
        formData.append('receiver', receiver);

        try {
            setUploading(true);
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data',
                },
            };
            const response = await axios.post(`${process.env.REACT_APP_URI}/api/chat/voice-message`, formData, config);
            alert('Voice message sent successfully');
            onMessageSent();
        } catch (error) {
            console.error('Error uploading the voice message', error);
            alert('Failed to send the voice message');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <AudioRecorder
                onRecordingComplete={addAudioElement}
                recorderControls={recorderControls}
            />
            <button onClick={recorderControls.startRecording} disabled={recorderControls.isRecording}>
                <i className="fa fa-microphone"></i>
            </button>
            <button onClick={recorderControls.stopRecording} disabled={!recorderControls.isRecording}>
                <i className="fa fa-stop"></i>
            </button>
            <button onClick={handleSend} disabled={uploading || !blob}>
                {uploading ? 'Uploading...' : 'Send'}
            </button>

        </div>
    );
};

export default VoiceMessage;
