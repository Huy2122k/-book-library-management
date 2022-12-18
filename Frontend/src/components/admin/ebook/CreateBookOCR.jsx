import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Modal, Row, message } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { addNewChapter, getChapters } from '../../../services/ebook/ebook-create';
import ChapterUpload from './ChapterUpload';
import './style.css';
const CreateBookOCR = ({ ebookDetail, bookID }) => {
    const [urlUpload, setUrlUpload] = useState();
    const [chapterList, setChapterList] = useState([]);
    // const [chapter, setChapter] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formCreateChapter] = Form.useForm();

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
    const fetchChapters = async (options) => {
        if (!bookID) {
            navigate('/notfound');
            return;
        }
        try {
            const res = await getChapters({ book_id: bookID });
            console.log(res);
            if (!res.data) {
                return;
            }
            setChapterList(res.data);
        } catch (error) {
            message.error('something went wrong!');
        }
    };
    const onCreateChapter = async (values) => {
        try {
            console.log('Received values of form: ', values);
            const res = await addNewChapter({
                book_id: bookID,
                chapter_name: values['chapterName'],
                chapter_number: values['chapter_number']
            });
            console.log(res);
            const chapterDetail = res.data;
            console.log(chapterDetail._id.$oid);
            setIsModalOpen(false);
            // setChapter(chapterDetail);
            fetchChapters();
        } catch (error) {
            message.error('something went wrong!');
        }
    };
    useEffect(() => {
        fetchChapters();
    }, []);
    return (
        <>
            <Row gutter={[24, 40]} style={{ textAlign: 'center' }}>
                {chapterList &&
                    chapterList.map((chapter, ind) => {
                        return (
                            <Col xs={24} key={chapter._id.$oid} className="dnd-up">
                                <ChapterUpload
                                    refreshChapter={fetchChapters}
                                    chapterDetail={chapter}
                                />
                            </Col>
                        );
                    })}
                <Col xs={24}>
                    <Button
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                        type="primary"
                        size="large"
                        icon={<PlusCircleOutlined />}>
                        Create Chapter
                    </Button>
                </Col>
            </Row>
            <Modal
                visible={isModalOpen}
                // open={}
                title="Create a new Chapter"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => {
                    setIsModalOpen(false);
                }}
                onOk={() => {
                    formCreateChapter
                        .validateFields()
                        .then((values) => {
                            formCreateChapter.resetFields();
                            onCreateChapter(values);
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}>
                <Form form={formCreateChapter} layout="vertical" name="form_in_modal">
                    <Form.Item
                        name="chapterName"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the title of Chapter!'
                            }
                        ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="chapter_number"
                        label="Chapter index"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the index of chapter!'
                            }
                        ]}>
                        <InputNumber className="custom-width-input-number" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default CreateBookOCR;
