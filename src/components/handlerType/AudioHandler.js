import React, { useEffect, useState } from "react";

function AudioHandler(props) {
  const [dataUrl, setDataUrl] = useState({ data: "" });

  useEffect(() => {
    let mounted = true;

    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      if (mounted) {
        setDataUrl({
          data: event.target.result,
        });
      }
    };
    fileReader.readAsDataURL(props.file);

    return function cleanup() {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <audio id="music" src={dataUrl.data} controls></audio>
    </div>
  );
}

export default AudioHandler;
