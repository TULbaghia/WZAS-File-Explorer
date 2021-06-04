import React, { useEffect, useState, useRef } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AudioControls from "./AudioControls";
import ReactPlayer from "react-player";

const useStyles = makeStyles({
  playerWrapper: {
    height: "220px",
    width: "100%",
    background: "rgba(189, 189, 189, 1)",
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

function AudioHandler(props) {
  const classes = useStyles();
  const [dataUrl, setDataUrl] = useState({ data: "" });
  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
  });

  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");

  const { playing, muted, volume, playbackRate, played, seeking } = state;

  const audioRef = useRef(null);
  const controlsRef = useRef(null);

  const handleRewind = () => {
    audioRef.current.seekTo(audioRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    audioRef.current.seekTo(audioRef.current.getCurrentTime() + 10);
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
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
    setState({ ...state, playbackRate: rate });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    audioRef.current.seekTo(newValue / 100);
  };

  const currentTime = audioRef.current
    ? audioRef.current.getCurrentTime()
    : "00:00";

  const duration = audioRef.current ? audioRef.current.getDuration() : "00:00";

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

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleProgress = (changeState) => {
    console.log(changeState);

    if (!seeking) {
      setState({ ...state, ...changeState });
    }
  };

  return (
    <Container maxWidth="md">
      <div className={classes.playerWrapper}>
        <ReactPlayer
          width={"100%"}
          height={"100%"}
          ref={audioRef}
          muted={muted}
          playing={playing}
          volume={volume}
          playbackRate={playbackRate}
          url={dataUrl.data}
          autoPlay="true"
          onProgress={handleProgress}
        />
        <AudioControls
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
          played={played}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          onChangeDisplayFormat={handleChangeDisplayFormat}
        />
      </div>
    </Container>
  );
}

export default AudioHandler;
