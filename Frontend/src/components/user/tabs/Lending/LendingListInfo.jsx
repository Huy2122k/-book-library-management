import { Card, Col, Collapse, Row, Space } from 'antd';
import { useEffect, useState } from 'react';
import LendingItem from './LendingItem';
import './style.css';
const { Panel } = Collapse;
const InfoCount = ({ title, value, bordered }) => (
    <div className="headerInfo">
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
    </div>
);

const LendingListInfo = ({ lendingInfo }) => {
    const [statistics, setStatistics] = useState({
        countWaiting: 0,
        countLending: 0,
        countLate: 0,
        countReturn: 0,
        countBook: 0
    });

    const calcStatistics = () => {
        if (!lendingInfo) return;
        let countWaiting = 0;
        let countLending = 0;
        let countLate = 0;
        let countReturn = 0;
        let countBook = 0;
        lendingInfo.forEach((lend, indx) => {
            countBook += lend.lendingbooklists.length;
            switch (lend.Status) {
                case 'pending':
                    countWaiting += 1;
                    break;
                case 'late':
                    countLate += 1;
                    break;
                case 'borrow':
                    countLending += 1;
                    break;
                case 'return':
                    countReturn += 1;
                    break;
                default:
                    break;
            }
        });
        setStatistics({ countWaiting, countLending, countLate, countReturn, countBook });
    };

    useEffect(() => {
        calcStatistics();
    }, [lendingInfo]);

    return (
        <>
            <Card bordered={false}>
                <div className="lendingHeader">
                    <Row gutter={[16, 16]}>
                        <Col sm={6} md={6} xs={12}>
                            <InfoCount title="Waiting" value={statistics.countWaiting} bordered />
                        </Col>
                        <Col sm={6} md={6} xs={12}>
                            <InfoCount title="Lending" value={statistics.countLending} bordered />
                        </Col>
                        <Col sm={6} md={6} xs={12}>
                            <InfoCount title="Late" value={statistics.countLate} bordered />
                        </Col>
                        <Col sm={6} md={6} xs={12}>
                            <InfoCount title="Returned" value={statistics.countReturn} />
                        </Col>
                    </Row>
                </div>
            </Card>
            <p style={{ textAlign: 'center' }}>Total book: {statistics.countBook}</p>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {lendingInfo &&
                    lendingInfo.map((lend, ind) => (
                        <LendingItem key={lend.LendingID} lendDetail={lend} ind={ind} />
                    ))}
            </Space>
        </>
    );
};

export default LendingListInfo;
