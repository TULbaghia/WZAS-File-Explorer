import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CKEditor from "@ckeditor/ckeditor5-react";
import parse from "html-react-parser";
import "../../App.css";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CreateIcon from "@material-ui/icons/Create";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
  const [fileUrl, setFileUrl] = useState({ data: "" });
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

    let secondFileReader = new FileReader();
    secondFileReader.onload = (event) => {
      if (mounted) {
        setFileUrl({
          data: event.target.result,
        });
      }
    };
    secondFileReader.readAsDataURL(props.file);

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <div className="textHandler">
        <div id="viewer" className="viewer">
          <h2>{props.file.name}</h2>
          <p>{parse(textFromEditor)}</p>
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
        >
          Zapisz
        </Button>
      </div>
    </div>
  );
}

export default TxtHandler;
