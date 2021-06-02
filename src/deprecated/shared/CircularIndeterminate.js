import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {CircularProgress} from "@material-ui/core";

export default function CircularIndeterminate({open}) {

    return (
        <div>
            {
                open ? (
                        <Dialog
                            open={open}
                        >
                            <DialogContent
                                style={{
                                    paddingBottom: "20px"
                                }}>
                                <CircularProgress/>
                            </DialogContent>
                        </Dialog>
                    )
                    :
                    ""
            }
        </div>
    );
}