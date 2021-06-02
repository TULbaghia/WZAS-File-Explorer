import React, {useEffect, useState} from 'react';
import FileGridItem from "./FileGridItem";
import {Grid} from "@material-ui/core";
import DirectoryGridItem from "./DirectoryGridItem";
import {useGetDirectory} from "../../../Context/AppProvider";

const scanDirectory = async (dir, setDir) => {
    const files = [];
    const dirs = [];

    for await (let [name, handle] of dir.handle) {
        const {kind} = handle;
        if (kind === 'directory') {
            dirs.push({name, handle, kind});
        } else {
            files.push({name, handle, kind});
        }
    }

    setDir({files: files, dirs: dirs});
}

export default function FileGrid(props) {
    const [directoryContent, setDirectoryContent] = useState({files: [], dirs: []});
    const getDirectoryStack = useGetDirectory();

    useEffect(async () => {
        await scanDirectory([...getDirectoryStack].pop(), setDirectoryContent);
    });

    return (
        <>
            <Grid item md={12}>
                <DirectoryGridItem dirs={directoryContent.dirs}/>
            </Grid>
            <Grid item md={12}>
                <FileGridItem files={directoryContent.files}/>
            </Grid>
        </>
    );
}