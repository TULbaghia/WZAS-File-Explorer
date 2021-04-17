import React, {Component} from 'react';
import ResourceList from "../shared/ResourceList";

class WalkDir extends Component {

    constructor(props) {
        super(props);
        this.dirHandle = props.dirHandle;

        this.state = {
            dirs: [],
            files: [],
        }
    }

    async scanDirectory() {
        const files = [];
        const dirs = [];

        for await (let [name, handle] of this.dirHandle) {
            const {kind} = handle;
            if (kind === 'directory') {
                dirs.push({name, handle, kind});
            } else {
                files.push({name, handle, kind});
            }
        }

        return {
            files: files,
            dirs: dirs,
        }
    }

    componentDidMount() {
        this.scanDirectory().then((entries) => {
            this.setState({
                dirs: entries.dirs,
                files: entries.files,
            })
        });
    }

    render() {
        return (
            <>
                {this.state.dirs || this.state.files ?
                    <ResourceList dirs={this.state.dirs} files={this.state.files}/> : ""}
            </>
        );
    }
}

export default WalkDir;