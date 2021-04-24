import React from 'react';


var mediaRecorder;


async function startCapture() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');
        navigator.mediaDevices.getUserMedia (
            // constraints - only audio needed for this app
            {
                audio: true
            })

            // Success callback
            .then(function(stream) {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                mediaRecorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                }
                console.log(mediaRecorder.state)
            })

            // Error callback
            .catch(function(err) {
                    console.log('The following getUserMedia error occurred: ' + err);
                }
            );
    } else {
        console.log('getUserMedia not supported on your browser!');
    }





}

let chunks = [];


function stopCapture() {
    mediaRecorder.stop();
    mediaRecorder.onstop = function(e) {
        console.log("recorder stopped");

        const clipName = prompt('Enter a name for your sound clip');

        const clipContainer = document.createElement('article');
        const clipLabel = document.createElement('p');
        const audio = document.createElement('audio');
        const deleteButton = document.createElement('button');

        clipContainer.classList.add('clip');
        audio.setAttribute('controls', '');
        deleteButton.innerHTML = "Delete";
        clipLabel.innerHTML = clipName;

        const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;

        var link = document.createElement("a"); // Or maybe get it from the current document
        link.href = audioURL;
        link.download = "microphone-sound.opus";
        link.innerHTML = "Click here to download the file";
        document.body.appendChild(link);

        deleteButton.onclick = function(e) {
            let evtTgt = e.target;
            evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        }
    }
}


function AudioCapture(props) {
    return (
        <div>
            <p>
                <button id="start recording" onClick={() => startCapture()}>Start Recording Microphone</button>
                &nbsp;
                <button id="stop recording" onClick={() => stopCapture()}>Stop Recording Microphone</button>
            </p>
        </div>
    );


}

export default AudioCapture;
