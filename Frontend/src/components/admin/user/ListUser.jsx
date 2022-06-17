import { SearchOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Image,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Space,
    Table,
    Tag
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminService from '../../../services/admin-service';
// import './style.css';
const tagColor = {
    waiting: 'yellow',
    unconfirmed: 'blue',
    confirmed: 'green',
    rejected: 'red'
};
const statusColor = {
    available: 'success',
    unavailable: 'error'
};

const ListUser = () => {
    const [listUser, setListUser] = useState([]);
    const [userIndexChoose, setUserIndexChoose] = useState(0);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isModalVertifyVisible, setModalVertifyVisible] = useState(false);

    const columns = [
        {
            title: 'AccountID',
            dataIndex: 'AccountID',
            render: (id) => <Link to={'/profile/' + id}>{id}</Link>
        },
        {
            title: 'UserName',
            dataIndex: 'UserName'
        },
        {
            title: 'Birthday',
            dataIndex: 'Birthday',
            render: (date) => moment(date).format('YYYY-MM-DD')
        },
        {
            title: 'Address',
            dataIndex: 'Address'
        },
        {
            title: 'Email',
            dataIndex: 'Email'
        },
        {
            title: 'IdentityNum',
            dataIndex: 'IdentityNum'
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            render: (status, record, index) => (
                <>
                    <Tag color={statusColor[status]}>{status}</Tag>
                </>
            )
        },
        {
            title: 'Identity Status',
            dataIndex: 'IdentityStatus',
            render: (status, record, index) => (
                <>
                    <Tag color={tagColor[status]}>{status}</Tag>
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
                <Space size="middle" direction="vertical">
                    {record.IdentityStatus === 'waiting' && (
                        <>
                            <Button type="link" onClick={() => showVerification(index)}>
                                Verify Identity
                            </Button>
                        </>
                    )}
                    {record.Status === 'available' ? (
                        <Popconfirm
                            title="Are you sure to ban this user?"
                            onConfirm={() => lockAccount(record.AccountID, index)}
                            onCancel={(e) => {}}
                            okText="Yes"
                            cancelText="No">
                            <Button type="link">Lock</Button>
                        </Popconfirm>
                    ) : (
                        <Button type="link" onClick={() => lockAccount(record.AccountID, index)}>
                            Unlock
                        </Button>
                    )}
                </Space>
            )
        }
    ];
    const showVerification = (ind) => {
        setUserIndexChoose(ind);
        setModalVertifyVisible(true);
    };
    const fetchUserData = async (current = 1, search = searchTitle) => {
        try {
            const res = await AdminService.getUsers({
                page: current,
                pageSize: 10,
                search: search
            });
            setListUser(res.data.rows);
            setTotal(res.data.count);
        } catch (error) {
            message.error(error.message);
        }
    };
    const verifyUser = async (isConfirmed) => {
        try {
            const result = await AdminService.updateVerifyIdentity(
                listUser[userIndexChoose].AccountID,
                {
                    confirmed: isConfirmed ? 1 : 0
                }
            );
            message.success(result.data.message);
            listUser[userIndexChoose].IdentityStatus = isConfirmed ? 'confirmed' : 'rejected';
            setListUser([...listUser]);
            setModalVertifyVisible(false);
        } catch (error) {
            try {
                message.error(error.response.data.message);
                return;
            } catch (error) {
                message.error(error.message);
            }
        }
    };
    const lockAccount = async (id, index) => {
        // message.success('lock account ' + id);
        try {
            const res = await AdminService.changeUserStatus(id);
            if (res.data) {
                message.success(res.data.message);
                listUser[index].Status = res.data.status;
                setListUser([...listUser]);
            }
        } catch (error) {}
    };
    const onChangeTable = (pagination) => {
        setPage(pagination.current ? pagination.current : 1);
    };
    const handleSearch = (event) => {
        fetchUserData(1, event.target.value);
        setSearchTitle(event.target.value);
    };
    useEffect(() => {
        fetchUserData(page);
    }, [page]);

    return (
        <div className="container">
            <Space direction="vertical" size={24}>
                <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    prefix={<SearchOutlined />}
                    onPressEnter={handleSearch}
                    label={''}
                    placeholder="Search by UserName, Id, Email"
                    // onSearch={onSearch}
                    size="large"
                    style={{ width: '100%', marginBottom: '0px' }}
                />
                <Table
                    rowKey="AccountID"
                    size="small"
                    loading={loading}
                    columns={columns}
                    dataSource={listUser}
                    total={total}
                    // scroll={{ x: '80%' }}
                    onChange={onChangeTable}
                    pagination={{
                        current: page,
                        total: total,
                        // showSizeChanger: false,
                        position: ['bottomCenter']
                    }}
                />
            </Space>
            <Modal
                title="Verify Identify"
                visible={isModalVertifyVisible}
                // onOk={}
                onCancel={() => setModalVertifyVisible(false)}
                width={900}
                footer={null}>
                {listUser[userIndexChoose] && (
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <h3>Identity number: {listUser[userIndexChoose].IdentityNum}</h3>
                        </Col>
                        <Col span={12}>
                            <Image
                                src={listUser[userIndexChoose].FrontsideURL}
                                alt="front"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Col>
                        <Col span={12}>
                            <Image
                                src={listUser[userIndexChoose].BacksideURL}
                                alt="back"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Col>
                        <Col span={24}>
                            <Image
                                src={listUser[userIndexChoose].FaceURL}
                                alt="face"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Button
                                style={{ marginRight: '10px' }}
                                size="large"
                                type="primary"
                                onClick={() => verifyUser(true)}>
                                Accept
                            </Button>
                            <Button
                                size="large"
                                danger
                                type="primary"
                                onClick={() => verifyUser(false)}>
                                Reject
                            </Button>
                        </Col>
                    </Row>
                )}
            </Modal>
        </div>
    );
};

export default ListUser;
