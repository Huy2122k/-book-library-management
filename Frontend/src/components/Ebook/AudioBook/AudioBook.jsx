import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    BsArrowReturnLeft,
    BsFillCaretLeftFill,
    BsFillCaretRightFill,
    BsFullscreen,
    BsFullscreenExit,
    BsHeadphones,
    BsZoomIn,
    BsZoomOut
} from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import axios_instance from '../../../services/ebook/axios-ebook';

// Import the main component
import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

import { highlightPlugin } from '@react-pdf-viewer/highlight';

import './style.css';

const AudioBook = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const chapterId = location.pathname.split('/').at(-1);
    const [metaData, setMetadata] = useState({});
    const [url, setUrl] = useState({
        pdf: null,
        audio: null
    });
    const [isLoad, setIsLoad] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const metaRes = await axios_instance.get(`/api/chapter_meta/${chapterId}`);
                console.log(metaRes.data);
                setMetadata(metaRes.data);

                setUrl({ pdf: metaRes.data['urls']['pdf'], audio: metaRes.data['urls']['audio'] });
                setIsLoad(true);
            } catch (err) {
                setIsLoad(true);
                console.log(err);
            }
        };
        fetchData();
    }, [chapterId]);

    // Toolbar
    const toolbarPluginInstance = toolbarPlugin();
    const { Toolbar } = toolbarPluginInstance;

    // Render Highlight
    const renderHighlights = (props) => (
        <div className="hello">
            {metaData['sentences'].map((sentence) => (
                <div key={sentence['sentenceId']}>
                    {sentence.highlightAreas
                        // Filter all highlights on the current page
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                className="highlight-box"
                                key={idx}
                                id={`s${sentence['sentenceId']}${idx}`}
                                style={Object.assign(
                                    props.getCssProperties(area, props.rotation)
                                )}></div>
                        ))}
                </div>
            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({
        renderHighlights
    });

    // Audio
    const { jumpToHighlightArea } = highlightPluginInstance;

    const [audioView, setAudioView] = useState(false);
    const [currentSentenceId, setCurrentSentenceId] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);

    // Hiển thị highlight khi chạy auido
    const timeUpdate = (e) => {
        const highlightMetadata = metaData['sentences'].find((sentence) => {
            return sentence.endTime >= e.target.currentTime;
        });
        if (currentSentenceId !== highlightMetadata['sentenceId']) {
            document
                .querySelectorAll('.highlight-box.highlight')
                .forEach((el) => el.classList.remove('highlight'));
            for (let i = 0; i < highlightMetadata['highlightAreas'].length; i++) {
                const highlightElement = document.querySelector(
                    `#s${highlightMetadata['sentenceId']}${i}`
                );
                highlightElement.classList.add('highlight');
            }
            setCurrentSentenceId(highlightMetadata['sentenceId']);
            jumpToHighlightArea(highlightMetadata.highlightAreas[0]);
        }
    };

    // Set lại thời gian chạy khi thay đổi vị trí trang (là highlight đầu tiên của page đang hiển thị)
    const handlePageChange = (e) => {
        const highlightMetadata = metaData['sentences'].find((sentence) => {
            return sentence.pageIndex === e.currentPage;
        });
        setCurrentTime(highlightMetadata.endTime - highlightMetadata.duration);
    };

    const handleAudioView = () => {
        let audioTag = document.querySelectorAll('#audiobook-audio')[0];
        if (audioView) {
            // Xoá toàn bộ highlight
            document
                .querySelectorAll('.highlight-box.highlight')
                .forEach((el) => el.classList.remove('highlight'));
            // Ngắt audio khi không bật audio view
            audioTag.pause();
        } else {
            // Bật audio khi bật audio view
            audioTag.play();
            // Set thời gian bắt đầu của audio theo vị trí trang
            audioTag.currentTime = currentTime;
        }
        setAudioView(!audioView);
    };

    const handlePreviousChapter = async () => {
        const checkRes = await axios_instance(`/api/chapters/${chapterId}?state=previous`);
        if (checkRes.data['pdfStatus'] === 'ready' && checkRes.data['audioStatus'] === 'ready') {
            // Nếu pdf và audio chưa sẵn sàng => đưa ra cảnh báo
            navigate(`/chapter/${checkRes.data['chapter']['_id']['$oid']}`);
        } else {
            // Nếu không => chuyển trang
            window.alert('Chương đang trong quá trình chỉnh sửa, xin vui lòng thử lại sau');
        }
    };

    // Tương tự như trên
    const handleNextChapter = async () => {
        const checkRes = await axios_instance(`/api/chapters/${chapterId}?state=next`);
        if (checkRes.data['pdfStatus'] === 'ready' && checkRes.data['audioStatus'] === 'ready') {
            navigate(`/chapter/${checkRes.data['chapter']['_id']['$oid']}`);
        } else {
            window.alert('Chương đang trong quá trình chỉnh sửa, xin vui lòng thử lại sau');
        }
    };

    // Full Screen
    const [fullScreen, setFullScreen] = useState(false);
    return (
        <Spin spinning={!isLoad}>
            {isLoad && (
                <div className={`audio-book ${fullScreen ? 'fullscreen-mode' : 'normal-mode'}`}>
                    <div className="pdf-toolbar">
                        <Toolbar>
                            {(props) => {
                                const {
                                    CurrentPageInput,
                                    NumberOfPages,
                                    CurrentScale,
                                    ZoomIn,
                                    ZoomOut
                                } = props;
                                return (
                                    <>
                                        <div className="zoom-section">
                                            <div>
                                                <ZoomOut>
                                                    {(props) => (
                                                        <button
                                                            onClick={props.onClick}
                                                            title="Phóng to">
                                                            <BsZoomOut />
                                                        </button>
                                                    )}
                                                </ZoomOut>
                                            </div>
                                            <div>
                                                <CurrentScale />
                                            </div>
                                            <div>
                                                <ZoomIn>
                                                    {(props) => (
                                                        <button
                                                            onClick={props.onClick}
                                                            title="Thu nhỏ">
                                                            <BsZoomIn />
                                                        </button>
                                                    )}
                                                </ZoomIn>
                                            </div>
                                        </div>
                                        <div className="gotopage-section">
                                            <span style={{ width: '4rem' }}>
                                                <CurrentPageInput />
                                            </span>
                                            <span>of</span>
                                            <NumberOfPages />
                                        </div>
                                        <div className="ultilize-section">
                                            <button
                                                className="chapter-change-button"
                                                onClick={handlePreviousChapter}
                                                disabled={
                                                    metaData['chapter']['index'] === 1
                                                        ? true
                                                        : false
                                                }>
                                                <BsFillCaretLeftFill />
                                                <span>Chương trước</span>
                                            </button>
                                            <button
                                                className="chapter-change-button"
                                                onClick={handleNextChapter}
                                                disabled={
                                                    metaData['chapter']['index'] ===
                                                    metaData['numChapter']
                                                        ? true
                                                        : false
                                                }>
                                                <span>Chương sau</span>
                                                <BsFillCaretRightFill />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/book/info/${metaData['chapter']['book']['$oid']}`
                                                    )
                                                }
                                                title="Quay về thông tin sách">
                                                <BsArrowReturnLeft />
                                            </button>
                                            <button
                                                onClick={handleAudioView}
                                                style={{
                                                    backgroundColor: audioView ? 'black' : 'white',
                                                    color: audioView ? 'white' : 'black'
                                                }}
                                                title={audioView ? 'Tắt audio' : 'Bật audio'}>
                                                <BsHeadphones />
                                            </button>
                                            <button
                                                onClick={() => setFullScreen(!fullScreen)}
                                                title={
                                                    fullScreen
                                                        ? 'Tắt toàn màn hình'
                                                        : 'Bật toàn màn hình'
                                                }>
                                                {fullScreen ? (
                                                    <BsFullscreenExit />
                                                ) : (
                                                    <BsFullscreen />
                                                )}
                                            </button>
                                        </div>
                                    </>
                                );
                            }}
                        </Toolbar>
                    </div>
                    <div style={{ display: audioView ? 'flex' : 'none' }}>
                        <audio
                            id="audiobook-audio"
                            controls
                            src={url.audio}
                            onTimeUpdate={timeUpdate}
                        />
                    </div>
                    <div
                        className="pdf-viewer"
                        style={
                            fullScreen
                                ? audioView
                                    ? { height: '80vh' }
                                    : { height: '100vh' }
                                : audioView
                                ? { height: '70vh' }
                                : { height: '80vh' }
                        }>
                        <Viewer
                            fileUrl={url.pdf}
                            onPageChange={handlePageChange}
                            plugins={[toolbarPluginInstance, highlightPluginInstance]}
                        />
                    </div>
                </div>
            )}
        </Spin>
    );
};

export default AudioBook;
