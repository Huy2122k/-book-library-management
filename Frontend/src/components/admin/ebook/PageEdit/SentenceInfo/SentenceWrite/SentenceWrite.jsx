import React, { useState } from 'react';
import './style.css';

const SentenceWrite = (props) => {
    const [text, setText] = useState('');
    const [color, setColor] = useState('yellow');

    return (
        <div className="sentence-write" style={props.viewMode}>
            <div className="sentence-write-text-input">
                <label>Văn bản:</label>
                <textarea
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                />
            </div>
            {/* <div className="sentence-write-color-input">
                <label>Màu Bounding box:</label>
                <input
                    type="color"
                    name="color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                    }}
                />
            </div> */}
            <div className="sentence-write-submit">
                <button
                    onClick={() => {
                        // props.handleWriteSentence(text, color);
                        setText('');
                        setColor('#000000');
                    }}>
                    Thêm câu
                </button>
            </div>
            <small>* Câu được thêm sẽ nằm ở vị trí cuối cùng của danh sách câu</small>
        </div>
    );
};

export default SentenceWrite;
