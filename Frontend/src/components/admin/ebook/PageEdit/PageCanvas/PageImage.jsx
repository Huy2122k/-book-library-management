import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';

const PageImage = ({
    imageUrl,
    setCanvasMeasures,
    setStageScale,
    setOriginalMeasures,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    canvasWidthRef
}) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        const imageToLoad = new window.Image();
        imageToLoad.src = imageUrl;
        imageToLoad.addEventListener('load', () => {
            setImage(imageToLoad);
            setStageScale(canvasWidthRef.current.offsetWidth / imageToLoad.width);
            setCanvasMeasures({
                width: imageToLoad.width,
                height: imageToLoad.height
            });
            setOriginalMeasures({
                width: imageToLoad.width,
                height: imageToLoad.height
            });
        });

        return () => imageToLoad.removeEventListener('load', null);
    }, [imageUrl, setImage, setCanvasMeasures]);

    return (
        <Image
            image={image}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        />
    );
};

export default PageImage;
