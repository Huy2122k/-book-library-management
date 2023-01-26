import React from 'react';
import { Rect, Transformer } from 'react-konva';

const Rectangle = ({
    shapeProps,
    isSelected,
    onSelect,
    onChange,
    canvasMeasures,
    originalMeasures,
    edit
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    React.useEffect(() => {
        if (isSelected) {
            if (edit) {
                // we need to attach transformer manually
                trRef.current.nodes([shapeRef.current]);
                trRef.current.getLayer().batchDraw();
            } else {
                trRef.current.stopTransform();
            }
        }
    }, [isSelected]);

    const onMouseEnter = (e) => {
        if (edit) {
            e.target.getStage().container().style.cursor = 'move';
        }
    };

    const onMouseLeave = (e) => {
        e.target.getStage().container().style.cursor = 'crosshair';
    };

    return (
        <React.Fragment>
            <Rect
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                fill={isSelected ? 'red' : 'yellow'}
                strokeWidth={2}
                draggable={edit}
                strokeScaleEnabled={false}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onDragMove={(e) => {
                    let xNew = e.target.x();
                    let yNew = e.target.y();
                    const node = shapeRef.current;
                    if (e.target.x() < 0) {
                        xNew = 0;
                    }
                    if (e.target.y() < 0) {
                        yNew = 0;
                    }
                    if (
                        (e.target.x() + node.attrs['width']) *
                            (canvasMeasures.width / originalMeasures.width) >
                        canvasMeasures.width
                    ) {
                        xNew = originalMeasures.width - node.attrs['width'];
                    }
                    if (
                        (e.target.y() + node.attrs['height']) *
                            (canvasMeasures.width / originalMeasures.width) >
                        canvasMeasures.height
                    ) {
                        yNew = originalMeasures.height - node.attrs['height'];
                    }
                    const pos = node.position();
                    const newPos = { ...pos, x: xNew, y: yNew };
                    node.position(newPos);
                }}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY)
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (
                            newBox.x + newBox.width > canvasMeasures.width ||
                            newBox.y + newBox.height > canvasMeasures.height ||
                            newBox.x < 0 ||
                            newBox.y < 0
                        ) {
                            return oldBox;
                        }
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    rotateEnabled={false}
                />
            )}
        </React.Fragment>
    );
};

export default Rectangle;
