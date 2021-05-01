import React from 'react';

var mediaRecorder;
var chunksVideo = [];
var chunksAudio = [];
var videoStream;
var audioStream;

const displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: true,
    audioBitsPerSecond : 128000,
    videoBitsPerSecond : 2500000,
    mimeType : 'video/mp4'
};

async function startCapture() {
    await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        .then(function (stream) {
            videoStream = stream;
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            mediaRecorder.ondataavailable = function (e) {
                chunksVideo.push(e.data);
            }
        });
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia(
            {
                audio: true
            })
            .then(function (stream) {
                audioStream = stream;
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = function (e) {
                    chunksAudio.push(e.data);
                }
            })
    }
}

function stopCapture() {
    mediaRecorder.stop();
    mediaRecorder.onstop = function () {
        const clipName = prompt('Wybierz nazwę pliku');

        const blob = new Blob([chunksVideo, chunksAudio], {type: chunksVideo[0].type});
        chunksVideo = [];
        chunksAudio = [];
        const videoURL = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = videoURL;
        link.download = clipName;
        link.click();
        videoStream.getTracks().forEach(function (track) {
            track.stop()
        })
    }
}

function ScreenCapture() {
    return (
        <div>
            <p>
                <button onClick={() => startCapture()}>Rozpocznij nagrywanie ekranu</button>
                <button onClick={() => stopCapture()}>Zakończ nagrywanie ekranu</button>
            </p>
        </div>
    );
}

export default ScreenCapture;
