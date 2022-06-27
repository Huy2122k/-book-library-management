import { InfoCircleTwoTone } from '@ant-design/icons';
import { Badge, Button, Checkbox, Col, Collapse, message, Modal, Row, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../auth/use-auth';
import AdminService from '../../../services/admin-service';
import LendingService from '../../../services/lending-service';
import './style.css';
const { confirm } = Modal;

const { Panel } = Collapse;
const dictStatus = {
    return: 'green',
    borrow: 'blue',
    late: 'red',
    pending: 'yellow',
    reject: 'red'
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
function LendingManage() {
    const navigate = useNavigate();
    const params = useParams();
    const { user } = useAuth();
    const [lendDetail, setLendDetail] = useState();
    const [checkedList, setCheckedList] = useState([]);
    const [checkAll, setCheckAll] = useState(false);
    const fetchLendingData = async () => {
        try {
            const res = await LendingService.getLendingById(params.id);
            setLendDetail(res.data);
        } catch (error) {
            message.error('cannot get lending info!');
        }
    };
    const plainOptions = lendDetail
        ? lendDetail.lendingbooklists.map((lend, ind) => {
              return {
                  label: renderBookInfo(lend.bookitem.book, lend.bookitem.BookItemID),
                  value: lend.bookitem.BookItemID,
                  style: { width: '100%' }
              };
          })
        : {};

    const onChange = (list) => {
        setCheckedList(list);
        setCheckAll(list.length === plainOptions.length);
    };
    const sendConfirmLending = async (rejectBookItemIDs, acceptBookItemIDs) => {
        try {
            const res = await AdminService.confirmLending(params.id, {
                rejectBookItemIDs,
                acceptBookItemIDs
            });
            message.success(res.data.message);
            navigate('/profile/' + lendDetail.AccountID + '?tab=lending');
        } catch (error) {
            message.error('Confirm Error');
        }
    };
    const sendConfirmReturn = async (keepBookItemIDs, returnBookItemIDs) => {
        try {
            const res = await AdminService.returnLending(params.id, {
                keepBookItemIDs,
                returnBookItemIDs
            });
            message.success(res.data.message);
            navigate('/profile/' + lendDetail.AccountID + '?tab=lending');
        } catch (error) {
            message.error('Confirm Error');
        }
    };
    const showPromiseConfirm = () => {
        confirm({
            title: `Do you want to return ${checkedList.length} book items?`,
            icon: <InfoCircleTwoTone />,
            content: checkedList.map((id) => <div key={id}>{id}</div>),
            onOk() {
                return handleAcceptReturn();
            },
            onCancel() {}
        });
    };
    const handleAcceptReturn = async () => {
        const listKeeps = lendDetail.lendingbooklists.filter((lend, ind) => {
            return !checkedList.includes(lend.bookitem.BookItemID);
        });
        await sendConfirmReturn(
            listKeeps.map((lend, ind) => {
                return lend.bookitem.BookItemID;
            }),
            checkedList
        );
    };
    const handleAcceptLending = async () => {
        const listReject = lendDetail.lendingbooklists.filter((lend, ind) => {
            return !checkedList.includes(lend.bookitem.BookItemID);
        });
        await sendConfirmLending(
            listReject.map((lend, ind) => {
                return lend.bookitem.BookItemID;
            }),
            checkedList
        );
    };
    const handleRejectLending = async () => {
        const listAll = lendDetail.lendingbooklists.map((lend, ind) => {
            return lend.bookitem.BookItemID;
        });
        await sendConfirmLending(listAll, []);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions.map((val) => val.value) : []);
        setCheckAll(e.target.checked);
    };
    useEffect(() => {
        fetchLendingData();
    }, [params.id]);
    return (
        <div className="container">
            <h1 className="title-lending-manage">Lending Management</h1>
            <div>
                {lendDetail ? (
                    <Badge.Ribbon text={lendDetail.Status} color={dictStatus[lendDetail.Status]}>
                        <Collapse
                            key={lendDetail.LendingID}
                            defaultActiveKey={'1'}
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
                                                    {moment(lendDetail.CreateDate).format(
                                                        'DD-MM-YYYY'
                                                    ) +
                                                        ' to ' +
                                                        moment(lendDetail.DueDate).format(
                                                            'DD-MM-YYYY'
                                                        )}
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
                                <div
                                    style={{
                                        marginTop: '20px',
                                        padding: '0px 15px',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                    {lendDetail.Status === 'pending' ? (
                                        <>
                                            <Button
                                                onClick={handleAcceptLending}
                                                type="primary"
                                                style={{ width: '45%', backgroundColor: 'green' }}>
                                                Accept {`(${checkedList.length})`}
                                            </Button>
                                            <Button
                                                type="primary"
                                                danger
                                                style={{ width: '45%' }}
                                                onClick={handleRejectLending}>
                                                Reject
                                            </Button>
                                        </>
                                    ) : lendDetail.Status === 'borrow' ? (
                                        <div style={{ width: '100%', textAlign: 'center' }}>
                                            <Button onClick={showPromiseConfirm} type="primary">
                                                Confirm Return Book {`(${checkedList.length})`}
                                            </Button>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </Panel>
                        </Collapse>
                    </Badge.Ribbon>
                ) : (
                    <Spin tip="Loading..." spinning={true} />
                )}
            </div>
        </div>
    );
}

export default LendingManage;
