import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props) {
    const [fileName, setFileName] = React.useState("");
    const [isInputValid, setIsInputValid] = React.useState(false)

    useEffect(() => {
        setFileName("");
    }, [props.dialogOpen])

    const handleClose = () => {
        props.setDialogOpen(false);
    };

    const handleChange = (input) => {
        setIsInputValid(props.validate(input));
        setFileName(input);
    }

    return (
        <>
            <Dialog open={props.dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Dodaj nowy {props.type}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                       Podaj nazwę {props.type}u
                    </DialogContentText>
                    <TextField
                        value={fileName}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nazwa"
                        type="email"
                        onChange={(e) => handleChange(e.target.value)}
                        fullWidth
                    />
                    <DialogContentText style={ {color: "crimson", visibility: !isInputValid ? "visible" : "hidden"}}>
                        Nieprawidłowa nazwa
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Wyjdź</Button>
                    <Button onClick={() => props.addFile(fileName, props.dir)} disabled={!isInputValid} color="primary">Utwórz</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
