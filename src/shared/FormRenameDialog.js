import React, {useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormRenameDialog(props) {
    const [fileName, setFileName] = React.useState("");
    const [isInputValid, setIsInputValid] = React.useState(true)

    useEffect(() => {
        setFileName("");
    }, [props.open])

    const handleClose = () => {
        props.setOpen({...props.open, open: false});
    };

    const handleChange = (input) => {
        // setIsInputValid(props.validate(input));
        setFileName(input);
    }

    return (
        <>
            <Dialog open={props.open.open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Zmień nazwę {props.type}u</DialogTitle>
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
                        Nieprawidłowa nazwa {props.type}u
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Wyjdź</Button>
                    <Button onClick={() => props.onOkEvent(fileName)} disabled={!isInputValid} color="primary">Zmień</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
