import React from 'react';

var mediaRecorder;
var chunksVideo = [];
var chunksAudio = [];
var videoStream;
var audioStream;
var tracks;
var stream;
var blobs = [];

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
    videoStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        audioStream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true
            })
    }
    tracks = [...videoStream.getVideoTracks(), ...mergeAudioStreams(videoStream, audioStream)]
    stream = new MediaStream(tracks);
    mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9,opus'});
    mediaRecorder.ondataavailable = function (e) {
        blobs.push(e.data);
    }
    mediaRecorder.start();
}

const mergeAudioStreams = (desktopStream, voiceStream) => {
    const context = new AudioContext();

    const source1 = context.createMediaStreamSource(desktopStream);
    const source2 = context.createMediaStreamSource(voiceStream);
    const destination = context.createMediaStreamDestination();

    const desktopGain = context.createGain();
    const voiceGain = context.createGain();

    desktopGain.gain.value = 0.7;
    voiceGain.gain.value = 0.7;

    source1.connect(desktopGain).connect(destination);
    source2.connect(voiceGain).connect(destination);

    return destination.stream.getAudioTracks();
};

function stopCapture() {
    mediaRecorder.stop();
    mediaRecorder.onstop = function () {
        const clipName = prompt('Wybierz nazwę pliku');

        const blob = new Blob(blobs, {type: 'video/webm'});
        chunksVideo = [];
        chunksAudio = [];
        blobs = [];
        const videoURL = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = videoURL;
        link.download = clipName;
        link.click();
        videoStream.getTracks().forEach(function (track) {
            track.stop()
        })
        audioStream.getTracks().forEach(function (track) {
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
