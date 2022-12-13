import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Space } from 'antd';
import React from 'react';

import './style.css';
const ChapterForm = ({ handleSplitChapter, ebookDetail }) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log('Received values of form:', values);
        if (!ebookDetail) {
            handleSplitChapter(values);
        }
    };
    if (ebookDetail) {
        form.setFieldsValue({ 'chapter-split': ebookDetail['chapters'] });
    }
    const cannotEdit = ebookDetail ? true : false;
    return (
        <Form
            name="dynamic_form_nest_item"
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            className="form-hehe">
            <Form.List name="chapter-split" initialValue={[{ name: '', start: '', end: '' }]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }, index) => {
                            return (
                                <Space
                                    key={key}
                                    size={30}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 10
                                    }}
                                    align="baseline">
                                    <span>{index + 1}</span>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'chapter_name']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing Chapter name'
                                            }
                                        ]}>
                                        <Input placeholder="Chapter Name" disabled={cannotEdit} />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'chapter_from']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing chapter from'
                                            }
                                        ]}>
                                        <InputNumber
                                            className="custom-width-input-number"
                                            placeholder="Chapter page start"
                                            disabled={cannotEdit}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'chapter_to']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing chapter page end'
                                            }
                                        ]}>
                                        <InputNumber
                                            className="custom-width-input-number"
                                            placeholder="Chapter page to"
                                            disabled={cannotEdit}
                                        />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        disabled={cannotEdit}
                                        onClick={() => {
                                            remove(name);
                                        }}
                                    />
                                </Space>
                            );
                        })}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}>
                                Add Chapter
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item>
                {!ebookDetail && (
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                )}
            </Form.Item>
        </Form>
    );
};
export default ChapterForm;
