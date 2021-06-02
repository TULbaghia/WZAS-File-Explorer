import React from 'react';
import Grid from "@material-ui/core/Grid";
import {useGetDirectory, usePopDirectory, usePushDirectory} from "../../../Context/AppProvider";
import {Breadcrumbs, Link, Typography} from "@material-ui/core";

const bcLinkClick = (e, stack, item, popDirectory) => {
    e.preventDefault();
    let stackx = [...stack];
    let popped = null;
    do {
        popped = stackx.pop();
        popDirectory();
    } while (item.handle !== popped.handle);
}


export default function AppHeader(props) {
    const directoryList = useGetDirectory();
    const popDirectory = usePopDirectory();

    const dirListWithoutLast = [...directoryList];
    dirListWithoutLast.pop();

    const dirListLast = directoryList[directoryList.length - 1];

    return (
        <>
            <Grid item md={6}>
                <Breadcrumbs aria-label={"breadcrumbs"}>
                    {dirListWithoutLast.map((item) => {
                        return <Link color="inherit" href="/"
                                     onClick={(e) => bcLinkClick(e, dirListWithoutLast, item, popDirectory)}>
                            {item.name.length > 15 ? item.name.substring(0, 16) + "…" : item.name}
                        </Link>
                    })}
                    {dirListWithoutLast.length ? '' : <span/>}
                    <Typography color="textPrimary">{dirListLast.name}</Typography>
                </Breadcrumbs>
            </Grid>
            <Grid item md={6}>
                {/*    <header>*/}
                {/*        <Grid container direction={"row"} justify={"center"}>*/}
                {/*            /!*<Button onClick={() => props.popStack()} color="primary">*!/*/}
                {/*            /!*    <ArrowBackIcon/>*!/*/}
                {/*            /!*</Button>*!/*/}
                {/*            /!*<AddFile dir={lastDirStack()}/>*!/*/}
                {/*            /!*<AddDirectory dir={lastDirStack()}/>*!/*/}

                {/*            /!*-file*!/*/}
                {/*        </Grid>*/}
                {/*    </header>*/}
                <div>Menu</div>
            </Grid>
        </>
    );
}

