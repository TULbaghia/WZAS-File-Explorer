import React from 'react';

const displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};

function dumpOptionsInfo(param) {
    const videoTrack = param.srcObject.getVideoTracks()[0];

    console.info("Track settings:");
    console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
    console.info("Track constraints:");
    console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
}

async function startCapture() {
    const videoElem = getVideoElement();
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    dumpOptionsInfo(videoElem);
}

function stopCapture() {
    let video = getVideoElement();
    let tracks = video.srcObject.getTracks();

    tracks.forEach(track => track.stop());
    video.srcObject = null;
}

function getVideoElement() {
    return document.getElementById("video");
}

function ScreenCapture(props) {
    return (
        <div>
            <p>
                <button id="start" onClick={() => startCapture()}>Start Capture</button>
                &nbsp;
                <button id="stop" onClick={() => stopCapture()}>Stop Capture</button>
            </p>
            <video id="video" autoPlay/>
        </div>
    );
}

export default ScreenCapture;
