import React, { useEffect, useState } from 'react';

function AudioHandler(props) {
    const [dataUrl, setDataUrl] = useState({ data: "" });

    useEffect(() => {
        let mounted = true;

        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            if (mounted) {
                setDataUrl({
                    data: event.target.result
                });
            }
        }
        fileReader.readAsDataURL(props.file);

        return function cleanup() {
            mounted = false;
        }
    }, [])

    let music = document.getElementById('music');

    const start = () => {
        music.play();
        // document.getElementById('playBtn').innerHTML = "Pause";
    }

    const pause = () => {
        music.pause();
    }

    const stop = () => {
        music.pause();
        music.currentTime = 0;
    }

    return (
        < div >
            <audio id="music" src={dataUrl.data}></audio>
            <button id="playBtn" onClick={start}>Play</button>
            <button onClick={pause}>Pause</button>
            <button onClick={stop}>Stop</button>
        </div >
    );
}

export default AudioHandler;