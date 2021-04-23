import React, {useState} from 'react';
import Button from "@material-ui/core/Button";
import CreateNewFolderRoundedIcon from '@material-ui/icons/CreateNewFolderRounded';
import FormDialog from "../shared/FormDialog";
import AlertDialog from "../shared/AlertDialog";

function AddDirectory(props) {
    const [alertDialog, setAlertDialog] = useState({active: false, title: "", text: ""});
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const clickAddFile = () => {
        setDialogOpen(true);
    }

    const addFile = (name, dir) => {
        dir.getDirectoryHandle(name).then((exists) => {
            setAlertDialog({active: true, title: "Błąd", text:"Taki katalog już istnieje"});
        }).catch((create) => {
            dir.getDirectoryHandle(name, {create: true}).then((e) => {
            });
        })
        setDialogOpen(false);
    }

    const validateNew = (name) => {
        return name !== "";
    }

    return (
        <div>
            <Button onClick={() => clickAddFile()} color="primary">
                <CreateNewFolderRoundedIcon/>
            </Button>
            <FormDialog dir={props.dir} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} addFile={addFile}
                        validate={validateNew}/>
            <AlertDialog setState={setAlertDialog} alertDialog={alertDialog}/>
        </div>
    );
}

export default AddDirectory;