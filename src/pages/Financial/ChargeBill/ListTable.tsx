//未收列表
import Page from '@/components/Common/Page';
import { InputNumber, Input, Select, Col, Row, Form, DatePicker, Card, Button, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import * as moment from 'moment';
import { WrappedFormUtils } from 'antd/lib/form/Form';


import { RemoveForm, Charge } from './Main.service';
import styles from './style.less';
const { Option } = Select;

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  reload(): void;
  form: WrappedFormUtils;
}

function ListTable(props: ListTableProps) {
  const { form, onchange, loading, pagination, data, modify, reload } = props;
  const { getFieldDecorator } = form;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.name}`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('保存成功');
          reload();
        });
      },
    });
  };
  const columns = [
    {
      title: '收费项目',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 140,
      sorter: true,
    },
    {
      title: '应收金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 80,
      sorter: true,
    },
    {
      title: '减免金额',
      dataIndex: 'reductionAmount',
      key: 'reductionAmount',
      width: 80,
      sorter: true,
    },
    {
      title: '冲抵金额',
      dataIndex: 'offsetAmount',
      key: 'offsetAmount',
      width: 80,
      sorter: true,
    },
    {
      title: '未收金额',
      dataIndex: 'lastAmount',
      key: 'lastAmount',
      width: 80,
      sorter: true,
    },
    {
      title: '计费起始日期',
      dataIndex: 'begindate',
      key: 'begindate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '计费终止日期',
      dataIndex: 'enddate',
      key: 'enddate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '账单日',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 85,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    }, {
      title: '房屋全称',
      dataIndex: 'allname',
      key: 'allname',
      width: 250
    }, {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
      width: 200
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      width: 155,
      render: (text, record) => {
        return [
          <Button
            type="primary"
            key="modify"
            style={{ marginRight: '10px' }}
            onClick={() => modify(record.id)}
          >
            修改
          </Button>,
          <Button type="danger" key="delete" onClick={() => doDelete(record)}>
            删除
          </Button>,
        ];
      },
    },
  ] as ColumnProps<any>;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sumEntity, setSumEntity] = useState();
  const [unitID, setUnitID] = useState();
  const [customerName, setCustomerName] = useState();

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    //应收金额
    var sumEntity = {};
    var sumAmount = 0, sumreductionAmount = 0, sumoffsetAmount = 0, sumlastAmount = 0;
    selectedRows.map(item => {
      sumAmount = selectedRows.reduce((sum, row) => { return sum + row.amount; }, 0);
      sumreductionAmount = selectedRows.reduce((sum, row) => { return sum + row.reductionAmount; }, 0);
      sumoffsetAmount = selectedRows.reduce((sum, row) => { return sum + row.offsetAmount; }, 0);
      sumlastAmount = selectedRows.reduce((sum, row) => { return sum + row.lastAmount; }, 0);
    });

    sumEntity['sumAmount'] = sumAmount.toFixed(2);
    sumEntity['sumreductionAmount'] = sumreductionAmount.toFixed(2);
    sumEntity['sumoffsetAmount'] = sumoffsetAmount.toFixed(2);
    sumEntity['sumlastAmount'] = sumlastAmount.toFixed(2);
    setSumEntity(sumEntity);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  //收款
  const charge = () => {
    form.validateFields((errors, values) => {
      if (!errors) {

        Modal.confirm({
          title: '请确认',
          content: `确定要执行收款操作吗？`,
          onOk: () => {
            const newData = { ...values, billDate: values.billDate.format('YYYY-MM-DD') };
            newData.unitID = 'HBL021404';//unitID
            newData.customerName = '徐英婕/徐凯';//customerName;
            Charge({ ...newData, ids: selectedRowKeys }).then(res => {
              message.success('保存成功');
            });
          }
        });
      }
    });
  };

  return (
    <Page>
      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.card} bordered={false}  >
          <Row gutter={27}>
            <Col lg={4}>
              <Form.Item >
                {getFieldDecorator('payTypeA', {
                  initialValue: '支付宝扫码'
                })(
                  <Select >
                    <Option value="现金">现金</Option>
                    <Option value="支付宝扫码" >支付宝扫码</Option>
                    <Option value="支付宝">支付宝</Option>
                    <Option value="微信" >微信</Option>
                    <Option value="微信扫码">微信扫码</Option>
                    <Option value="刷卡">刷卡</Option>
                    <Option value="转账">转账</Option>
                    <Option value="抵扣卷">抵扣卷</Option>
                  </Select>
                )}

              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item required>
                {getFieldDecorator('payAmountA', {
                  initialValue: hasSelected ? sumEntity.sumAmount : 0,
                  rules: [{ required: true, message: '请输入金额' }],
                })(<InputNumber
                  precision={2}
                  min={0}
                  max={hasSelected ? sumEntity.sumAmount : 0}
                  style={{ width: '150px' }}
                />)}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item >
                {getFieldDecorator('payTypeB', {
                  initialValue: '微信'
                })(
                  <Select  >
                    <Option value="现金">现金</Option>
                    <Option value="支付宝扫码" >支付宝扫码</Option>
                    <Option value="支付宝">支付宝</Option>
                    <Option value="微信" >微信</Option>
                    <Option value="微信扫码">微信扫码</Option>
                    <Option value="刷卡">刷卡</Option>
                    <Option value="转账">转账</Option>
                    <Option value="抵扣卷">抵扣卷</Option>
                  </Select>
                )}

              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item required>

                {getFieldDecorator('payAmountB', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请输入金额' }],
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    max={hasSelected ? sumEntity.sumAmount : 0}
                    style={{ width: '150px' }}
                  />
                )}

              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item >
                {getFieldDecorator('payTypeC', {
                  initialValue: '现金'
                })(
                  <Select>
                    <Option value="现金">现金</Option>
                    <Option value="支付宝扫码" >支付宝扫码</Option>
                    <Option value="支付宝">支付宝</Option>
                    <Option value="微信" >微信</Option>
                    <Option value="微信扫码">微信扫码</Option>
                    <Option value="刷卡">刷卡</Option>
                    <Option value="转账">转账</Option>
                    <Option value="抵扣卷">抵扣卷</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item required>
                {getFieldDecorator('payAmountC', {
                  initialValue: 0,
                  rules: [{ required: true, message: '请输入金额' }],
                })(
                  <InputNumber
                    precision={2}
                    min={0}
                    max={hasSelected ? sumEntity.sumAmount : 0}
                    style={{ width: '150px' }}
                  />
                )}

              </Form.Item>
            </Col>
            <Col lg={4}>
              <Form.Item required>
                {getFieldDecorator('billDate', {
                  initialValue: moment(new Date()),
                  rules: [{ required: true, message: '请选择收款日期' }],
                })(<DatePicker />)}
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Form.Item >
                {getFieldDecorator('payCode', {
                })(<Input placeholder="请输入收据编号" />)}
              </Form.Item>

            </Col>
            <Col lg={6}>
              <Form.Item >

                {getFieldDecorator('invoiceCode', {
                })(<Input placeholder="请输入发票编号" />)}

              </Form.Item>
            </Col>

            <Col lg={8}>
              <Form.Item >
                {getFieldDecorator('memo', {
                })(<Input placeholder="请输入备注" />)}

              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" onClick={charge}>收款确认</Button>
          <span style={{ marginLeft: 8, color: "red" }}>
            {hasSelected ? `应收金额：${sumEntity.sumAmount} ，减免金额：${sumEntity.sumreductionAmount}，冲抵金额：${sumEntity.sumoffsetAmount}，未收金额：${sumEntity.sumlastAmount}` : ''}
          </span>

        </Card>
      </Form>
      <Table
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500, x: 1800 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
        rowSelection={rowSelection}
      />
    </Page>
  );
}

//export default ListTable;

export default Form.create<ListTableProps>()(ListTable);