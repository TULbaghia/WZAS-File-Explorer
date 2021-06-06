import React from 'react';
import Typography from "@material-ui/core/Typography";
import {Grid} from "@material-ui/core";
import DirectoryCard from "./Card/DirectoryCard";

export default function DirectoryGridItem({dirs, ...props}) {
    return (
        <>
            <Typography variant={"h4"}>Katalogi</Typography>
            <Grid className={"mt-0"} container spacing={3}>
                {dirs.map((item) => {
                    return <DirectoryCard key={btoa(item.name)} {...item}/>
                })}
            </Grid>
        </>
    );
}