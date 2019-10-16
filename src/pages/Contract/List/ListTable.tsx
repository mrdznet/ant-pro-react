import Page from '@/components/Common/Page';
import { Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './Main.service';
import moment from 'moment';

interface ListTableProps {
  onchange(page: any, filter: any, sort: any): any;
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  detail(id: string, chargeId: string): void;
  modify(id: string, chargeId: string): void;
  reload(): void;
};

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, detail, modify, reload } = props;
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
      title: '房号',
      dataIndex: 'no',
      key: 'no',
      width: 200,
      render: (text, row, index) => {
        var house = "";
        if (row.houseList) {
          for (var i = 0; i < row.houseList.length; i++) {
            house = house + row.houseList[i].allName + "，";
          }
          return house.slice(0, house.length - 1);
        }
        return "";
      }
    },

    {
      title: '合同编号',
      dataIndex: 'no',
      key: 'no',
      width: 100,
    },

    {
      title: '租客',
      dataIndex: 'customer',
      key: 'customer',
      width: 120,
    },

    {
      title: '开始日',
      dataIndex: 'billingDate',
      key: 'billingDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },
    {
      title: '合同状态',
      dataIndex: 'state',
      key: 'state',
      width: 100,
    },
    {
      title: '退租日',
      dataIndex: 'contractEndDate',
      key: 'contractEndDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },

    {
      title: '总计租金',
      dataIndex: 'leasesize',
      key: 'leasesize',
      width: 100,
    },

    {
      title: '签订日',
      dataIndex: 'contractStartDate',
      key: 'contractStartDate',
      width: 100,
      render: val => moment(val).format('YYYY-MM-DD')
    },


    {
      title: '租赁数(㎡)',
      dataIndex: 'leaseSize',
      key: 'leaseSize',
      width: 100,
    },

    {
      title: '租赁数押金',
      dataIndex: 'leaseSize',
      key: 'leaseSize',
      width: 100,
    },

    {
      title: '租赁条款单价',
      dataIndex: 'leaseSize',
      key: 'leaseSize',
      width: 100,
    },

    {
      title: '是否续租',
      width: 100,
    },

    {
      title: '签订人',
      dataIndex: 'signer',
      key: 'signer',
      width: 100,
    },

    {
      title: '跟进人',
      dataIndex: 'follower',
      key: 'follower',
      width: 100,
    },


    {
      title: '法人',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
      width: 100,
    },

    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
    },

    {
      title: '操作',
      align: 'center',
      dataIndex: 'operation',
      key: 'operation',
      width: 140,
      fixed: 'right',
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="detail"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => detail(record.id,record.chargeId)}
          // >
          //   查看
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,
          <span>
            <a onClick={() => modify(record.id, record.chargeId)} key="modify">修改</a>
            <Divider type="vertical" /> 
            <a onClick={() => detail(record.id, record.chargeId)} key="detail">查看</a>
            <Divider type="vertical" />
            <a onClick={() => doDelete(record)} key="delete">删除</a>
          </span>
        ];
      },
    },
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        style={{ border: 'none' }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        pagination={pagination}
        scroll={{ y: 500, x: 2000 }}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
