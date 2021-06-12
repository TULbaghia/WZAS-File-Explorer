import React from 'react';
import {Button, Card, CardActionArea, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import './DirectoryCardWrapper.scss'
import {
    useDispatchAlertDialog,
    useDispatchCircularProgress,
    useDispatchPromptDialog,
    useGetDirectory,
    useGetFileHandle,
    usePushDirectory
} from "../../../../Context/AppProvider";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from "@material-ui/icons/Create";
import {MoveDirectoryController} from "../FileMoveLogic/MoveDirectoryController";
import {moveFile, filterSameList} from "./FileCard";

const colorCrimson = {
    color: "crimson",
}

async function filter(arr, callback) {
    const fail = Symbol()
    return (await Promise.all(arr.map(async item => (await callback(item)) ? item : fail))).filter(i => i !== fail)
}

export const filterSameDirs = async (dirHandle, fileHandle) => {
    let flatted = fileHandle.flatMap(x => x.directoryStack);
    const results = await filter(flatted, async x => {
        let result = false;
        await x.handle.isSameEntry(dirHandle).then((b) => result = b);
        return result;
    })
    return results;
}

const removeDirectory = async (dir, removeHandle, dispatchProgress) => {
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

export const moveDirectory = async (oldDir, oldDirName, newDir, newDirName, dispatchAlert, dispatchProgress) => {
    dispatchProgress(true);
    try {
        await MoveDirectoryController({
            oldDirHandle: oldDir.handle,
            oldDirName: oldDirName,
            newDirHandle: newDir.handle,
            newDirName: newDirName,
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


export default function DirectoryCard({handle, name, ...props}) {
    const pushDirectoryStack = usePushDirectory();
    const dispatchProgress = useDispatchCircularProgress();
    const dispatchPrompt = useDispatchPromptDialog();
    const dispatchAlert = useDispatchAlertDialog();
    const getDirectoryStack = useGetDirectory();
    const getFileHandle = useGetFileHandle();

    const getCurrentDir = () => [...getDirectoryStack].pop();


    const pushDirStack = (name, handle) => {
        pushDirectoryStack({name, handle})
    }

    const onDeleteButton = async (e) => {
        const usedDirs = await filterSameDirs(handle, getFileHandle);
        if (usedDirs.length === 0) {
            dispatchAlert({
                title: "Usuwanie",
                message: (
                    <>Czy na pewno chcesz usunąć katalog:<br/><small style={colorCrimson}>{name}</small></>
                ),
                showCancel: true,
                callbackOnOk: () => removeDirectory(getCurrentDir(), handle, dispatchProgress)
            })
        } else {
            dispatchAlert({
                title: "Błąd",
                message: "Zamknij plik w katalogu, który chcesz usunąć",
            });
        }
    }

    const onRenameDirectory = async (e) => {
        const usedDirs = await filterSameDirs(handle, getFileHandle);
        if (usedDirs.length === 0) {
            dispatchPrompt({
                title: "Zmiana nazwy katalogu",
                message: (
                    <>Podaj nową nazwę katalogu:<br/>
                        <small style={colorCrimson}>{name}</small><br/>
                        <small>Zmiana nazwy polega na kopiowaniu, może to chwilę potrwać</small></>
                ),
                label: "Nazwa katalogu",
                callbackOnOk: (newName) => moveDirectory(getCurrentDir(), name, getCurrentDir(), newName, dispatchAlert, dispatchProgress),
                callbackValidator: ((input) => /^[A-Za-z0-9_\- ]+$/.test(input)),
                validationMessage: "To pole zawiera nieprawidłowe znaki",
            });
        } else {
            dispatchAlert({
                title: "Błąd",
                message: "Zamknij plik w katalogu, którego nazwę chcesz zmienić",
            });
        }
    }

    const onDrag = (e) => {
        window.draggable = {type: "DIR", handle, name};
    }

    const onDrop = async (e) => {
        const droppableFile = window.draggable;
        window.draggable = null;
        if (droppableFile != null && droppableFile.handle != null) {
            const isSame = await droppableFile.handle.isSameEntry(handle);
            const openFiles = await filterSameList(droppableFile.handle, getFileHandle);
            const usedDirs = await filterSameDirs(droppableFile.handle, getFileHandle);
            if (!isSame && openFiles.length === 0 && usedDirs.length === 0) {
                dispatchAlert({
                    title: "Przeniesienie katalogu",
                    message: (
                        <>Nastąpi przeniesienie:<br/>
                            <small style={colorCrimson}>{droppableFile.name}</small><br/>
                            do katalogu <br/>
                            <small style={colorCrimson}>{name}</small><br/>
                            <small>Zmiana przeniesienie polega na utworzeniu kopii, może to chwilę potrwać</small></>
                    ),
                    callbackOnOk: () => {
                        try {
                            if (droppableFile.type === "DIR")
                                moveDirectory(getCurrentDir(), droppableFile.name, {handle}, droppableFile.name, dispatchAlert, dispatchProgress).then();
                            if (droppableFile.type === "FILE")
                                moveFile(getCurrentDir(), droppableFile.name, {handle}, droppableFile.name, dispatchAlert, dispatchProgress).then();
                        } catch (e) {
                            dispatchAlert({title: "Błąd", message: e});
                        }
                    },
                    showCancel: true,
                });
            } else if (openFiles.length !== 0) {
                dispatchAlert({
                    title: "Błąd",
                    message: "Zamknij plik przed przeniesieniem do innej lokalizacji",
                });
            } else if (usedDirs.length !== 0) {
                dispatchAlert({
                    title: "Błąd",
                    message: "Zamknij plik w przenoszonym katalogu",
                });
            }
        }
    }

    return (
        <Grid item lg={3} md={4} sm={6} xs={12}>
            <Card draggable={true} onDrag={onDrag} onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
                <CardActionArea onClick={() => pushDirStack(name, handle)}>
                    <CardContent>
                        <Typography className={"directoryCard"} variant="h6">
                            <FolderIcon/>
                            <div>{name.length > 15 ? name.substring(0, 16) + "…" : name}</div>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className={"file_dir--card--buttons"}>
                    <Button edge="end" size="small" onClick={onDeleteButton}>
                        <DeleteIcon/>
                    </Button>
                    <Button edge="end" size="small" onClick={onRenameDirectory}>
                        <CreateIcon/>
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}