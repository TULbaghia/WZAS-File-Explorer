import React from 'react';
import FiberManualRecordTwoToneIcon from '@material-ui/icons/FiberManualRecordTwoTone';
import PauseCircleFilledTwoToneIcon from '@material-ui/icons/PauseCircleFilledTwoTone';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

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

async function startCapture() {
    videoStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        audioStream = await navigator.mediaDevices.getUserMedia(
            {
                audio: true
            })
    }
    let tracks = [...videoStream.getVideoTracks(), ...mergeAudioStreams(videoStream, audioStream)]
    let stream = new MediaStream(tracks);
    mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm; codecs=vp9,opus'});
    mediaRecorder.ondataavailable = function (e) {
        blobs.push(e.data);
    }
    mediaRecorder.start();
    document.getElementById("stopScreenCapture").hidden = false;
    document.getElementById("startScreenCapture").hidden = true;
}

async function startCamera() {
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

                    document.getElementById("startCameraCapture").hidden = false;
                    document.getElementById("stopCameraCapture").hidden = true;
                };
            }

    document.getElementById("startCameraCapture").hidden = true;
    document.getElementById("stopCameraCapture").hidden = false;
}

function stopCamera() {
    cameraStream.getTracks().forEach(function (track) {
        track.stop();
    });

    document.exitPictureInPicture();
    document.getElementById("startCameraCapture").hidden = false;
    document.getElementById("stopCameraCapture").hidden = true;
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
    document.getElementById("startScreenCapture").hidden = false;
    document.getElementById("stopScreenCapture").hidden = true;
}

function ScreenCapture() {
    return (
        <div>
            <p id={"startScreenCapture"} hidden={false} style={{fontSize: "xxx-large"}}>
                <FiberManualRecordTwoToneIcon fontSize={"inherit"}
                                              style={{position: "absolute", right: "10px", top: "10px"}}
                                              onClick={() => {
                                                  startCapture();
                                              }}/>
            </p>
            <p id={"stopScreenCapture"} hidden={true} style={{fontSize: "xxx-large"}}>
                <PauseCircleFilledTwoToneIcon fontSize={"inherit"}
                                              style={{position: "absolute", right: "10px", top: "10px"}}
                                              onClick={() => {
                                                  stopCapture();
                                              }}/>
            </p>
            <p id={"startCameraCapture"} hidden={false} style={{fontSize: "xxx-large"}}>
                <VideocamIcon fontSize={"inherit"}
                              style={{position: "absolute", right: "60px", top: "10px"}}
                              onClick={() => {
                                  startCamera()
                              }}/>
            </p>
            <p id={"stopCameraCapture"} hidden={true} style={{fontSize: "xxx-large"}}>
                <VideocamOffIcon fontSize={"inherit"}
                                 style={{position: "absolute", right: "60px", top: "10px"}}
                                 onClick={() => {
                                    stopCamera();
                                 }}/>
            </p>
            <video id="camera" height={0} width={0}/>
        </div>
    );
}

export default ScreenCapture;
