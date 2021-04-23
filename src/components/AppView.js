import React from 'react';
import WalkDir from "./WalkDir";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import FileView from "./FileView";
import AddFile from "./AddFile";
import AddDirectory from "./AddDirectory";
import Grid from "@material-ui/core/Grid";

function AppView(props) {
    const lastDirStack = () => props.dirStack[props.dirStack.length - 1];

    const addFile = (file) => {
        let list = Array.from(props.fileList);
        list.push(file);
        props.setFileList(list);

    }
    return (
        <div>
            <header>
                <Grid container direction={"row"} justify={"center"}>
                    <Button onClick={() => props.popStack()} color="primary">
                        <ArrowBackIcon/>
                    </Button>
                    <AddFile dir={lastDirStack()}/>
                    <AddDirectory dir={lastDirStack()}/>
                    {/*-file*/}
                </Grid>
            </header>
            <main>
                <WalkDir addFile={addFile} pushStack={props.pushStack} dir={lastDirStack()}
                         setFileList={props.setFileList} fileList={props.fileList}/>
                <FileView fileList={props.fileList} setFileList={props.setFileList}/>
            </main>
            <footer>
                {/*nextTrack*/}
                {/*prevTrack*/}
                {/*pause*/}
                {/*play*/}
            </footer>
        </div>
    );
}

export default AppView;