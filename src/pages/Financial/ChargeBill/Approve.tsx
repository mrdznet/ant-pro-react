//送审
import { message, Card, Button, Col, Drawer, Form, Input, Row, Table } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetReceiveListByBillId, GetSubmitEntity } from './Main.service';
import { DefaultPagination } from '@/utils/defaultSetting';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import { ApproveForm, RejectForm } from '../../Workflow/FlowTask/FlowTask.service'
import styles from './style.less';
import moment from 'moment';
import CommentBox from '../../Workflow/CommentBox';

interface ApproveProps {
  visible: boolean;
  flowId?: string;//流程id
  id?: string;//任务id
  instanceId?: string;//合同id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
}

const Approve = (props: ApproveProps) => {
  const { reload, visible, closeDrawer, flowId, id, instanceId, form } = props;
  const { getFieldDecorator } = form;
  const title = "单据详情";
  const [loading, setLoading] = useState<boolean>(false);
  const [chargeBillData, setChargeBillData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [infoDetail, setInfoDetail] = useState<any>({});

  //打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (instanceId != null) {
        setLoading(true);
        GetSubmitEntity(instanceId).then(res => {
          setInfoDetail(res);
          initLoad();
          setLoading(false);
        })
      }
    }
  }, [visible]);

  const approve = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        ApproveForm({
          flowId: flowId,
          id: id,
          instanceId: instanceId,
          verifyMemo: values.verifyMemo
        }).then(res => {
          message.success('审批成功');
          closeDrawer();
          reload();
        });
      }
    });
  };

  const reject = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        RejectForm({
          flowId: flowId,
          id: id,
          instanceId: instanceId,
          verifyMemo: values.verifyMemo
        }).then(res => {
          message.success('退回成功！');
          closeDrawer();
          reload();
        });
      }
    });
  };

  const initLoad = () => {
    const sidx = 'billCode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, billId: instanceId }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billCode';
    data.sord = data.sord || 'asc';
    return GetReceiveListByBillId(data).then(res => {
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

  //刷新
  const loadData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      billId: instanceId,
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billCode';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
  };

  const columns = [
    {
      title: '收款单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 180,
      sorter: true,
    },
    {
      title: '收款日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '单元编号',
      dataIndex: 'unitId',
      key: 'unitId',
      width: 150,
      sorter: true,
    },
    {
      title: '业户名称',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      sorter: true,
    },
    {
      title: '收款方式A',
      dataIndex: 'payTypeA',
      key: 'payTypeA',
      width: 100,
    },
    {
      title: '收款金额A',
      dataIndex: 'payAmountA',
      key: 'payAmountA',
      width: 100,
    },
    {
      title: '收款方式B',
      dataIndex: 'payTypeB',
      key: 'payTypeB',
      width: 100,
    },
    {
      title: '收款金额B',
      dataIndex: 'payAmountB',
      key: 'payAmountB',
      width: 100,
    },
    {
      title: '收款方式C',
      dataIndex: 'payTypeC',
      key: 'payTypeC',
      width: 100,
    },
    {
      title: '收款金额C',
      dataIndex: 'payAmountC',
      key: 'payAmountC',
      width: 100,
    },
    {
      title: '发票编号',
      dataIndex: 'invoiceCode',
      key: 'invoiceCode',
      width: 100,
    },
    {
      title: '收据编号',
      dataIndex: 'payCode',
      key: 'payCode',
      width: 100,
    },
    {
      title: '收款人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 80,
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    }
  ] as ColumnProps<any>[];


  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Form layout="vertical" hideRequiredMark>
        <Card className={styles.cardnarrow}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="总金额">
                {infoDetail.amount}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="送审日期">
                {infoDetail.createDate}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="送审人">
                {infoDetail.createUserName}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="收款金额" style={{ color: "green" }}>
                {infoDetail.receiveDetail}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="送审说明" >
                {infoDetail.memo}
              </Form.Item>
            </Col>
          </Row>
          <Table
            size="middle"
            dataSource={chargeBillData}
            columns={columns}
            rowKey={record => record.billId}
            pagination={pagination}
            scroll={{ y: 500, x: 1500 }}
            loading={loading}
            onChange={(pagination: PaginationConfig, filters, sorter) =>
              changePage(pagination, filters, sorter)
            }
          />
        </Card>

        <Card className={styles.card}>
          <CommentBox instanceId={instanceId} />
          <Form.Item label="">
            {getFieldDecorator('verifyMemo', {
              rules: [{ required: true, message: '请输入审核意见' }]
            })(
              <Input.TextArea rows={4} />
            )}
          </Form.Item>
        </Card>
      </Form>
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
        <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
          关闭
        </Button>
        <Button onClick={reject} type='danger' style={{ marginRight: 8 }}>
          退回
        </Button>
        <Button onClick={approve} type="primary">
          通过
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<ApproveProps>()(Approve);

