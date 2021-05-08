import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import "../../App.css";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CreateIcon from "@material-ui/icons/Create";
import VisibilityIcon from "@material-ui/icons/Visibility";
import FileSaver from "file-saver";
import { htmlToText } from "html-to-text";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

ClassicEditor.defaultConfig = {
  toolbar: ["undo", "redo", "|", "selectAll"],
};

function TxtHandler(props) {
  const classes = useStyles();
  const [textFromEditor, setTextFromEditor] = useState("");
  const [initialText, setInitialText] = useState({ data: "" });
  const [editMode, setEditMode] = useState(false);

  function handleOnCLick() {
    if (document.getElementById("editor").style.visibility == "visible") {
      document.getElementById("editor").style.visibility = "hidden";
      document.getElementById("viewer").style.visibility = "visible";
      setEditMode(false);
    } else {
      document.getElementById("viewer").style.visibility = "hidden";
      document.getElementById("editor").style.visibility = "visible";
      setEditMode(true);
    }
  }

  useEffect(() => {
    let mounted = true;

    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (mounted) {
        setInitialText({
          data: event.target.result,
        });
      }
    };
    fileReader.readAsText(props.file);

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const handleSave = () => {
    let string = htmlToText(textFromEditor).toString();
    var blob = new Blob([string], {
      type: "text/plain;charset=utf-8",
    });
    FileSaver.saveAs(blob, props.file.name);
  };

  return (
    <div>
      <div className="textHandler">
        <div id="viewer" className="viewer">
          <h4>{props.file.name}</h4>
          {htmlToText(textFromEditor)}
        </div>
        <div id="editor" className="editor">
          <CKEditor
            editor={ClassicEditor}
            data={initialText.data}
            onChange={(event, editor) => {
              const editorData = editor.getData();
              setTextFromEditor(editorData);
            }}
          />
        </div>
      </div>
      <div className="buttons">
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleOnCLick}
          className={classes.button}
          startIcon={editMode ? <VisibilityIcon /> : <CreateIcon />}
        >
          {editMode ? "Wyświetl" : "Edytuj"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className={classes.button}
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Zapisz
        </Button>
      </div>
    </div>
  );
}

export default TxtHandler;
