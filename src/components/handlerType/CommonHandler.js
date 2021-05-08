import React, { useEffect, useState } from "react";

function CommonHandler(props) {
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
        <iframe width="100%" height="1000px" src={dataUrl.data}/>
    );
}

export default CommonHandler;
