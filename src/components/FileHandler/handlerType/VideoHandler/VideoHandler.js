import React, {useEffect, useState, useRef} from "react";
import Container from "@material-ui/core/Container";
import ReactPlayer from "react-player";
import {makeStyles} from "@material-ui/core/styles";
import VideoControls from "./VideoControls";
import screenfull from "screenfull";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import {useAppContext} from "../../../../Context/AppProvider";
import videoBg from "../../../../assets/video_bg.jpeg"

const useStyles = makeStyles({
    playerWrapper: {
        width: "100%",
        position: "relative",
    },
});

const format = (seconds) => {
    if (isNaN(seconds)) {
        return "00:00";
    }

    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");

    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}}:${ss}`;
    }
    return `${mm}:${ss}`;
};

let count = 0;

function formatBytes(a, b = 2) {
    if (0 === a) return "0 Bytes";
    const c = 0 > b ? 0 : b,
        d = Math.floor(Math.log(a) / Math.log(1024));
    return (
        parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
        " " +
        ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
    );
}

function VideoHandler(props) {
    const classes = useStyles();
    const [dataUrl, setDataUrl] = useState({data: ""});
    const [fileSize, setFileSize] = useState(props.file.size);
    const [state, setState] = useState({
        playing: true,
        muted: false,
        volume: 0.5,
        playbackRate: 1.0,
        played: 0,
        seeking: false,
    });

  const { videoMap, updateVideoMap } = useAppContext();

    const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");

    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [videoTime, setVideoTime] = useState(0);

    const {playing, muted, volume, playbackRate, played, seeking} = state;

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsRef = useRef(null);

    const handlePlayPause = () => {
        setState({...state, playing: !state.playing});
    };

    const handleRewind = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    };

    const handleFastForward = () => {
        playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    };

    const handleMute = () => {
        setState({...state, muted: !state.muted});
    };

    const handleVolumeChange = (e, newValue) => {
        setState({
            ...state,
            volume: parseFloat(newValue / 100),
            muted: newValue === 0 ? true : false,
        });
    };

    const handleVolumeSeekUp = (e, newValue) => {
        setState({
            ...state,
            volume: parseFloat(newValue / 100),
            muted: newValue === 0 ? true : false,
        });
    };

    const handlePlaybackRateChange = (rate) => {
        setState({...state, playbackRate: rate});
    };

    const toggleFullScreen = () => {
        screenfull.toggle(playerContainerRef.current);
    };

    const togglePIP = () => {
        let player = document.getElementById("video").getElementsByTagName("VIDEO")[0];
        if (player !== undefined && player.readyState === 4) {
            if (document.pictureInPictureElement && !active) {
                document.exitPictureInPicture();
            } else {
                player.requestPictureInPicture();
            }
        }
    };
    useEffect(() => {
        togglePIP();
    }, [active]);

  const handleProgress = (changeState) => {
    updateVideoMap(props.fileId, playerRef.current.getCurrentTime());

        if (count > 0) {
            controlsRef.current.style.visibility = "hidden";
            count = 0;
        }

        if (controlsRef.current.style.visibility === "visible") {
            count += 1;
        }

        if (!seeking) {
            setState({...state, ...changeState});
        }
    };

    const handleSeekChange = (e, newValue) => {
        setState({...state, played: parseFloat(newValue / 100)});
    };

    const handleSeekMouseDown = (e) => {
        setState({...state, seeking: true});
    };

    const handleSeekMouseUp = (e, newValue) => {
        setState({...state, seeking: false});
        playerRef.current.seekTo(newValue / 100);
    };

    const handleChangeDisplayFormat = () => {
        setTimeDisplayFormat(
            timeDisplayFormat === "normal" ? "remaining" : "normal"
        );
    };

    const handleMouseMove = () => {
        if (controlsRef.current) {
            controlsRef.current.style.visibility = "visible";
            count = 0;
        }
    };

    const currentTime = playerRef.current
        ? playerRef.current.getCurrentTime()
        : "00:00";

    const duration = playerRef.current
        ? playerRef.current.getDuration()
        : "00:00";

    const elapsedTime =
        timeDisplayFormat === "normal"
            ? format(currentTime)
            : `-${format(duration - currentTime)}`;

    const totalDuration = format(duration);

    useEffect(() => {
        let mounted = true;

        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            if (mounted) {
                setDataUrl({
                    data: event.target.result,
                });
            }
        };
        fileReader.readAsDataURL(props.file);

        if (videoMap.has(props.fileId)) {
            setVideoTime(videoMap.get(props.fileId));
        }

        return function cleanup() {
            mounted = false;
        };
    }, []);

    const rewindVideoAtBeginning = () => {
        playerRef.current.seekTo(videoTime);
        setLoading(true);
    };

    return (
        <Container maxWidth="md">
            <div
                ref={playerContainerRef}
                className={classes.playerWrapper}
                onMouseMove={handleMouseMove}
            >
                <ReactPlayer
                    id={"video"}
                    ref={playerRef}
                    width={"100%"}
                    height={"100%"}
                    url={dataUrl.data}
                    muted={muted}
                    playing={playing}
                    onStart={rewindVideoAtBeginning}
                    volume={volume}
                    playbackRate={playbackRate}
                    onProgress={handleProgress}
                    stopOnUnmount={false}
                    light={
                        videoTime === 0
                            ? videoBg
                            : false
                    }
                    playIcon={
                        <PlayArrowIcon
                            id={"playMe"}
                            style={{
                                color: "white",
                                fontSize: 100,
                                border: "5px solid black",
                                borderRadius: 25,
                                backgroundColor: "black",
                                opacity: 0.85,
                            }}
                            onClick={(e) => {
                                if (fileSize > 50000000) {
                                    if (
                                        window.confirm(
                                            "Rozmiar pliku wynosi: " +
                                            formatBytes(fileSize) +
                                            ". Jego odtworzenie mo??e spowolni?? dzia??anie aplikacji. Czy jeste?? pewny?"
                                        )
                                    ) {
                                        setLoading(true);
                                    } else {
                                        e.stopPropagation();
                                    }
                                } else {
                                    setLoading(true);
                                }
                                console.log(fileSize);
                            }}
                        ></PlayArrowIcon>
                    }
                />
                {loading ? (
                    <VideoControls
                        ref={controlsRef}
                        fileName={props.file.name}
                        onPlayPause={handlePlayPause}
                        playing={playing}
                        onRewind={handleRewind}
                        onFastForward={handleFastForward}
                        muted={muted}
                        onMute={handleMute}
                        onVolumeChange={handleVolumeChange}
                        onVolumeSeekUp={handleVolumeSeekUp}
                        volume={volume}
                        playbackRate={playbackRate}
                        onPlaybackRateChange={handlePlaybackRateChange}
                        onToggleFullScreen={toggleFullScreen}
                        onTogglePictureInPicture={togglePIP}
                        played={played}
                        onSeek={handleSeekChange}
                        onSeekMouseDown={handleSeekMouseDown}
                        onSeekMouseUp={handleSeekMouseUp}
                        elapsedTime={elapsedTime}
                        totalDuration={totalDuration}
                        onChangeDisplayFormat={handleChangeDisplayFormat}
                    />
                ) : (
                    <div></div>
                )}
            </div>
        </Container>
    );
}

export default VideoHandler;
