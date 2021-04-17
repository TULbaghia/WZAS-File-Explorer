import React, {Component} from 'react';
import AlertDialog from "../shared/AlertDialog";
import {Button} from "@material-ui/core";
import WalkDir from "./WalkDir";

class LoadDir extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedDir: undefined,
            isModalOpen: false,
        };
        this.loadDir = this.loadDir.bind(this);
        this.setModalState = this.setModalState.bind(this);
    }

    loadDir(event) {
        window.showDirectoryPicker().then(value => {
            this.setState({
                loadedDir: value,
            });
        }, () => {
            this.setState({
                loadedDir: undefined,
                isModalOpen: true,
            });
        });
    }

    setModalState(isOpen) {
        this.setState(() => ({
            isModalOpen: isOpen,
        }));
    }


    render() {
        return (
            <>
                {this.state.loadedDir !== undefined ?
                    <WalkDir dirHandle={this.state.loadedDir}/> :
                    <Button color={"primary"} onClick={this.loadDir}>Wybierz katalog do wczytania</Button>}
                <AlertDialog setState={this.setModalState}
                             open={this.state.isModalOpen}
                             title={"Wystąpił problem"}
                             text={"Nie wybrano katalogu."}/>
            </>
        );
    }
}

export default LoadDir;