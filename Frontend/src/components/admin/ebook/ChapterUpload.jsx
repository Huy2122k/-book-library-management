import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Modal, Upload, message } from 'antd';
import update from 'immutability-helper';
import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios_instance from '../../../services/ebook/axios-ebook';
import { addNewPage, runOCR, updatePage } from '../../../services/ebook/ebook-create';
import DragableUploadListItem from './DragUpload';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const fileListRender = (file, index) => {
    return {
        uid: file.$oid,
        name: `page${index + 1}`,
        status: 'done',
        url: file.presigned_img
    };
};
const mapStatus = {
    new: 'info',
    processing: 'warning',
    error: 'error',
    ready: 'success'
};
const ChapterUpload = ({ refreshChapter, chapterDetail }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState(chapterDetail.pages.map(fileListRender));
    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8
                }}>
                Add page
            </div>
        </div>
    );
    // const beforeUpload = (file) => {
    //     const reader = new FileReader();
    //     reader.readAsBinaryString(file);
    //     reader.onloadend = function () {
    //         const count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
    //         console.log('Number of Pages:', count);
    //     };
    // };
    const uploadHandle = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const config = {
            headers: { 'content-type': 'image/*' }
        };
        const index = fileList.map((file) => file.uid).indexOf(file.uid);
        try {
            const createdPage = await addNewPage({
                chapter_id: chapterDetail._id.$oid,
                page_number: index + 1,
                page_type: 'page_ocr'
            });
            const urlPut = createdPage.data['presigned_url'];
            const res = await axios_instance.put(urlPut, file, config);
            const updated = await updatePage(createdPage.data['id'], { image_status: 'ready' });
            onSuccess('Ok');
            if (index === fileList.length) {
                refreshChapter();
            }
        } catch (err) {
            console.log(err);
            const error = new Error('Some error');
            onError({ err });
        }
    };
    const startOCR = async () => {
        try {
            const createdPage = await runOCR({
                chapter_id: chapterDetail._id.$oid,
                type: 'chapter'
            });
            message.success('Chapter OCR is running');
            refreshChapter();
        } catch (err) {
            console.log(err);
            message.error('some thing went wrong');
        }
    };
    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = fileList[dragIndex];
            setFileList(
                update(fileList, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRow]
                    ]
                })
            );
        },
        [fileList]
    );
    return (
        <>
            <h3>
                {chapterDetail['chapter_number']}. {chapterDetail['chapter_name']}
            </h3>
            {chapterDetail.status && (
                <div>
                    <Alert
                        type={mapStatus[chapterDetail.status.bounding_box_status]}
                        message={`Your ebook ocr is ${chapterDetail.status.bounding_box_status}`}
                        banner
                    />
                </div>
            )}
            {/* <Upload
                // beforeUpload={beforeUpload}
                customRequest={uploadHandle}
                listType="picture-card"
                multiple={true}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                // directory
            >
                {fileList.length <= 0 ? uploadButton : ''}
            </Upload> */}
            <DndProvider backend={HTML5Backend}>
                <Upload
                    customRequest={uploadHandle}
                    listType="picture-card"
                    multiple={true}
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    itemRender={(originNode, file, currFileList) => (
                        <DragableUploadListItem
                            originNode={originNode}
                            file={file}
                            fileList={currFileList}
                            moveRow={moveRow}
                        />
                    )}>
                    {uploadButton}
                </Upload>
            </DndProvider>
            <div className="btn-group">
                <Button type="primary" onClick={startOCR}>
                    Start OCR
                </Button>
                <Button type="danger">Delete Chapter</Button>
            </div>
            <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    style={{
                        width: '100%'
                    }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};
export default ChapterUpload;
