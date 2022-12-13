import { UploadOutlined } from '@ant-design/icons';
import { Alert, Button, Col, message, Row, Upload } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { addNewEbook, getPresigned } from '../../../services/ebook/ebook-create';
import ChapterForm from './ChapterForm';
const props = {
    // name: 'file',
    headers: {
        'Content-Type': 'application/pdf'
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
};
const CreateBookPDF = ({ ebookDetail, bookID, getEbookInfo }) => {
    const [urlUpload, setUrlUpload] = useState();
    const [uploaded, setUploaded] = useState(false);
    const [pageCount, setPageCount] = useState();
    const [ebookData, setEbookData] = useState();

    const getUploadUrl = async () => {
        if (!bookID) {
            return;
        }
        try {
            const res = await getPresigned({
                object_key: `${bookID}/${bookID}.pdf`,
                method: 'PUT',
                response_type: 'application/pdf'
            });
            setUrlUpload(res.data.url);
        } catch (error) {
            message.error('something went wrong!');
        }
    };
    const handleSplitChapter = async (chapterData) => {
        if (!uploaded) {
            message.error('not uploaded');
            return;
        }
        await addNewEbook({
            book_id: bookID,
            chapters_info: chapterData['chapter-split'],
            type_ebook: 'pdf'
            // status: 'chapter_splitting'
        });
        await getEbookInfo();
    };
    const beforeUpload = (file) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onloadend = function () {
            const count = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
            console.log('Number of Pages:', count);
        };
    };
    const uploadHandle = async (options) => {
        const { onSuccess, onError, file, onProgress } = options;
        const config = {
            headers: { 'content-type': 'application/pdf' }
            // onUploadProgress: (event) => {
            //     const percent = Math.floor((event.loaded / event.total) * 100);
            //     setProgress(percent);
            //     if (percent === 100) {
            //         setTimeout(() => setProgress(0), 1000);
            //     }
            //     onProgress({ percent: (event.loaded / event.total) * 100 });
            // }
        };
        try {
            const res = await axios.put(urlUpload, file, config);
            onSuccess('Ok');
            setUploaded(true);
        } catch (err) {
            const error = new Error('Some error');
            onError({ err });
        }
    };
    useEffect(() => {
        getUploadUrl();
    }, []);
    return (
        <Row gutter={[24, 40]}>
            <Col xs={24}>
                {urlUpload && (
                    <Upload
                        {...props}
                        beforeUpload={beforeUpload}
                        customRequest={uploadHandle}
                        accept="application/pdf">
                        <Button type="primary" size="large" icon={<UploadOutlined />}>
                            Upload PDF
                        </Button>
                    </Upload>
                )}
            </Col>
            {ebookDetail && ebookDetail.status === 'chapter_splitting' && (
                <Col xs={24}>
                    <Alert type="warning" message="Your ebook is in splitting process" banner />
                </Col>
            )}
            <Col xs={24}>
                <h3>Chapter Split</h3>
                <br />
                <ChapterForm handleSplitChapter={handleSplitChapter} ebookDetail={ebookDetail} />
            </Col>
        </Row>
    );
};
export default CreateBookPDF;
