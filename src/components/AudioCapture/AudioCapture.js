import React from 'react';

var mediaRecorder;
var chunks = [];
var audioStream;

async function startCapture() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(
            {
                audio: true
            })
            .then(function (stream) {
                audioStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                }
            })
    }
}

function stopCapture() {

    mediaRecorder.stop();
    mediaRecorder.onstop = function () {
        const clipName = prompt('Wybierz nazwę pliku');

        const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'});
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = audioURL;
        link.download = clipName + ".opus";
        link.click();
        audioStream.getTracks().forEach(function (track) {
            track.stop()
        })
    }
}

function AudioCapture() {
    return (
        <div>
            <p>
                <button onClick={() => startCapture()}>Zacznij rejestrowanie dźwięku</button>
                <button onClick={() => stopCapture()}>Zatrzymaj rejestrowanie dźwięku</button>
            </p>
        </div>
    );
}

export default AudioCapture;
