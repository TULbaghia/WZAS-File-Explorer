import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import NoteAddRoundedIcon from "@material-ui/icons/NoteAddRounded";
import FormDialog from "../shared/FormDialog";
import AlertDialog from "../shared/AlertDialog";

function AddFile(props) {
    const [alertDialog, setAlertDialog] = useState({active: false, title: "", text: ""});
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const clickAddFile = () => {
        setDialogOpen(true);
    }

    const addFile = (name, dir) => {
        name += ".txt";
        dir.getFileHandle(name).then((exists) => {
            setAlertDialog({active: true, title: "Błąd", text:"Taki plik już istnieje"});
        }).catch((create) => {
            dir.getFileHandle(name, {create: true}).then((e) => {
            });
        })
        setDialogOpen(false);
    }

    const validateNew = (name) => {
        return !name.includes(".") && name !== "";
    }

    return (
        <div>
            <Button onClick={() => clickAddFile()} color="primary">
                <NoteAddRoundedIcon/>
            </Button>
            <FormDialog dir={props.dir} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} addFile={addFile}
                        validate={validateNew} type={"plik"}/>
            <AlertDialog setState={setAlertDialog} alertDialog={alertDialog}/>
        </div>
    );
}

export default AddFile;