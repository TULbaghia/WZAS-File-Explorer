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
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import PromptDialog from "./PromptDialog";
import FormRenameDialog from "./FormRenameDialog";
import CreateIcon from '@material-ui/icons/Create';
import {MoveDirectoryController, MoveFileController} from "../../components/logic/MoveDirectoryController";
import CircularIndeterminate from "./CircularIndeterminate";

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
    const [open, setOpen] = React.useState({open: false, handle: undefined, dirHandle: undefined});
    const [openRename, setOpenRename] = React.useState({open: false, handle: undefined, dirHandle: undefined});
    const [openSpinner, setOpenSpinner] = React.useState(false);

    const classes = useStyles();

    const filterList = async (handle, fileList) => {
        async function filter(arr, callback) {
            const fail = Symbol()
            return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
        }

        let list = Array.from(fileList);
        const results = await filter(list, async x => {
            let result = false;
            await x.isSameEntry(handle).then((b) => result = b);
            return !result;
        })

        props.setFileList(results);
    }


    const removeEntry = (handle, dirHandle) => {
        dirHandle.removeEntry(handle.name, {recursive: true}).then(() => {
            filterList(handle, props.fileList);
            setOpen({...open, open: false, handle: undefined, dirHandle: undefined})
            setOpenRename({...openRename, open: false, handle: undefined, dirHandle: undefined})
        });
    }

    const moveEntry = (newFileName) => {
        setOpen({...open, open: false, handle: undefined, dirHandle: undefined});
        setOpenRename({...openRename, open: false, handle: undefined, dirHandle: undefined});
        setOpenSpinner(true);


        if (openRename.handle.kind === "directory") {
            MoveDirectoryController({
                oldDirHandle: openRename.dirHandle,
                oldDirName: openRename.handle.name,
                newDirHandle: openRename.dirHandle,
                newDirName: newFileName,
                removeAfter: true
            }).then(() => {
                setOpenSpinner(false);
            }).catch((error) => {
                setOpenSpinner(false);
                alert(error);
            });
        } else {
            MoveFileController({
                oldDirHandle: openRename.dirHandle,
                oldFileName: openRename.handle.name,
                newDirHandle: openRename.dirHandle,
                newFileName: newFileName + "." + openRename.handle.name.split('.').pop(),
                removeAfter: true
            }).then(() => {
                setOpenSpinner(false);
            }).catch((error) => {
                setOpenSpinner(false);
                alert(error);
            });
        }
    }

    const handleDelete = (handle, dirHandle) => {
        setOpen({...open, open: true, handle: handle, dirHandle: dirHandle});
    }

    const handleMove = (handle, dirHandle) => {
        setOpenRename({...openRename, open: true, handle: handle, dirHandle: dirHandle});
    }

    const handleOnDrag = async (e, src) => {
        console.log("ondrag");
        window.draggableObject = src;
    }

    const handleOnDrop = (e, dst) => {
        setOpenSpinner(true);
        if (window.draggableObject != null) {
            if (window.draggableObject.kind === "directory") {
                MoveDirectoryController({
                    oldDirHandle: props.dir,
                    oldDirName: window.draggableObject.handle.name,
                    newDirHandle: dst.handle,
                    newDirName: window.draggableObject.handle.name,
                    removeAfter: true
                }).catch((error) => {
                    alert(error);
                }).finally(() => {
                    setOpenSpinner(false);
                    window.draggableObject = null;
                });
            } else {
                MoveFileController({
                    oldDirHandle: props.dir,
                    oldFileName: window.draggableObject.handle.name,
                    newDirHandle: dst.handle,
                    newFileName: window.draggableObject.handle.name,
                    removeAfter: true
                }).catch((error) => {
                    alert(error);
                }).finally(() => {
                    setOpenSpinner(false);
                    window.draggableObject = null;
                });
            }
        }
    }


    const generate = (element) => {
        let i = 0;
        return element.map((value) => {
                let listItemProps = {
                    onDrag: ((e) => handleOnDrag(e, value)),
                };
                if (value.kind === "directory") {
                    listItemProps = {
                        ...listItemProps,
                        onDrop: ((e) => handleOnDrop(e, value)),
                        onDragOver: ((e) => {e.preventDefault()})
                    };
                }

                return (
                    <ListItem key={i++} onClick={() => props.event(value.handle)}
                              draggable={true}
                              {...listItemProps}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                {value.kind === "directory" ? <FolderIcon/> : <InsertDriveFileIcon/>}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={value.name}/>
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete"
                                        onClick={() => handleDelete(value.handle, props.dir)}>
                                <DeleteIcon/>
                            </IconButton>
                            <IconButton edge="end" aria-label="rename" onClick={() => handleMove(value.handle, props.dir)}>
                                <CreateIcon/>
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
            {open.open ? <PromptDialog open={open} setOpen={setOpen} onOkEvent={removeEntry}/> : ""}
            {openRename.open ?
                <FormRenameDialog open={openRename} setOpen={setOpenRename} onOkEvent={moveEntry} type={"plik"}/> : ""}
            <CircularIndeterminate open={openSpinner}/>
        </div>
    );
}
