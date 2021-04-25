import React from 'react';

const displayMediaOptions = {
    video: {
        cursor: "always"
    },
    audio: false
};

async function startCapture() {
    const videoElem = getVideoElement();
    videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
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

function ScreenCapture() {
    return (
        <div>
            <p>
                <button onClick={() => startCapture()}>Rozpocznij nagrywanie ekranu</button>
                <button onClick={() => stopCapture()}>Zakończ nagrywanie ekranu</button>
            </p>
            <video id="video" autoPlay/>
        </div>
    );
}

export default ScreenCapture;
