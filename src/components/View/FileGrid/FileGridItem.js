import React from 'react';
import Typography from "@material-ui/core/Typography";
import {Grid} from "@material-ui/core";
import FileCard from "./Card/FileCard";

export default function FileGridItem({files, ...props}) {
    return (
        <>
            <Typography variant={"h4"}>Pliki</Typography>
            <Grid className={"mt-0"} container spacing={3} md={12}>
                {files.map((item) => {
                    return <FileCard {...item}/>
                })}
            </Grid>
        </>
    );
}
