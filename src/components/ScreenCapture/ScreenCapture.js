import React from 'react';
import styles from './ScreenCapture.module.css';

const videoElem = document.getElementById("video");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");

function ScreenCapture(props) {
    return (
        <div>
            <p>This example shows you the contents of the selected part of your display.
                Click the Start Capture button to begin.</p>

            <p>
                <button id="start" onClick={() => startCapture()}>Start Capture</button>
                &nbsp;
                <button id="stop">Stop Capture</button>
            </p>
            <video id="video" autoPlay></video>
        </div>
);
}

const displayMediaOptions =
    {
        video: {
            cursor: "always"
        }
    ,
        audio: false
    }
;

// stopElem.addEventListener("click", function(evt)
//     {
//         stopCapture();
//     }
// , false);

function dumpOptionsInfo()
    {
        const videoTrack = videoElem.srcObject.getVideoTracks()[0];

        console.info("Track settings:");
        console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
        console.info("Track constraints:");
        console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
    }

async function startCapture()
    {
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo();
    }

export default ScreenCapture;
