import InitRootHandle from "./components/InitRootHandle";
import React, { useState } from "react";
import AlertDialog from "./shared/AlertDialog";
import AppView from "./components/AppView";
import Typography from "@material-ui/core/Typography";
import ScreenCapture from "./components/ScreenCapture/ScreenCapture";

function App() {
  const [dirStack, setDirStack] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [alertDialog, setAlertDialog] = useState({
    active: false,
    title: "",
    text: "",
  });

  const popStack = () => {
    if (dirStack.length > 1) {
      let list = Array.from(dirStack);
      list.pop();
      setDirStack(list);
    }
  };

  const pushStack = (dirHandle) => {
    let list = Array.from(dirStack);
    list.push(dirHandle);
    setDirStack(list);
  };

  return (
    <div className="App">
      <header className={"App-header"}>
        <Typography>
          {dirStack.length === 0
            ? ""
            : "/" + dirStack.map((x) => x.name).join(" -> ")}
        </Typography>
      </header>
      <main className={"App-main"}>
        {dirStack.length === 0 ? (
          <InitRootHandle
            setRootHandle={pushStack}
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
          />
        ) : (
          <AppView
            dirStack={dirStack}
            fileList={fileList}
            setFileList={setFileList}
            popStack={popStack}
            pushStack={pushStack}
            alertDialog={alertDialog}
            setAlertDialog={setAlertDialog}
          />
        )}
        <AlertDialog setState={setAlertDialog} alertDialog={alertDialog} />
      </main>
      <ScreenCapture/>
      <footer className={"App-footer"} />
    </div>
  );
            
}

export default App;
