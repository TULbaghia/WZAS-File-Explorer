import React from 'react';
import {Button, Card, CardActionArea, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import {
    useAppContext,
    useCloseFileHandle,
    useDispatchAlertDialog,
    useDispatchCircularProgress,
    useDispatchPromptDialog,
    useGetDirectory,
    useGetFileHandle,
    usePushFileHandle
} from "../../../../Context/AppProvider";
import {MoveFileController} from "../FileMoveLogic/MoveDirectoryController";

const colorCrimson = {
    color: "crimson",
}

async function filter(arr, callback) {
    const fail = Symbol()
    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}

export const filterSameList = async (handle, fileList) => {
    let list = Array.from(fileList);
    const results = await filter(list, async x => {
        let result = false;
        await x.handle.isSameEntry(handle).then((b) => result = b);
        return result;
    })

    return results;
}

const removeFile = async (dir, removeHandle, dispatchProgress) => {
    dispatchProgress(true);
    try {
        // noinspection JSUnresolvedFunction
        await dir.handle.removeEntry(removeHandle.name, {recursive: true});
    } catch (e) {
        console.log(e);
    } finally {
        dispatchProgress(false);
    }
}

export const moveFile = async (oldDir, oldFileName, newDir, newFileName, dispatchAlert, dispatchProgress) => {
    dispatchProgress(true);
    try {
        await MoveFileController({
            oldDirHandle: oldDir.handle,
            oldFileName: oldFileName,
            newDirHandle: newDir.handle,
            newFileName: newFileName,
            removeAfter: true
        });
    } catch (e) {
        dispatchAlert({
            title: "Błąd",
            message: e
        });
    } finally {
        dispatchProgress(false);
    }
}

export default function FileCard({handle, name, ...props}) {
    const dispatchProgress = useDispatchCircularProgress();
    const dispatchPrompt = useDispatchPromptDialog();
    const dispatchAlert = useDispatchAlertDialog();
    const getDirectoryStack = useGetDirectory();
    const getFileHandle = useGetFileHandle();
    const dispatchPushFileHandle = usePushFileHandle();
    const dispatchCloseFileHandle = useCloseFileHandle();

    const {addToAudioList, deleteFromAudioList} = useAppContext();

    const getCurrentDir = () => [...getDirectoryStack].pop();

    const openFile = async (e, dispatchAlert) => {
        const results = await filterSameList(handle, getFileHandle)

        if (!results.length) {
            if (isAnyAudioOpened(getFileHandle) && handle.name.includes('.mp3')) {
                console.log("Udalo sie");
                addToAudioList({name, handle, getCurrentDir, directoryStack: [...getDirectoryStack]})
            } else {
                dispatchPushFileHandle({name, handle, getCurrentDir, directoryStack: [...getDirectoryStack]});
            }
        } else {
            dispatchAlert({
                title: "Błąd",
                message: "Ten plik jest już uruchomiony"
            })
        }
    }

    const isAnyAudioOpened = (fileHandle) => {
        let isAnyAudioOpened = false;
        let list = Array.from(fileHandle);
        list.forEach(x => {
            if (x.handle.name.includes(".mp3")) {
                isAnyAudioOpened = true;
            }
        })
        return isAnyAudioOpened;
    }

    const onDeleteButton = async (e) => {
        const result = await filterSameList(handle, getFileHandle);
        if (result.length === 0) {
            dispatchAlert({
                title: "Usuwanie",
                message: (<>Czy na pewno chcesz usunąć plik:<br/><small style={colorCrimson}>{name}</small></>),
                showCancel: true,
                callbackOnOk: () => removeFile(getCurrentDir(), handle, dispatchProgress)
            });
        } else {
            dispatchAlert({
                title: "Błąd",
                message: "Nie mozna usunąć otwartego pliku"
            })
        }
    }

    const onRenameFile = (e) => {
        const isFileOpen = getFileHandle.some(file => file.handle.name === name);
        if (!isFileOpen) {
            dispatchPrompt({
                title: "Zmiana nazwy pliku",
                message: (
                    <>Podaj nową nazwę pliku:<br/>
                        <small style={colorCrimson}>{name}</small><br/>
                        <small>Zmiana nazwy polega na kopiowaniu, może to chwilę potrwać</small></>
                ),
                label: "Nazwa pliku",
                callbackOnOk: (newName) => moveFile(getCurrentDir(), name, getCurrentDir(), newName, dispatchAlert, dispatchProgress),
                callbackValidator: ((input) => /^[\w,\s-]+\.[a-z0-9]{3}$/.test(input)),
                validationMessage: "Nieprawidłowa nazwa pliku",
            });
        } else {
            dispatchAlert({
                title: "Błąd",
                message: "Zamknij plik przed zmianą nazwy"
            })
        }
    }

    const onDrag = (e) => {
        window.draggable = {type: "FILE", handle, name};
    }

    return (
        <Grid item lg={3} md={4} sm={6} xs={12}>
            <Card draggable={true} onDrag={onDrag}>
                <CardActionArea onClick={(e) => openFile(e, dispatchAlert)}>
                    <CardContent>
                        <Typography className={"directoryCard"} variant="h6">
                            <InsertDriveFileIcon/>
                            <div>{name.length > 15 ? name.substring(0, 16) + "…" : name}</div>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={"file_dir--card--buttons"}>
                    <Button edge="end" size="small" onClick={onDeleteButton}>
                        <DeleteIcon/>
                    </Button>
                    <Button edge="end" size="small" onClick={onRenameFile}>
                        <CreateIcon/>
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}