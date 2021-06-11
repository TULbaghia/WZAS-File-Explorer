import React, {forwardRef} from "react";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Button, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FastRewindIcon from "@material-ui/icons/FastRewind";
import FastForwardIcon from "@material-ui/icons/FastForward";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOff from "@material-ui/icons/VolumeOff";
import PlaylistPlayIcon from '@material-ui/icons/PlaylistPlay';
import Popover from "@material-ui/core/Popover";
import {useAppContext, useCloseFileHandle, usePushFileHandle} from "../../../../Context/AppProvider";

const useStyles = makeStyles({
    controlsWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        color: "#777",
        "&:hover": {
            color: "#fff",
        },
    },
    volumeSlider: {
        width: 100,
    },
});

function ValueLabelComponent(props) {
    const {children, open, value} = props;

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
        backgroundColor: "#fff",
        border: "2px solid currentColor",
        marginTop: -4,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
        },
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)",
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

export default forwardRef(
    (
        {
            fileName,
            onPlayPause,
            playing,
            onRewind,
            onFastForward,
            muted,
            onMute,
            onVolumeChange,
            onVolumeSeekUp,
            volume,
            playbackRate,
            onPlaybackRateChange,
            played,
            onSeek,
            onSeekMouseDown,
            onSeekMouseUp,
            elapsedTime,
            totalDuration,
            onChangeDisplayFormat,
            onAudioChange
        },
        ref
    ) => {
        const classes = useStyles();

        const [anchorEl, setAnchorEl] = React.useState(null);
        const [anchorElPlaylist, setAnchorElPlaylist] = React.useState(null);

        const {audioList} = useAppContext();

        const handlePopover = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handlePopoverPlaylist = (event) => {
            setAnchorElPlaylist(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleClosePlaylist = () => {
            setAnchorElPlaylist(null);
        };

        const open = Boolean(anchorEl);
        const openPlaylist = Boolean(anchorElPlaylist);

        const id = open ? "playbackrate-popover" : undefined;
        const idPlaylist = openPlaylist ? "popover" : undefined;

        return (
            <div className={classes.controlsWrapper} ref={ref}>
                {/* top controls */}
                <Grid
                    container
                    direction="row"
                    alignItems="center"
                    justify="space-between"
                    style={{padding: 8}}
                >
                    <Grid item>
                        <Typography variant="h5" style={{color: "#fff"}}>
                            {fileName}
                        </Typography>
                    </Grid>
                </Grid>

                {/* mid controls */}
                <Grid container direction="row" alignItems="center" justify="center">
                    <IconButton
                        onClick={onRewind}
                        className={classes.controlIcons}
                        aria-label="reqind"
                    >
                        <FastRewindIcon fontSize="inherit"/>
                    </IconButton>

                    <IconButton
                        onClick={onPlayPause}
                        className={classes.controlIcons}
                        aria-label="reqind"
                    >
                        {playing ? (
                            <PauseIcon fontSize="inherit"/>
                        ) : (
                            <PlayArrowIcon fontSize="inherit"/>
                        )}
                    </IconButton>

                    <IconButton
                        onClick={onFastForward}
                        className={classes.controlIcons}
                        aria-label="reqind"
                    >
                        <FastForwardIcon fontSize="inherit"/>
                    </IconButton>
                </Grid>

                {/* bottom controls */}
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                    style={{padding: 8}}
                >
                    <Grid item xs={12}>
                        <PrettoSlider
                            min={0}
                            max={100}
                            value={played * 100}
                            ValueLabelComponent={(props) => (
                                <ValueLabelComponent {...props} value={elapsedTime}/>
                            )}
                            onChange={onSeek}
                            onMouseDown={onSeekMouseDown}
                            onChangeCommitted={onSeekMouseUp}
                        />
                    </Grid>

                    <Grid item>
                        <Grid container alignItems="center" directon="row">
                            <IconButton onClick={onPlayPause} className={classes.bottomIcons}>
                                {playing ? (
                                    <PauseIcon fontSize="medium"/>
                                ) : (
                                    <PlayArrowIcon fontSize="medium"/>
                                )}
                            </IconButton>

                            <IconButton onClick={onMute} className={classes.bottomIcons}>
                                {muted ? (
                                    <VolumeOff fontSize="medium"/>
                                ) : (
                                    <VolumeUpIcon fontSize="medium"/>
                                )}
                            </IconButton>

                            <Slider
                                className={classes.volumeSlider}
                                min={0}
                                max={100}
                                value={volume * 100}
                                onChange={onVolumeChange}
                                onChangeCommitted={onVolumeSeekUp}
                            />
                            <Button
                                onClick={onChangeDisplayFormat}
                                variant="text"
                                style={{color: "#fff", marginLeft: 16}}
                            >
                                <Typography>
                                    {elapsedTime}/{totalDuration}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center" directon="row">
                            {/*speed*/}
                            <Grid item>
                                <Button
                                    onClick={handlePopover}
                                    variant="text"
                                    className={classes.bottomIcons}
                                >
                                    <Typography>{playbackRate}X</Typography>
                                </Button>

                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                >
                                    <Grid container direction="column-reverse">
                                        {[0.5, 1, 1.5, 2].map((rate) => (
                                            <Button
                                                onClick={() => onPlaybackRateChange(rate)}
                                                variant="text"
                                            >
                                                <Typography
                                                    color={rate === playbackRate ? "secondary" : "default"}
                                                >
                                                    {rate}
                                                </Typography>
                                            </Button>
                                        ))}
                                    </Grid>
                                </Popover>
                            </Grid>
                            {/*playlist*/}
                            <Grid item>
                                <Button
                                    onClick={handlePopoverPlaylist}
                                    variant="text"
                                    className={classes.bottomIcons}
                                >
                                    <PlaylistPlayIcon/>
                                </Button>

                                <Popover
                                    id={idPlaylist}
                                    open={openPlaylist}
                                    anchorEl={anchorElPlaylist}
                                    onClose={handleClosePlaylist}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "center",
                                    }}
                                    transformOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                >
                                    <Grid container direction="column-reverse">
                                        {Array.from(audioList).map((x) => (
                                                <Button
                                                    onClick={() => {
                                                        onAudioChange(x);
                                                    }}
                                                    variant="text"
                                                >
                                                    <Typography>
                                                        {x.name}
                                                    </Typography>
                                                </Button>
                                            )
                                        )}
                                    </Grid>
                                </Popover>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
);
