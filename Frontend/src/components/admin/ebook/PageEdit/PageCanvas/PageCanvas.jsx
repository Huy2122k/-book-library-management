import React, { useRef, useState } from 'react';
import { BiSave, BiZoomIn, BiZoomOut } from 'react-icons/bi';
import { Layer, Stage } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import PageImage from './PageImage';
import Rectangle from './Rectangle';
import './style.css';

const SCALEBY = 1.02;

const PageCanvas = (props) => {
    // Các bounding box được khởi tạo trước
    // Id bounding box được chọn
    const canvasWidthRef = useRef();
    const [selectedId, selectShape] = React.useState(props.editSentenceId);
    // Kích thước canvas
    const [canvasMeasures, setCanvasMeasures] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [originalMeasures, setOriginalMeasures] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    // Phục vụ cho phóng to/thu nhỏ
    const [stageScale, setStageScale] = useState(0.5);

    // Sử dụng để vẽ hình mới
    const [newRectangle, setNewRectangle] = useState([]);

    const handleMouseDown = (e) => {
        if (props.edit) {
            if (e.target.constructor.name === 'Image') {
                if (selectedId === null && newRectangle.length === 0) {
                    const { x, y } = e.target.getStage().getRelativePointerPosition();
                    const id = uuidv4();
                    setNewRectangle([
                        { x, y, width: 0, height: 0, fill: 'yellow', opacity: 0.3, id: id }
                    ]);
                    selectShape(id);
                }
            }
        }
    };

    const handleMouseUp = (e) => {
        if (props.edit) {
            if (newRectangle.length === 1) {
                const sx = newRectangle[0].x;
                const sy = newRectangle[0].y;
                const { x, y } = e.target.getStage().getRelativePointerPosition();
                const id = uuidv4();
                const rectangleToAdd = {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    id: id,
                    fill: 'red',
                    opacity: 0.3
                };
                selectShape(id);
                if (rectangleToAdd.width === 0 || rectangleToAdd.height === 0) {
                    setNewRectangle([]);
                } else {
                    const rectangles = [...props.sentenceBounding_box];
                    rectangles.push(rectangleToAdd);
                    setNewRectangle([]);
                    props.setSentenceBounding_box(rectangles);
                }
            }
        }
    };

    const handleMouseMove = (e) => {
        if (props.edit) {
            if (newRectangle.length === 1) {
                const sx = newRectangle[0].x;
                const sy = newRectangle[0].y;
                const { x, y } = e.target.getStage().getRelativePointerPosition();
                const id = uuidv4();
                setNewRectangle([
                    {
                        x: sx,
                        y: sy,
                        width: x - sx,
                        height: y - sy,
                        id: id,
                        fill: 'red',
                        opacity: 0.3
                    }
                ]);
            }
        }
    };

    const handleMouseEnter = (e) => {
        e.target.getStage().container().style.cursor = 'crosshair';
    };

    const handleKeyDown = (e) => {
        // Xoá bounding box khi ấn delete/backspace
        if (props.edit) {
            if (e.keyCode === 8 || e.keyCode === 46) {
                if (selectedId !== null) {
                    const newRectangles = props.sentenceBounding_box.filter(
                        (rectangle) => rectangle.id !== selectedId
                    );
                    props.setSentenceBounding_box(newRectangles);
                }
            }
        }
    };

    const handleRefresh = () => {
        // Các bounding box được khởi tạo trước
        props.setSentenceBounding_box();
        setNewRectangle([]);
    };

    const rectangleToDraw = [...props.sentenceBounding_box, ...newRectangle];

    return (
        <div className="page-canvas" key={props.editSentenceId} style={{ width: 595 }}>
            <div className="config-button" style={{ width: 595 }}>
                <button
                    title="Phóng to"
                    onClick={() => {
                        setStageScale(stageScale * SCALEBY);
                        let newCanvasMeasures = {
                            width: canvasMeasures.width * SCALEBY,
                            height: canvasMeasures.height * SCALEBY
                        };
                        setCanvasMeasures(newCanvasMeasures);
                    }}>
                    <BiZoomIn />
                </button>
                <button
                    title="Thu nhỏ"
                    onClick={() => {
                        setStageScale(stageScale / SCALEBY);
                        let newCanvasMeasures = {
                            width: canvasMeasures.width / SCALEBY,
                            height: canvasMeasures.height / SCALEBY
                        };
                        setCanvasMeasures(newCanvasMeasures);
                    }}>
                    <BiZoomOut />
                </button>
                <button
                    title="Lưu bounding box"
                    onClick={props.saveBoundingBox}
                    style={{ display: props.edit ? 'flex' : 'none' }}>
                    <BiSave />
                </button>
            </div>
            <div
                ref={canvasWidthRef}
                className="canvas"
                tabIndex={1}
                onKeyDown={handleKeyDown}
                style={{ width: 595, height: 842 }}>
                <Stage
                    scaleX={stageScale}
                    scaleY={stageScale}
                    width={canvasMeasures.width}
                    height={canvasMeasures.height}
                    canvasWidthRef={canvasWidthRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}>
                    <Layer>
                        <PageImage
                            setCanvasMeasures={setCanvasMeasures}
                            canvasMeasures={canvasMeasures}
                            setOriginalMeasures={setOriginalMeasures}
                            canvasWidthRef={canvasWidthRef}
                            imageUrl={props.imageUrl}
                            setStageScale={setStageScale}
                            onMouseDown={() => {
                                // deselect when clicked on empty area
                                selectShape(null);
                            }}
                        />
                        {rectangleToDraw.map((rect, i) => {
                            // Loại bỏ sentenceId
                            let sentenceId = rect.sentenceId;
                            let rectCopy = JSON.parse(JSON.stringify(rect));
                            delete rectCopy.sentenceId;
                            return (
                                <Rectangle
                                    key={i}
                                    sentenceId={sentenceId}
                                    shapeProps={
                                        rect.id === selectedId
                                            ? { ...rectCopy, fill: 'red' }
                                            : rectCopy
                                    }
                                    isSelected={rect.id === selectedId}
                                    onSelect={() => {
                                        selectShape(rect.id);
                                    }}
                                    onChange={(newAttrs) => {
                                        const rectangles = [...props.sentenceBounding_box];
                                        const rects = rectangles.slice();
                                        let temp = newAttrs;
                                        temp.sentenceId = sentenceId;
                                        rects[i] = newAttrs;
                                        props.setSentenceBounding_box(rects);
                                    }}
                                    canvasMeasures={canvasMeasures}
                                    originalMeasures={originalMeasures}
                                    edit={props.edit}
                                />
                            );
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default PageCanvas;
