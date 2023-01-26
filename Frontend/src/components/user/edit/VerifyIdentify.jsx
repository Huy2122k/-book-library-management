import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Image, Input, message, Row, Upload, DatePicker, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import UserService from '../../../services/user.service';
import axios_id_card from '../../../services/extract-idcard';
import moment from 'moment';

import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

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
    const [fullName, setFullName] = useState(userInfo.FullName);
    const [birthDay, setBirthDay] = useState(userInfo.Birthday ? moment(userInfo.Birthday).format("YYYY-MM-DD") : null);
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const refDate = useRef(null);
    useEffect(()=>{
        document.addEventListener("click", hideDatePicker, true);
    })

    const hideDatePicker = (e) => {
        if(refDate.current && !refDate.current.contains(e.target)){
            setOpenDatePicker(false);
        }
    }

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
        setFullName(null);
        setBirthDay(null);
    };

    const extractInfor = async () =>{
        if(listImageURL.front){
            var base64string = "";
            var img;
            if(listImageURL.front.includes("http")){
                var url = listImageURL.front;
                await fetch(url)
                .then(response => response.blob())
                .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                    img = reader;
                }))

                base64string = img.result;
            }
            else{
                base64string = listImageURL.front;
            }
            if(base64string){
                base64string = base64string.split("base64,")[1];
                var body = {
                    img: base64string
                }
                
                body = JSON.stringify(body);
                var newType = document.querySelector('input[name="typeIDCard"]:checked').value == "new";
                var url = "/old/extract";
                if(newType){
                    url = "/new/extract";
                }
                setLoadingSubmit(true);
                await axios_id_card.post(url, body)
                .then(res => {
                    bindingData(res.data);
                    setLoadingSubmit(false);
                })
                .catch(res => {
                    message.error('error!');
                    setLoadingSubmit(false);
                })
                
            }
        }
        else{
            message.warning('You must upload front image first!');
        }
    }

    const bindingData = (data) => {
        var id = data.id.includes(":") ? data.id.trim().split(':')[1].trim() : data.id,
            name = data.name.includes(":") ? data.name.trim().split(':')[1].trim() : data.name,
            birth = formatDate(data.birth);

        setIdentifyNumber(id)
        setFullName(name);
        setBirthDay(birth);
        
    }

    const formatDate = (dateString) => {
        var dd = dateString.substr(0,2),
            mm = dateString.substr(3,2),
            yyyy = dateString.substr(-4);
        
        var date = yyyy + "-" + mm + "-" + dd;
        return date;
    }

    const sendRequestVerify = async () => {
        if (userInfo.IdentityStatus === 'confirmed') {
            message.error('You are already confirmed');
            return;
        }
        if (userInfo.IdentityStatus === 'waiting') {
            message.error('Waiting admin confirmation');
            return;
        }
        if (!identifyNumber || !fullName || !birthDay || Object.values(listImageObj).includes(undefined)) {
            message.error('Please input Identify Number, Fullname, Birthday and three verify photo');
            return;
        }
        let formData = new FormData();
        formData.append('front', listImageObj.front);
        formData.append('back', listImageObj.back);
        formData.append('face', listImageObj.face);
        try {
            setLoadingSubmit(true);
            const res = await UserService.verifyIdentify(formData, identifyNumber, fullName, birthDay);
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
                        style={{ width: '50%' }}
                    />
                </Col>
                <Col span={24}>
                    <p>Your fullname: </p>
                    <Input
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                        }}
                        style={{ width: '50%' }}
                    />
                </Col>
                <Col span={24}>
                    <Form>
                        <Form.Item
                            label="Your birth day"
                            name="Birthday"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please select birthday!'
                                }
                            ]}>
                            <input 
                                value={birthDay? birthDay : ""}
                                readOnly
                                style={{outline: 'none', borderRadius: '6px', border: '1px solid #babec5', height: '32px'}}
                                onClick={() => setOpenDatePicker(openDatePicker => !openDatePicker)}
                            />
                            <div ref={refDate} style={{width: 0}}>
                                {openDatePicker && 
                                    <Calendar 
                                        date={new Date(birthDay)}
                                        style={{position: 'absolute', zIndex: "9999", backgroundColor: "#fff", border: "1px solid #babec5"}}
                                        onChange={(dateString) => {
                                            if(dateString){
                                                setBirthDay(moment(new Date(dateString)).format("YYYY-MM-DD"));
                                            }
                                            else{
                                                setBirthDay(null);
                                            }
                                        }}
                                    />
                                }
                            </div>
                            
                            
                            {/* <DatePicker
                                value={birthDay !== "" ? moment(birthDay) : null}
                                onChange={(dateString) => {
                                    if(dateString){
                                        setBirthDay(moment(new Date(dateString)).format("YYYY-MM-DD"));
                                    }
                                    else{
                                        setBirthDay("");
                                    }
                                }}
                            /> */}
                        </Form.Item>
                    </Form>
                    
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
                <div style={{display: 'flex', alignItem: 'center', flexDirection: 'column'}}>
                    <strong>Choose type of Identify card</strong>
                    
                    <div style={{display: 'flex', alignItem: 'center'}}>
                        <input type="radio" name='typeIDCard' value='new' checked style={{marginRight: "5px"}}/>
                        <label>New Identify card</label>
                    </div>
                    <div style={{display: 'flex', alignItem: 'center'}}>
                        <input type="radio" name='typeIDCard' value='old' style={{marginRight: "5px"}}/>
                        <label>Old Identify card</label>
                    </div>
                    
                </div>
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
                        style={{ marginRight: '10px' }}
                        size="large"
                        type="primary"
                        onClick={extractInfor}>
                        Information extraction
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
