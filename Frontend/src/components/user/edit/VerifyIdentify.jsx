import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Image, Input, message, Row, Upload } from 'antd';
import { useState } from 'react';
import UserService from '../../../services/user.service';
const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};
const VerifyIdentify = ({ userInfo, setUserStatus }) => {
    const [loading, setLoading] = useState({ front: false, back: false, face: false });
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [identifyNumber, setIdentifyNumber] = useState(userInfo.IdentityNum);
    const [listImageURL, setListImageURL] = useState({
        front: userInfo.FrontsideURL,
        back: userInfo.BacksideURL,
        face: userInfo.FaceURL
    });
    const [listImageObj, setListImageObj] = useState({
        front: undefined,
        back: undefined,
        face: undefined
    });
    const uploadButton = (key) => (
        <div>
            {loading[key] ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8
                }}>
                {'Upload ' + key + ' image'}
            </div>
        </div>
    );
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };
    const onChange = (keyImg) => (info) => {
        console.log(info.file);
        const tmp = { ...listImageObj };
        tmp[keyImg] = info.file.originFileObj;
        const tmpUrl = { ...listImageURL };
        switch (info.file.status) {
            case 'uploading':
                setLoading(true);
                break;
            case 'done':
                setLoading(false);
                setListImageObj(tmp);
                getBase64(info.file.originFileObj, (url) => {
                    tmpUrl[keyImg] = url;
                    setListImageURL(tmpUrl);
                });
                break;
            default:
                // error or removed
                message.error('error!');
                setLoading(false);
        }
    };
    const notice = () => {
        switch (userInfo.IdentityStatus) {
            case 'unconfirmed':
                return (
                    <Alert
                        type="error"
                        message="Please submit your Identify Verify  request"
                        banner
                    />
                );
            case 'confirmed':
                return <Alert type="success" message="Admin verified!" banner />;
            case 'waiting':
                return <Alert type="warning" message="Waiting for Admin confirmed" banner />;
            case 'rejected':
                return (
                    <Alert
                        type="error"
                        message="Admin rejected, please submit confirmation again!"
                        banner
                    />
                );
            default:
                break;
        }
    };
    const clearField = () => {
        setIdentifyNumber('');
        setListImageURL({
            front: undefined,
            back: undefined,
            face: undefined
        });
        setListImageObj({
            front: undefined,
            back: undefined,
            face: undefined
        });
    };
    const sendRequestVerify = async () => {
        if (userInfo.IdentityStatus === 'confirmed') {
            message.error('You are already confirmed');
            return;
        }
        if (userInfo.IdentityStatus === 'waiting') {
            message.error('Waiting admin confirmation');
            return;
        }
        if (!identifyNumber || Object.values(listImageObj).includes(undefined)) {
            message.error('Please input Identify Number and three verify photo');
            return;
        }
        let formData = new FormData();
        formData.append('front', listImageObj.front);
        formData.append('back', listImageObj.back);
        formData.append('face', listImageObj.face);
        try {
            setLoadingSubmit(true);
            const res = await UserService.verifyIdentify(formData, identifyNumber);
            message.success('Success! Waiting admin to verify');
            setUserStatus('waiting');
            setLoadingSubmit(false);
        } catch (error) {
            message.error('Send request error: ' + error.message);
        }
    };
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Verify Your Identify</h1>
            <Row gutter={[20, 20]}>
                <Col span={24}>{notice()}</Col>
                <Col span={24}>
                    <p>Your identity number: </p>
                    <Input
                        value={identifyNumber}
                        onChange={(e) => {
                            setIdentifyNumber(e.target.value);
                        }}
                        style={{ width: '100%' }}
                    />
                </Col>
                {Object.keys(listImageObj).map((key, ind) => {
                    return (
                        <Col
                            key={key}
                            xs={24}
                            sm={24}
                            md={24}
                            lg={key == 'face' ? 24 : 12}
                            xl={key == 'face' ? 24 : 12}>
                            <Upload
                                size="large"
                                showUploadList={false}
                                listType="picture-card"
                                className="identify-uploader"
                                customRequest={dummyRequest}
                                onChange={onChange(key)}>
                                {listImageURL[key] ? (
                                    <>
                                        <Image
                                            onClick={(e) => e.stopPropagation()}
                                            src={listImageURL[key]}
                                            alt="avatar"
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </>
                                ) : (
                                    uploadButton(key)
                                )}
                            </Upload>
                        </Col>
                    );
                })}
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Button
                        loading={loadingSubmit}
                        style={{ marginRight: '10px' }}
                        size="large"
                        type="primary"
                        onClick={sendRequestVerify}>
                        Send Request
                    </Button>
                    <Button
                        loading={loadingSubmit}
                        size="large"
                        type="default"
                        onClick={clearField}>
                        Clear
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default VerifyIdentify;
