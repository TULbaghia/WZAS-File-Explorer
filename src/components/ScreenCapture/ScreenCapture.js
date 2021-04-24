import React from 'react';

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

function dumpOptionsInfo(param)
    {
        const videoTrack = param.srcObject.getVideoTracks()[0];

        console.info("Track settings:");
        console.info(JSON.stringify(videoTrack.getSettings(), null, 2));
        console.info("Track constraints:");
        console.info(JSON.stringify(videoTrack.getConstraints(), null, 2));
    }

async function startCapture()
    {
        const videoElem = document.getElementById("video");
        videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        dumpOptionsInfo(videoElem);
    }

function ScreenCapture(props) {
    return (
        <div>
            <p>This example shows you the contents of the selected part of your display.
                Click the Start Capture button to begin.</p>

            <video id="video" autoPlay/>
            <p>
                <button id="start" onClick={() => startCapture()}>Start Capture</button>
                &nbsp;
                <button id="stop">Stop Capture</button>
            </p>
        </div>
    );
}

export default ScreenCapture;
