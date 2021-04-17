import React, {useEffect, useState} from 'react';

function FileHandler(props) {
    const [dataUrl, setDataUrl] = useState({data: ""})

    const handleFile = () => {
        props.data.handle.getFile().then((file) => {
            let fileReader = new FileReader();
            fileReader.onload = (event) => {
                setDataUrl({
                    data: event.target.result
                });
            }
            fileReader.readAsDataURL(file);
        }, () => {
            alert("nie działa");
        })
    }

    useEffect(() => handleFile())

    return (
        <>
            <iframe src={dataUrl.data}/>
        </>
    );
}

export default FileHandler;