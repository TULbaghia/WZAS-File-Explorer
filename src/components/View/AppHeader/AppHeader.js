import React from 'react';
import Grid from "@material-ui/core/Grid";
import {
    useDispatchAlertDialog,
    useDispatchCircularProgress,
    useDispatchPromptDialog,
    useGetDirectory,
    useGetFileHandle,
    usePopDirectory
} from "../../../Context/AppProvider";
import {Breadcrumbs, Button, Link, Typography} from "@material-ui/core";
import {filterSameList, moveFile} from "../FileGrid/Card/FileCard";
import {filterSameDirs, moveDirectory} from "../FileGrid/Card/DirectoryCard";
import {CreateNewFolder, NoteAdd} from "@material-ui/icons";
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';

const colorCrimson = {
    color: "crimson"
}

const bcLinkClick = async (e, stack, item, popDirectory) => {
    e.preventDefault();
    let popped = null;
    do {
        popped = stack.pop();
        popDirectory();
    } while (item.handle !== popped.handle);
}

const promptCreateNew = async (type, dirHandle, dispatchPrompt, dispatchAlert, dispatchProgress) => {
    if (type === "FILE")
        dispatchPrompt({
            title: "Tworzenie nowego pliku",
            message: (<>Podaj nazwę nowego pliku:<br/><small style={colorCrimson}>Obsługa tylko dla plików
                txt</small></>),
            label: "Nazwa pliku",
            callbackOnOk: (input) => createNewFile(dirHandle, input, dispatchAlert, dispatchProgress),
            callbackValidator: ((input) => /^([A-Za-z0-9]+|[A-Za-z0-9]+.txt)$/.test(input)),
            validationMessage: "To pole zawiera nieprawidłowe znaki",
        });

    if (type === "DIR")
        dispatchPrompt({
            title: "Tworzenie nowego katalogu",
            message: "Podaj nazwę nowego katalogu:",
            label: "Nazwa katalogu",
            callbackOnOk: (input) => createNewDirectory(dirHandle, input, dispatchAlert, dispatchProgress),
            callbackValidator: ((input) => /^[A-Za-z0-9]+$/.test(input)),
            validationMessage: "To pole zawiera nieprawidłowe znaki",
        });
}

const createNewFile = async (dirHandle, fileName, dispatchAlert, dispatchProgress) => {
    dispatchProgress(true);
    if (!fileName.endsWith('.txt')) fileName += '.txt';

    try {
        // noinspection JSUnresolvedFunction
        await dirHandle.getFileHandle(fileName);
        dispatchAlert({title: "Błąd", message: "Taki plik już istnieje"});
    } catch (e) {
        // noinspection JSUnresolvedFunction
        await dirHandle.getFileHandle(fileName, {create: true});
    } finally {
        dispatchProgress(false);
    }
}

const createNewDirectory = async (dirHandle, dirName, dispatchAlert, dispatchProgress) => {
    dispatchProgress(true);
    try {
        // noinspection JSUnresolvedFunction
        await dirHandle.getDirectoryHandle(dirName);
        dispatchAlert({title: "Błąd", message: "Taki katalog już istnieje"});
    } catch (e) {
        // noinspection JSUnresolvedFunction
        await dirHandle.getDirectoryHandle(dirName, {create: true});
    } finally {
        dispatchProgress(false);
    }
}


export default function AppHeader(props) {
    const directoryList = useGetDirectory();
    const popDirectory = usePopDirectory();
    const dispatchPrompt = useDispatchPromptDialog();
    const dispatchAlert = useDispatchAlertDialog()
    const dispatchProgress = useDispatchCircularProgress();
    const getFileHandle = useGetFileHandle();

    const directoryL = [...directoryList];
    const dirListLast = directoryL.pop();

    const promptCreate = async (type) => {
        await promptCreateNew(type, dirListLast.handle, dispatchPrompt, dispatchAlert, dispatchProgress);
    }

    const onDrop = async (e, handle) => {
        const droppableFile = window.draggable;
        window.draggable = null;
        if (droppableFile != null && droppableFile.handle != null) {
            const openFiles = await filterSameList(droppableFile.handle, getFileHandle);
            const usedDirs = await filterSameDirs(droppableFile.handle, getFileHandle);
            if (openFiles.length === 0 && usedDirs.length === 0) {
                dispatchAlert({
                    title: "Przeniesienie katalogu",
                    message: (
                        <>Nastąpi przeniesienie:<br/>
                            <small style={colorCrimson}>{droppableFile.name}</small><br/>
                            do katalogu <br/>
                            <small style={colorCrimson}>{handle.name}</small><br/>
                            <small>Zmiana przeniesienie polega na utworzeniu kopii, może to chwilę potrwać</small></>
                    ),
                    callbackOnOk: () => {
                        if (droppableFile.type === "DIR")
                            moveDirectory(dirListLast, droppableFile.name, handle, droppableFile.name, dispatchAlert, dispatchProgress).then();
                        if (droppableFile.type === "FILE")
                            moveFile(dirListLast, droppableFile.name, handle, droppableFile.name, dispatchAlert, dispatchProgress).then();
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
        <>
            <Grid item md={6} sm={6} xs={12}>
                <Breadcrumbs className={"header--breadcrumb"} aria-label={"breadcrumbs"}>
                    {directoryL.map((item) => {
                        return <Link color="inherit" href="/"
                                     onClick={(e) => bcLinkClick(e, directoryL, item, popDirectory)}
                                     onDragOver={(e) => e.preventDefault()}
                                     onDrop={(e) => onDrop(e, item)}>
                            {item.name.length > 15 ? item.name.substring(0, 16) + "…" : item.name}
                        </Link>
                    })}
                    {directoryL.length ? '' : <span/>}
                    <Typography
                        color="textPrimary">{dirListLast.name.length > 20 ? dirListLast.name.substring(0, 32) + "…" : dirListLast.name}</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid className={"header--nav-buttons"} item md={6} sm={6} xs={12}>
                <Button onClick={popDirectory}><AssignmentReturnIcon/></Button>
                <Button onClick={() => promptCreate("FILE")}><NoteAdd/></Button>
                <Button onClick={() => promptCreate("DIR")}><CreateNewFolder/></Button>
            </Grid>
        </>
    );
}

