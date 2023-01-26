import React, { useState } from 'react';
import { FaEdit, FaList, FaSave, FaWindowClose } from 'react-icons/fa';
import './style.css';

const SentenceInfoItem = (props) => {
    const [text, setText] = useState(props.sentence.text);
    const sentence = props.sentence;
    const editText = props.sentence.sentenceId === props.editSentenceId;
    let viewMode = {};
    let editMode = { backgroundColor: 'antiquewhite' };

    if (editText) {
        viewMode.display = 'none';
    } else {
        editMode.display = 'none';
    }
    return (
        <div className="sentence-info-box" style={editText ? editMode : viewMode}>
            {/* <div className="sentence-info-box-color">
                <input
                    type="checkbox"
                    id={sentence.sentenceId}
                    checked={sentence.state}
                    onChange={handleCheckboxChange}
                />
                <input
                    type="color"
                    id={sentence.sentenceId}
                    name="color"
                    value={sentence.color}
                    onChange={(e) => {
                        props.handleColor(sentence.sentenceId, e.target.value);
                    }}
                />
            </div> */}
            <div className="sentence-info-box-text">
                <div style={viewMode}>{text}</div>
                <textarea
                    style={editMode}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                    }}
                />
            </div>
            <div className="sentence-info-box-button">
                <div style={viewMode}>
                    <button className="drag">
                        <FaList />
                    </button>
                    <button
                        className="edit"
                        onClick={() => {
                            props.setEditSentenceId(sentence.sentenceId);
                        }}>
                        <FaEdit />
                    </button>
                </div>
                <div style={editMode}>
                    <button
                        className="save"
                        onClick={() => {
                            props.handleText(sentence.sentenceId, text);
                            props.setEditSentenceId(null);
                        }}>
                        <FaSave />
                    </button>
                    <button
                        className="discard"
                        onClick={() => {
                            props.setEditSentenceId(null);
                        }}>
                        <FaWindowClose />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SentenceInfoItem;
