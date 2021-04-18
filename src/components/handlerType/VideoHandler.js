import React, { useEffect, useState } from "react";

function VideoHandler(props) {
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
      <video
        id="video"
        src={dataUrl.data}
        controls
        height="480"
        width="640"
      ></video>
    </div>
  );
}

export default VideoHandler;
