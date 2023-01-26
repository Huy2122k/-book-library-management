import { message } from 'antd';
import RandomColor from 'randomcolor';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageDetail, updatePage } from '../../../../services/ebook/ebook-create';
import PageCanvas from './PageCanvas/PageCanvas';
import SentenceInfo from './SentenceInfo/SentenceInfo';
import './style.css';
const PageEdit = () => {
    // url của ảnh
    const params = useParams();
    const pageId = params.id;
    let [imageUrl, setImageUrl] = useState('');

    // Dữ liệu list câu, có cấu trúc các thành phần
    // {
    //     color: ,
    //     text: ,
    //     sentenceId: ,
    //     state: , (Cho việc lựa chọn câu trên giao diện, lúc khởi tạo để false)
    // }

    let [originalSentenceInfo, setoriginalSentenceInfo] = useState([]); // Dữ liệu list câu original, phục vụ cho reset
    let [sentenceInfo, setSentenceInfo] = useState([]);

    // Dữ liệu list bounding box của câu, có cấu trúc thành phần
    // {
    //     x: ,
    //     y: ,
    //     width: ,
    //     height: ,
    //     id: ,
    //     sentenceId: ,
    //  }
    let [originalSentenceBounding_box, setoriginalSentenceBounding_box] = useState([]); // Dữ liệu list bounding box original, phục vụ cho reset
    let [sentenceBounding_box, setSentenceBounding_box] = useState([]);

    // List bounding box sẽ hiển thị trên canvas, có cấu trúc các thành phần
    // {
    //     x: ,
    //     y: ,
    //     width: ,
    //     height: ,
    //     id: ,
    //     sentenceId: ,
    //     stroke: ,
    // }

    // Biến lưu câu đang chỉnh sửa
    const [editSentenceId, setEditSentenceId] = useState(null);
    const fetchData = async () => {
        const pageRes = await getPageDetail(pageId);
        const tempSentenceInfo = [];
        const tempSentenceBB = [];
        for (let i = 0; i < pageRes.data['sentences'].length; i++) {
            let tempInfo = {};
            let color = RandomColor();
            tempInfo.color = color;
            tempInfo.text = pageRes.data['sentences'][i]['text'];
            tempInfo.sentenceId = pageRes.data['sentences'][i]['index'];
            tempInfo.state = false;
            tempSentenceInfo.push(tempInfo);
            for (let j = 0; j < pageRes.data['sentences'][i]['bounding_box'].length; j++) {
                let tempBB = {};
                tempBB.x = pageRes.data['sentences'][i]['bounding_box'][j]['x'];
                tempBB.y = pageRes.data['sentences'][i]['bounding_box'][j]['y'];
                tempBB.width = pageRes.data['sentences'][i]['bounding_box'][j]['width'];
                tempBB.height = pageRes.data['sentences'][i]['bounding_box'][j]['height'];
                tempBB.id = pageRes.data['sentences'][i]['index'];
                tempBB.fill = 'yellow';
                tempBB.opacity = 0.3;
                tempBB.sentenceId = pageRes.data['sentences'][i]['index'];
                tempSentenceBB.push(tempBB);
            }
        }
        setoriginalSentenceInfo(tempSentenceInfo);
        setSentenceInfo(tempSentenceInfo);
        setoriginalSentenceBounding_box(tempSentenceBB);
        setSentenceBounding_box(tempSentenceBB);
        setImageUrl(pageRes.data['presigned_img']);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Quản lý state của câu (Nếu state == true: hiển thị bounding box của câu đó)
    const handleSelectSentence = (id) => {
        setEditSentenceId(id);
        // setSentenceBounding_box(newList);
    };

    // Quản lý text của câu
    const handleText = (id, text) => {
        const updatedSentenceInfo = sentenceInfo.map((sentence) => {
            if (sentence.sentenceId === id) {
                return {
                    ...sentence,
                    text: text
                };
            }
            return sentence;
        });
        setSentenceInfo(updatedSentenceInfo);
    };

    // Quản lý thay đổi vị trí của câu
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = (fromIndex, toIndex) => {
        /* IGNORES DRAG IF OUTSIDE DESIGNATED AREA */
        if (toIndex < 0) return;

        const list = reorder(sentenceInfo, fromIndex, toIndex);
        return setSentenceInfo(list);
    };

    // Lưu bounding box mới tạo
    // const saveBounding_box = () => {
    //     let tempSentenceBB = [];

    //     setSentenceBounding_box(tempSentenceBB);
    //     message.success('new bounding box successfully added');
    // };
    const handleSave = async () => {
        // console.log(sentenceBounding_box);
        // console.log(sentenceInfo);
        const listSentence = sentenceInfo.map((sentence) => {
            const bboxs = sentenceBounding_box
                .filter((box) => {
                    return box.sentenceId === sentence.sentenceId;
                })
                .map((box) => {
                    return { x: box.x, y: box.y, width: box.width, height: box.height };
                });
            return {
                // page: pageId,
                index: sentence.sentenceId,
                text: sentence.text,
                bounding_box: bboxs
            };
        });
        console.log(listSentence);
        try {
            await updatePage(pageId, {
                sentences: listSentence,
                bounding_box_status: 'ready',
                need_audio_process: true
            });
            message.success('update successfully!');
        } catch (error) {
            message.error('some error occured while updating!');
        }
    };
    return (
        <div className="page-edit">
            <div className="page-edit-header">
                <h1>Thông tin trang sách</h1>
                <hr></hr>
            </div>
            <div className="page-edit-section">
                <PageCanvas
                    key={editSentenceId}
                    sentenceBounding_box={sentenceBounding_box}
                    setSentenceBounding_box={setSentenceBounding_box}
                    imageUrl={imageUrl}
                    // saveBounding_box={saveBounding_box}
                    setEditSentenceId={setEditSentenceId}
                    editSentenceId={editSentenceId}
                    edit={true}
                />
                <SentenceInfo
                    sentenceInfo={sentenceInfo}
                    handleText={handleText}
                    onDragEnd={onDragEnd}
                    setEditSentenceId={setEditSentenceId}
                    editSentenceId={editSentenceId}
                />
            </div>
            <div className="page-edit-submit">
                <button onClick={handleSave}>Lưu thay đổi</button>
            </div>
        </div>
    );
};

export default PageEdit;
