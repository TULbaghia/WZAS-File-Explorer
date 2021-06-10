import React from 'react';

var mediaRecorder;
var videoStream;
var audioStream;
var cameraStream;
var blobs = [];
var video;
var canvas;

const displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: true,
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: 'video/mp4'
};

const cameraConstraints = {
    audio: false,
    video: {
        width: 1280, height: 720
    }
};

export async function startCapture() {
    videoStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        audioStream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true
            })
    }
    let tracks;
    if (videoStream.getAudioTracks().length === 0) {
        tracks = [...videoStream.getVideoTracks(), ...mergeAudioStreams(audioStream, audioStream)]
    } else {
        tracks = [...videoStream.getVideoTracks(), ...mergeAudioStreams(videoStream, audioStream)]
    }
    let stream = new MediaStream(tracks);
    mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9,opus'});
    mediaRecorder.ondataavailable = function (e) {
        blobs.push(e.data);
    }
    mediaRecorder.start();
    document.getElementById("stopScreenCapture").style.display = "";
    document.getElementById("startScreenCapture").style.display = "none";
}

export async function startCamera() {
    cameraStream = await navigator.mediaDevices.getUserMedia(cameraConstraints);

    let video = document.getElementById('camera');
    if ("srcObject" in video) {
        video.srcObject = cameraStream;
    } else {
        video.src = window.URL.createObjectURL(cameraStream);
    }

    video.onloadedmetadata = function (ev) {
        video.play();
        video.requestPictureInPicture();
        video.onleavepictureinpicture = e => {
            cameraStream.getTracks().forEach(function (track) {
                track.stop();
            });

            document.getElementById("startCameraCapture").style.display = "";
            document.getElementById("stopCameraCapture").style.display = "none";
        };
    }

    document.getElementById("startCameraCapture").style.display = "none";
    document.getElementById("stopCameraCapture").style.display = "";
}

export function stopCamera() {
    cameraStream.getTracks().forEach(function (track) {
        track.stop();
    });

    document.exitPictureInPicture();
    document.getElementById("startCameraCapture").style.display = "";
    document.getElementById("stopCameraCapture").style.display = "none";
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

export function stopCapture() {
    mediaRecorder.stop();
    mediaRecorder.onstop = function () {
        const clipName = prompt('Wybierz nazwę pliku');

        const blob = new Blob(blobs, {type: 'video/webm'});
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
    document.getElementById("startScreenCapture").style.display = "";
    document.getElementById("stopScreenCapture").style.display = "none";
}

export function ScreenCapture() {
    return (
        <div>

            <video id="camera" height={0} width={0}/>
        </div>
    );
}

export default ScreenCapture;
