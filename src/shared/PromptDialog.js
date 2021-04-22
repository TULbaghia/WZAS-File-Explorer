import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function PromptDialog(props) {


    return (
        <div>
            <Dialog open={props.open.open} onClose={() => props.setOpen({...props.open, open: false})} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Usuń</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy napewno chcesz usunąć {props.name}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.setOpen({...props.open, open: false})} color="primary">Nie</Button>
                    <Button onClick={() => props.onOkEvent(props.open.handle, props.open.dirHandle)} color="primary">Tak</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
