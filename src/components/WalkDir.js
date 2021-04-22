import React, {useEffect, useState} from 'react';
import ResourceList from "../shared/ResourceList";
import Typography from "@material-ui/core/Typography";

function WalkDir(props) {
    const [dir, setDir] = useState({files: [], dirs: []})

    const scanDirectory = async () => {
        const files = [];
        const dirs = [];

        for await (let [name, handle] of props.dir) {
            const {kind} = handle;
            if (kind === 'directory') {
                dirs.push({name, handle, kind});
            } else {
                files.push({name, handle, kind});
            }
        }

        setDir({files: files, dirs: dirs});
    }

    useEffect(() => {
        scanDirectory().then(() => {});
    })

    return (
        <>
            <section>
                <Typography>Directory</Typography>
                <ResourceList event={props.pushStack} entries={dir.dirs} dir={props.dir}/>
            </section>
            <section>
                <Typography>Files</Typography>
                <ResourceList event={props.addFile} entries={dir.files} dir={props.dir}/>
            </section>
        </>

    );
}

export default WalkDir;
