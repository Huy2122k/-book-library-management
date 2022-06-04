import { Badge, Button, Checkbox, Col, Collapse, Modal, Row } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../auth/use-auth';
import './style.css';
const { Panel } = Collapse;

const dictStatus = {
    return: 'green',
    borrow: 'blue',
    late: 'red',
    pending: 'yellow'
};

const CheckboxGroup = Checkbox.Group;

const renderBookInfo = (book, bookItemId) => {
    return (
        <div className="book-item-borrow">
            <p>ID: {bookItemId}</p>
            <Row gutter={[12, 12]} className="book-info-borrow">
                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="book-info-borrow-left">
                    <img src={book.ImageURL} alt="" />
                </Col>
                <Col xs={24} sm={24} md={12} lg={16} xl={16} className="right-info">
                    <h3>{book.BookName}</h3>
                    <p>{book.Author}</p>
                    {book.Series && (
                        <p>{'Series: ' + book.Author + ', Chapter: ' + book.Chapter}</p>
                    )}
                    <i>{moment(book.PublishedDate).format('DD-MM-YYYY')}</i>
                </Col>
            </Row>
        </div>
    );
};

const LendingItem = ({ lendDetail, ind }) => {
    const params = useParams();
    const { user } = useAuth();
    const [checkedList, setCheckedList] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [lendingQR, setLendingQR] = useState('/lending/');

    const plainOptions = lendDetail.lendingbooklists.map((lend, ind) => {
        return {
            label: renderBookInfo(lend.bookitem.book, lend.bookitem.BookItemID),
            value: lend.bookitem.BookItemID,
            style: { width: '100%' }
        };
    });

    const showModal = (lendingId) => () => {
        setLendingQR('/lending/' + lendingId);
        setModalVisible(true);
    };
    const onChange = (list) => {
        setCheckedList(list);
        setCheckAll(list.length === plainOptions.length);
    };

    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions.map((val) => val.value) : []);
        setCheckAll(e.target.checked);
    };

    return (
        <>
            <Badge.Ribbon text={lendDetail.Status} color={dictStatus[lendDetail.Status]}>
                <Collapse
                    key={lendDetail.LendingID}
                    defaultActiveKey={ind < 3 ? ['1'] : ['0']}
                    expandIconPosition="right">
                    <Panel
                        header={
                            <>
                                <Checkbox
                                    onChange={onCheckAllChange}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    checked={checkAll}></Checkbox>
                                <div className="headerLendingCollapse">
                                    <span>{lendDetail.LendingID} </span>
                                    <span className="date-time">
                                        <i>
                                            {moment(lendDetail.CreateDate).format('DD-MM-YYYY') +
                                                ' to ' +
                                                moment(lendDetail.DueDate).format('DD-MM-YYYY')}
                                        </i>
                                    </span>
                                </div>
                            </>
                        }
                        key="1">
                        <CheckboxGroup
                            className="group-custom"
                            style={{ width: '100%' }}
                            options={plainOptions}
                            value={checkedList}
                            onChange={onChange}
                        />
                        {params.id && user && user.info.AccountID == params.id && (
                            <div
                                style={{
                                    marginTop: '20px',
                                    padding: '0px 15px',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                <Button
                                    type="primary"
                                    style={{ width: '45%' }}
                                    onClick={showModal(lendDetail.LendingID)}>
                                    Show QR
                                </Button>

                                <Button
                                    type="primary"
                                    disabled={lendDetail.Status != 'borrow'}
                                    style={{ width: '45%' }}>
                                    Return{`(${checkedList.length})`}
                                </Button>
                            </div>
                        )}
                    </Panel>
                </Collapse>
            </Badge.Ribbon>
            <Modal
                title=""
                visible={isModalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}>
                <div style={{ textAlign: 'center' }}>
                    <QRCode value={lendingQR} />
                </div>
            </Modal>
        </>
    );
};

export default LendingItem;
