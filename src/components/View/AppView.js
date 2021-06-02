import React from 'react';
import Grid from "@material-ui/core/Grid";
import {Container} from "@material-ui/core";
import AppHeader from "./AppHeader/AppHeader";
import FileGrid from "./FileGrid/FileGrid";

function AppView(props) {
    return (
        <Container fixed>
            <Grid container spacing={2}>
                <AppHeader/>
            </Grid>
            <Grid container spacing={2} md={12}>
                <FileGrid/>
            </Grid>
            {/*        /!*<FileView fileList={props.fileList} setFileList={props.setFileList}/>*!/*/}
        </Container>
    );
}

export default AppView;
