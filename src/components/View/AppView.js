import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Container} from "@material-ui/core";
import AppHeader from "./AppHeader/AppHeader";
import FileGrid from "./FileGrid/FileGrid";
import FileView from "../FileHandler/FileView";

function AppView(props) {
    return (
        <Container fixed>
            <Grid container spacing={2}>
                <AppHeader/>
            </Grid>
            <Grid container spacing={2}>
                <FileGrid/>
            </Grid>
            <Grid container spacing={2}>
                <FileView fileList={props.fileList} setFileList={props.setFileList}/>
            </Grid>
        </Container>
    );
}

export default AppView;
