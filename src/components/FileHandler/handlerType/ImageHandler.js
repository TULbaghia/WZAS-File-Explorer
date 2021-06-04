import React, {useEffect, useState} from 'react';
import Magnifier from 'react-magnifier'


function ImageHandler(props) {
    const [dataUrl, setDataUrl] = useState({data: ""});

    useEffect(() => {
        let mounted = true;

        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            if (mounted) {
                setDataUrl({
                    data: event.target.result
                });
            }
        }
        fileReader.readAsDataURL(props.file);

        return function cleanup() {
            mounted = false;
        }
    }, [])

    return (
        <Magnifier src={dataUrl.data} mgWidth={250} mgHeight={250} mgBorderWidth={5} mgShowOverflow={false} zoomFactor={0.75}/>
    );
}

export default ImageHandler;
