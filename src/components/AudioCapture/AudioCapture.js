import React from 'react';

var mediaRecorder;
var chunks = [];

async function startCapture() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia (
            {
                audio: true
            })
            .then(function(stream) {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                }
            })
    }
}

function stopCapture() {

    mediaRecorder.stop();
    mediaRecorder.onstop = function(e) {
        const clipName = prompt('Enter a name for your sound clip');

        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);

        var link = document.createElement("a");
        link.href = audioURL;
        link.download = clipName + ".opus";
        link.innerHTML = "Click here to download the file";
        document.body.appendChild(link);
    }
}

function AudioCapture() {
    return (
        <div>
            <p>
                <button id="start recording" onClick={() => startCapture()}>Start Recording Microphone</button>
                <button id="stop recording" onClick={() => stopCapture()}>Stop Recording Microphone</button>
            </p>
        </div>
    );
}

export default AudioCapture;
