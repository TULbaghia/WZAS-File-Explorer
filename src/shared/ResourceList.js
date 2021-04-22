import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 752,
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
}));

export default function ResourceList(props) {
    const classes = useStyles();

    const removeEntry = (handle, dirHandle) => {
        dirHandle.removeEntry(handle.name, { recursive: true }).then();
    }

    const generate = (element) => {
        let i = 0;
        return element.map((value) => {
                return (
                    <ListItem key={i++} onClick={() => props.event(value.handle)}>
                        <ListItemAvatar>
                            <Avatar>
                                {value.kind === "directory" ? <FolderIcon /> : <InsertDriveFileIcon />}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={value.name}/>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon onClick={() => removeEntry(value.handle, props.dir)}/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            }
        );
    }

    return (
        <div className={classes.root}>
            <Grid item xs={12} md={6}>
                <div className={classes.demo}>
                    <List dense={false}>
                        {props.entries ? generate(props.entries) : ""}
                    </List>
                </div>
            </Grid>
         </div>
    );
}
