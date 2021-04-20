import React, { useEffect, useState } from "react";
import Container from '@material-ui/core/Container';
import ReactPlayer from 'react-player';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import FastForwardIcon from '@material-ui/icons/FastForward';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip'

const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },

  controlsWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 1,
  },

  controlIcons: {
    color: "#777",
    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },

  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },
})

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 12,
    width: 12,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -4,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 4,
    borderRadius: 4,
  },
  rail: {
    height: 4,
    borderRadius: 4,
  },
})(Slider);


function VideoHandler(props) {
  const classes = useStyles();
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
    <Container maxWidth='sm'>
      <div className={classes.playerWrapper}>

        {/* top controls */}
        <ReactPlayer
          width={"100%"}
          height={"100%"}
          url={dataUrl.data}
          muted={false}
          playing={true}
        />
        <div className={classes.controlsWrapper}>
          <Grid container direction="row" alignItems="center" justify="space-between" style={{ padding: 8 }}>
            <Grid item>
              <Typography variant="h7" style={{ color: "#fff" }}>{props.file.name}</Typography>
            </Grid>
          </Grid>

          {/* mid controls */}
          <Grid container direction="row" alignItems="center" justify="center">

            <IconButton className={classes.controlIcons} aria-label="reqind">
              <FastRewindIcon fontSize="inherit" />
            </IconButton>

            <IconButton className={classes.controlIcons} aria-label="reqind">
              <PlayArrowIcon fontSize="inherit" />
            </IconButton>

            <IconButton className={classes.controlIcons} aria-label="reqind">
              <FastForwardIcon fontSize="inherit" />
            </IconButton>
          </Grid>

          {/* bottom controls */}
          <Grid container direction="row" justify="space-between" alignItems="center" style={{ padding: 8 }}>

            <Grid item xs={12}>
              <PrettoSlider min={0} max={100} defaultValue={20} ValueLabelComponent={ValueLabelComponent} />
            </Grid>

            <Grid item>
              <Grid container alignItems="center" directon="row">
                <IconButton className={classes.bottomIcons}>
                  <PlayArrowIcon fontSize="large" />
                </IconButton>

              </Grid>
            </Grid>
          </Grid>

        </div>
      </div>
    </Container>
  );
}

export default VideoHandler;
