import React from 'react';
import {Button} from "@material-ui/core";

function InitRootHandle(props) {

    const loadDir = (event) => {
        window.showDirectoryPicker().then(value => {
            props.setRootHandle(value);
        }, () => {
            props.setAlertDialog({title: "Błędny katalog", text: "Nie wybrano katalogu.", active: true});
        });
    }

    return (
        <Button color={"primary"} onClick={loadDir}>Wybierz katalog do wczytania</Button>
    );
}
export default InitRootHandle;