import React, { useEffect, useState, useRef } from "react";
import Container from "@material-ui/core/Container";
import ReactPlayer from "react-player";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PlayerControls from "./PlayerControls";

const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },
});

function VideoHandler(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
  });

  const { playing, muted, volume, playbackRate } = state;

  const playerRef = useRef(null);
  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
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

  const handleVolumeSeekDown = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const handlePlaybackRateChange = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const [dataUrl, setDataUrl] = useState({ data: "" });

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

  return (
    <Container maxWidth="md">
      <div className={classes.playerWrapper}>
        <ReactPlayer
          ref={playerRef}
          width={"100%"}
          height={"100%"}
          url={dataUrl.data}
          muted={muted}
          playing={playing}
          volume={volume}
          playbackRate={playbackRate}
        />
        <PlayerControls
          fileName={props.file.name}
          onPlayPause={handlePlayPause}
          playing={playing}
          onRewind={handleRewind}
          onFastForward={handleFastForward}
          muted={muted}
          onMute={handleMute}
          onVolumeChange={handleVolumeChange}
          onVolumeSeekDown={handleVolumeSeekDown}
          volume={volume}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRateChange}
        />
      </div>
    </Container>
  );
}

export default VideoHandler;
