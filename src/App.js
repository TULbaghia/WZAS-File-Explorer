import React from "react";
import AppLoadDir from "./components/View/AppLoadDir/AppLoadDir";
import "./App.scss";
import AppView from "./components/View/AppView";
import ScreenCapture from "./components/ScreenCapture/ScreenCapture";
import {useGetDirectory} from "./Context/AppProvider";

function App() {
    const getDirectory = useGetDirectory();

    return (
        <div className="App">
            {getDirectory.length ? <AppView/> : <AppLoadDir/>}
            <ScreenCapture/>
        </div>
    );
}

export default App;
