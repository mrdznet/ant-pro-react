//收款单审核
import { Tag, message, Card, Button, Col, Drawer, Form, Input, Row, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetEntityShow, ChargeFeeDetail, CheckBill } from './Main.service';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import styles from './style.less';
import moment from 'moment';

interface VertifyProps {
  vertifyVisible: boolean;
  closeVertify(): void;
  form: WrappedFormUtils;
  id?: string;
  ifVertify: boolean;
  reload(): void;
}

const Vertify = (props: VertifyProps) => {
  const { vertifyVisible, closeVertify, id, form, ifVertify, reload } = props;
  const { getFieldDecorator } = form;
  const title = ifVertify ? "收款单取消审核" : "收款单审核";
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [chargeBillData, setChargeBillData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [linkno, setLinkno] = useState<any>('');
  // 打开抽屉时初始化
  useEffect(() => {
    form.resetFields();
    if (vertifyVisible) {
      if (id != null && id != '') {
        //setLoading(true);
        GetEntityShow(id).then(res => {
          setInfoDetail(res.entity);
          setLinkno(res.linkno);
          initLoadFeeDetail(res.entity.billId);
          //setLoading(false);
        })
      }
      else {
        setInfoDetail({});
        setLoading(false);
      }
    }
  }, [vertifyVisible]);

  // const close = () => {
  //   closeVertify();
  // };

  const audit = () => {
    form.validateFields((errors, values) => {
      // console.log(values, infoDetail); 
      var newData = Object.assign({}, infoDetail,
        {
          // verifyPerson: localStorage.getItem('userid'),
          // verifyDate: moment(new Date).format('YYYY-MM-DD'),
          verifyMemo: values.verifyMemo,
          keyValue: infoDetail.billId,
          billDate: moment(values.billDate).format('YYYY-MM-DD'),
          //status: ifVertify ? 1 : 2//，已收未审核1，已审核2，已冲红3
          check: !ifVertify
        });

      CheckBill(newData).then(res => {
        message.success('提交成功');
        reload();
        closeVertify();
      });
    });
  };

  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#e4aa5b">未收</Tag>;
      case 1:
        return <Tag color="#19d54e">已收</Tag>;
      case 2:
        return <Tag color="#19d54e">冲红</Tag>;
      case -1:
        return <Tag color="#e4aa5b">作废</Tag>;
      default:
        return '';
    }
  };

  const GetVerifyStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#D7443A">待审核</Tag>;
      case 1:
        return <Tag color="#19d54e">已审核</Tag>;
      case 2:
        return <Tag color="#e4aa4b">已送审</Tag>;
      case 3:
        return <Tag color="#19d54e">已复核</Tag>;
      default:
        return '';
    }
  };

  const columns = [
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 150,
      sorter: true,
    },
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100,
      sorter: true,
    },
    {
      title: '应收期间',
      dataIndex: 'period',
      key: 'period',
      width: 120,
      sorter: true,
      render: val => val != null ? moment(val).format('YYYY年MM月') : ''
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
    {
      title: '应收金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
    }, {
      title: '本次实收金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
      width: 100,
    }, {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      width: 120,
      render: val => val != null ? moment(val).format('YYYY-MM-DD') : ''
    }, {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: val => val != null ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    }
  ] as ColumnProps<any>[];

  const initLoadFeeDetail = (billId) => {
    const queryJson = { billId: billId };
    const sidx = 'beginDate';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billId';
    data.sord = data.sord || 'asc';
    return ChargeFeeDetail(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setChargeBillData(res.data);
      setLoading(false);
      return res;
    });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={closeVertify}
      visible={vertifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Card className={styles.card}>
        <Form layout="vertical">

          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="收款单号"  >
                {infoDetail.billCode}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收款日期" >
                {String(infoDetail.billDate).substr(0, 10)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="收款人"  >
                {infoDetail.createUserName}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="付款单号"  >
                {infoDetail.payCode}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="发票编号"  >
                {infoDetail.invoiceCdde}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="冲红单号" >
                {linkno}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="费用状态"   >
                {GetStatus(infoDetail.status)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="单据状态"   >
                {/* {infoDetail.ifVerify ? '已审核' : '未审核'} */}
                {GetVerifyStatus(infoDetail.ifVerify)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="收款金额" style={{ color: "red" }}>
                {`${infoDetail.payAmountA + infoDetail.payAmountB + infoDetail.payAmountC}元，其中${infoDetail.payTypeA}${infoDetail.payAmountA}元，${infoDetail.payTypeB}${infoDetail.payAmountB}元，${infoDetail.payTypeC}${infoDetail.payAmountC}元`}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="备注">
                {infoDetail.memo}
              </Form.Item>
            </Col>
          </Row>
          <Table
            // title={() => '费用明细'}
            size="middle"
            dataSource={chargeBillData}
            columns={columns}
            rowKey={record => record.billId}
            pagination={pagination}
            scroll={{ y: 500, x: 1500 }}
            loading={loading}
          /> 
          {!ifVertify ?
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="审核说明" >
                  {getFieldDecorator('verifyMemo', {
                    initialValue: infoDetail.verifyMemo,
                  })(
                    <Input.TextArea rows={5} style={{ width: '100%' }} />
                  )}
                </Form.Item>
              </Col>
            </Row> : null
          }
        </Form>
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={closeVertify} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={audit} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<VertifyProps>()(Vertify);

