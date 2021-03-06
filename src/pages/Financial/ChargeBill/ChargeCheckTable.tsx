//对账单
import Page from '@/components/Common/Page';
import { Tag, Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { InvalidPaylog, ConfirmForm } from './Main.service';
// import styles from './style.less';

interface ChargeCheckTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  // showDetail(): void;
  // showVerify(id: string, ifVerify: boolean): void;
  reload(): void;
  // getRowSelect(record): void;
}

function ChargeCheckTable(props: ChargeCheckTableProps) {
  const { onchange, loading, pagination, data, reload } = props;
  //确认收款
  const confirm = (record) => {
    Modal.confirm({
      title: '请确认',
      content: `对${record.tradeNo}确认收款么？`,
      onOk: () => {
        ConfirmForm(record.billId).then(() => {
          message.success('确认成功');
          reload();
        });
      },
    });
  }

  //作废paylog
  const invalid = (record) => {
    Modal.confirm({
      title: '请确认',
      content: `您确定要作废${record.tradeNo}么？`,
      onOk: () => {
        InvalidPaylog(record.billId).then(() => {
          message.success('作废成功');
          reload();
        });
      },
    });
  }

  const columns = [
    {
      title: '房产全称',
      dataIndex: 'allName',
      key: 'allName',
      width: 280,
      fixed: 'left'
    },
    {
      title: '管理处',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 180,
    },
    // {
    //   title: '楼盘',
    //   dataIndex: 'areaName',
    //   key: 'areaName',
    //   width: 120,
    // },
    // {
    //   title: '楼栋',
    //   dataIndex: 'buildingName',
    //   key: 'buildingName',
    //   width: 80,
    // },

    {
      title: '订单日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 100,
      sorter: true,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },

    {
      title: '商户订单号',
      dataIndex: 'tradeNo',
      key: 'tradeNo',
      width: 200,
    },

    {
      title: '交易流水号',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 260,
    },


    {
      title: '订单来源',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 100,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      sorter: true,
      // render: val => val == 0 ? '未确认' : '已确认'
      render: (text, record) => {
        switch (text) {
          case 0:
            return <Tag color="#e4aa5b">待确认</Tag>;
          case 1:
            return <Tag color="#119688">已确认</Tag>;
          case -1:
            return <Tag color="#d82d2d">已作废</Tag>
          default:
            return '';
        }
      }
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: true,
    },
    {
      title: '收款单号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 220,
    }, {
      title: '收款单日期',
      dataIndex: 'rBillDate',
      key: 'rBillDate',
      width: 100,
      render: val => val ? moment(val).format('YYYY-MM-DD') : ''
    },
    {
      title: '收款方式',
      dataIndex: 'payTypeA',
      key: 'payTypeA',
      width: 100,
    },
    {
      title: '收款金额',
      dataIndex: 'payAmountA',
      key: 'payAmountA',
      width: 100,
    },

    // {
    //   title: '手续费',
    //   dataIndex: 'serviceFee',
    //   key: 'serviceFee',
    //   width: 100,
    // },

    // {
    //   title: '提现金额',
    //   dataIndex: 'actualAmount',
    //   key: 'actualAmount',
    //   width: 100,
    // },

    {
      title: '发票编号',
      dataIndex: 'invoiceCode',
      key: 'invoiceCode',
      width: 100,
    }, {
      title: '收据编号',
      dataIndex: 'payCode',
      key: 'payCode'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (text, record) => {
        if (record.status == 0) {
          return [
            <span>
              {record.status == 0 ? <a onClick={() => confirm(record)} key="exit">确认</a> : null}
              <Divider type="vertical" />
              <a onClick={() => invalid(record)} key="invalid">作废</a>
            </span>
          ];
        }else{
          return null;
        }
      },
    },
  ] as ColumnProps<any>[];

  // const [selectedRowKey, setSelectedRowKey] = useState([]);
  // const onRow = (record) => {
  //   return {
  //     onClick: event => {
  //       setSelectedRowKey(record.billId);
  //       // getRowSelect(record);
  //     }, // 点击行
  //     // onDoubleClick: event => {
  //     // },
  //     // onContextMenu: event => {
  //     // },
  //     // onMouseEnter: event => {
  //     // }, // 鼠标移入行
  //     // onMouseLeave: event => {
  //     // },
  //   };
  // }

  // const setClassName = (record, index) => {
  //   if (record.billId === selectedRowKey) {
  //     return styles.rowSelect;
  //   }
  // };

  return (
    <Page >
      <Table
        // className={styles.chargeListTable}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.billId}
        pagination={pagination}
        scroll={{ y: 500, x: 2200 }}
        // rowClassName={setClassName} //表格行点击高亮
        loading={loading}
        // onRow={onRow}
        onChange={onchange}
      />
    </Page>
  );
}
export default ChargeCheckTable;
