import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
    const [open, setOpen] = useState(true);

    const handleGeneralClose = () => {
        setOpen(false);
        setTimeout(() => {
            props.dispatch({
                type: "CLOSE_ALERT",
                payload: {
                    id: props.id,
                }
            });
        }, 200);
    }

    const handleClose = () => {
        handleGeneralClose();
        props.callbackOnCancel();
    };

    const handleOk = () => {
        handleGeneralClose();
        props.callbackOnOk();
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {props.showCancel ? <Button onClick={handleClose}>Anuluj</Button> : ''}
                    <Button onClick={handleOk} color="primary" autoFocus>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}