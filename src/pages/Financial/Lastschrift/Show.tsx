//查看
import { Modal, Input, message, Tag, Spin, Card, Button, Col, Drawer, Form, Row, Table } from 'antd';
import { DefaultPagination } from '@/utils/defaultSetting';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetFormJson, GetListById, InvalidItemForm } from './Lastschrift.service';
import styles from './style.less';
import moment from 'moment';

interface ShowProps {
  showVisible: boolean;
  closeDrawer(): void;
  form: WrappedFormUtils;
  id?: string;
  // organizeId?: string;
  // reload(): void;
}

const Show = (props: ShowProps) => {
  const { showVisible, closeDrawer, id, form } = props;
  // const title = id === undefined ? '新增冲抵单' : '修改冲抵单';
  const title = '查看划账单';
  const [loading, setLoading] = useState<boolean>(false);
  // const [units,setUnits] = useState<string>([]);
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [noticeData, setNoticeData] = useState<any>([]);
  const [listdata, setListData] = useState<any>(); //useState<any[]>([]); 
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());

  useEffect(() => {
    if (showVisible) {
      if (id != null && id != '') {
        // setLoading(true);
        GetFormJson(id).then(res => {
          setInfoDetail(res);
          form.resetFields();
          // loadNoticeData('', res.organizeId);
          // setLoading(false); 
          //分页查询
          // const { current: pageIndex, pageSize, total } = pagination;
          // const searchCondition: any = {
          //   pageIndex,
          //   pageSize,
          //   total,
          //   keyvalue: res.billId
          // };  
          // setLoading(true);
          // GetListByID(searchCondition).then(res => {
          //   //明细
          //   setListData(res.data);
          //   setLoading(false);
          // }) 
          initLoad(res.billId, '');
        });
      } else {
        setInfoDetail({});
      }
    }
    // else {
    //   form.setFieldsValue({});
    // }

  }, [showVisible]);


  const initLoad = (keyvalue, search) => {
    setSearch(search);
    const queryJson = { keyvalue: keyvalue };
    const sidx = 'id';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'id';
    data.sord = data.sord || 'asc';
    return GetListById(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setListData(res.data);
      setLoading(false);
      return res;
    });
  };

  const [search, setSearch] = useState<string>();
  //刷新
  const loadData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search, keyvalue: id, },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'id';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  // const changePage = (pagination: PaginationConfig, filters, sorter) => {
  //   loadData(pagination, sorter);
  // };

  const columns = [
    {
      title: '划账费项',
      dataIndex: 'feeName',
      key: 'feeName',
      width: 100,
    },
    {
      title: '计费起始日期',
      dataIndex: 'beginDate',
      key: 'beginDate',
      align: 'center',
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    }, {
      title: '计费截止日期',
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'center',
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '划账金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
    },
    {
      title: '扣款金额',
      dataIndex: 'deductionAmount',
      key: 'deductionAmount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 80,
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">未扣</Tag>;
          case 1:
            return <Tag color="#19d54e">已扣</Tag>;
          case -1:
            return <Tag color="#e4aa5b">作废</Tag>;
          default:
            return '';
        }
      }
    },
    {
      title: '户名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '单元编号',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '开户银行',
      dataIndex: 'accountBank',
      key: 'accountBank',
      width: 120,
    },
    {
      title: '账号',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 180,
    },

    {
      title: '单元全称',
      dataIndex: 'allName',
      key: 'allName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      key: 'operation',
      fixed: 'right',
      width: 60,
      render: (text, record) => {
        return [ 
          record.status == 1 ? null : 
            <a onClick={() => {
              Modal.confirm({
                title: '请确认',
                content: `您是否要作废吗？`,
                cancelText: '取消',
                okText: '确认',
                onOk: () => {
                  InvalidItemForm(record.id)
                    .then(() => {
                      message.success('作废成功');
                      initLoad(id, search);
                    })
                    .catch(e => {
                      message.error('作废失败');
                    });
                },
              });
            }} key="delete">作废</a>
        ];
      },
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      //  className="offsetModify"
      title={title}
      placement="right"
      width={850}
      onClose={closeDrawer}
      visible={showVisible}
      // style={{ height: 'calc(100vh-50px)' }}
      bodyStyle={{ background: '#f6f7fb', height: 'calc(100vh -55px)' }}  >
      <Spin tip="数据处理中..." spinning={loading}>
        <Form layout="vertical" hideRequiredMark>
          <Card className={styles.card}  hoverable>
            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="划账单号">
                  {infoDetail.billCode}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="单据日期">
                  {infoDetail.billDate}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="划账人" >
                  {infoDetail.createUserName}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col lg={8}>
                <Form.Item label="是否审核">
                  {infoDetail.ifVerify ? '已审核' : '未审核'}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="审核日期"  >
                  {infoDetail.verifyDate}
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label="审核人">
                  {infoDetail.verifyPerson}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item label="备注"  >
                  {infoDetail.memo}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Item label="审核意见">
                  {infoDetail.verifyMemo}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: '15px' }}>
              <div style={{ marginBottom: '5px', padding: '3px 2px' }}>
                <Input.Search
                  key='search'
                  className="search-input"
                  placeholder="搜索房屋编号"
                  style={{ width: 180 }}
                  onSearch={value => loadData(value)}
                />
              </div>
              <Table
                // bordered={false}
                size="middle"
                columns={columns}
                dataSource={listdata}
                // rowKey="billId"
                rowKey={record => record.id}
                pagination={pagination}
                scroll={{ y: 500, x: 1500 }}
                loading={loading}
                onChange={(pagination: PaginationConfig, filters, sorter) =>
                  // changePage(pagination, filters, sorter)
                  loadData(search, pagination, sorter)
                }
              />
            </Row>
          </Card>
        </Form>
      </Spin>
      <div
        style={{
          position: 'absolute',
          zIndex: 999,
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button style={{ marginRight: 8 }}
          onClick={closeDrawer}
        >
          关闭
        </Button>
        {/* <Button type="primary"
          onClick={() => onSave()}
        >
          提交
        </Button> */}
      </div>

    </Drawer>
  );
};

export default Form.create<ShowProps>()(Show);

