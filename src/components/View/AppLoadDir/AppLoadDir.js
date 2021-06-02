import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {useDispatchAlertDialog, usePushDirectory} from "../../../Context/AppProvider";
import './AppLoadDirWrapper.scss'

const loadDir = (event, pushDirectory, dispatchAlert) => {
    // noinspection JSUnresolvedFunction
    window.showDirectoryPicker().then(value => {
        value.requestPermission({mode: "readwrite"}).then(result => {
            pushDirectory({name: value.name, handle: value});
        })
    }, () => {
        dispatchAlert({title: "Błędny katalog", message: "Nie wybrano katalogu."});
    });
}

export default function AppLoadDir(props) {
    const pushDirectory = usePushDirectory();
    const dispatchAlert = useDispatchAlertDialog();

    return (
        <Grid id={"initAppLoadDir"} container spacing={1} justify={"center"} alignItems={"center"}>
            <Button id={"initAppLoadButton"} color={"primary"} variant={"contained"}
                    onClick={(e) => loadDir(e, pushDirectory, dispatchAlert)}>
                Wybierz katalog do wczytania
            </Button>
        </Grid>
    );
}