import React, { useEffect, useState } from "react";
import CommonHandler from "./handlerType/CommonHandler";
import AudioHandler from "./handlerType/AudioHandler/AudioHandler";
import VideoHandler from "./handlerType/VideoHandler/VideoHandler";
import TxtHandler from "./handlerType/TxtHandler";
import ImageHandler from "./handlerType/ImageHandler";

function FileHandler(props) {
  const [file, setFile] = useState({});

  const handleFile = () => {
    props.data.getFile().then((file) => setFile(file));
  };

  useEffect(() => {
    let mounted = true;

    props.data.getFile().then((file) => {
      if (mounted) {
        setFile(file);
      }
    });

    return function cleanup() {
      mounted = false;
    };
  }, []);

  const renderFile = () => {
    if (file.type || file.type === "") {
      if (file.type === "" && file.name.endsWith(".pptx")) {
        return "PPTX";
      } else if (file.type === "text/plain") {
        return <TxtHandler file={file} />;
      } else if (file.type === "audio/mpeg") {
        return <AudioHandler file={file} />;
      } else if (file.type === "video/mp4") {
        return <VideoHandler file={file} fileId={props.fileId} />;
      } else if (file.type.match("image/*")) {
        return <ImageHandler file={file} />;
      } else {
        return <CommonHandler file={file} />;
      }
    }
  };

  return <>{renderFile()}</>;
}

export default FileHandler;
