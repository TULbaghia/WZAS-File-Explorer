import React from 'react';
import {
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Grid,
    Typography
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import './DirectoryCardWrapper.scss'
import {usePushDirectory} from "../../../../Context/AppProvider";

export default function DirectoryCard({handle, name, ...props}) {
    const pushDirectoryStack = usePushDirectory();

    const pushDirStack = (name, handle) => {
        pushDirectoryStack({name, handle})
    }

    return (
        <Grid item lg={3} md={4} sm={6} xs={12}>
            <Card>
                <CardActionArea onClick={() => pushDirStack(name, handle)}>
                    <CardContent>
                        <Typography className={"directoryCard"} variant="h6">
                            <FolderIcon/>
                            <div>{name.length > 15 ? name.substring(0, 16) + "…" : name}</div>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary">
                        Share
                    </Button>
                    <Button size="small" color="primary">
                        Learn More
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
}