import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import React, { useState } from 'react';
import { getPresigned } from '../../../services/ebook/ebook-create';
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
const ChapterUpload = ({ chapterDetail }) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
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
            headers: { 'content-type': 'application/pdf' }
        };
        try {
            const pageId = await addNewPage({});
            const urlPut = getPresigned({
                object_key: `${chapterDetail._id.$oid}/${pageID}`,
                method: 'PUT'
            });
            const res = await axios.put(urlPut, file, config);
            onSuccess('Ok');
        } catch (err) {
            const error = new Error('Some error');
            onError({ err });
        }
    };
    return (
        <>
            <h3>
                {chapterDetail['index']}. {chapterDetail['chapter_name']}
            </h3>
            <Upload
                // beforeUpload={beforeUpload}
                customRequest={uploadHandle}
                listType="picture-card"
                multiple={true}
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                directory>
                {fileList.length <= 0 ? uploadButton : ''}
            </Upload>
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
