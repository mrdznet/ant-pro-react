import Page from '@/components/Common/Page';
import { Tag, Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import moment from 'moment';
import { RemoveForm } from './Main.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  onchange(page: any, filter: any, sort: any): any;
  modify(data: any): void;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除${record.name}吗`,
      onOk: () => {
        RemoveForm(record.pCode)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(e => { });
      },
    });
  };
  const columns = [
    {
      title: '单据编号',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150,
      sorter: true,
    },
    {
      title: '来源',
      dataIndex: 'sourceType',
      key: 'sourceType',
      width: 100,
      sorter: true,
    },
    {
      title: '报修区域',
      dataIndex: 'repairArea',
      key: 'repairArea',
      width: 100,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      sorter: true,
      render: (text, record) => {
        switch (text) {
          case 1:
            return <Tag color="#e4aa5b">待派单</Tag>
          case 2:
            return <Tag color="#19d54e">待接单</Tag>
          case 3:
            return <Tag color="#e4aa5b">待开工</Tag>
          case 4:
            return <Tag color="#61c33a">处理中</Tag>
          case 5:
            return <Tag color="#ff5722">暂停</Tag>
          case 6:
            return <Tag color="#5fb878">待回访</Tag>
          case 7:
            return <Tag color="#29cc63">待检验</Tag>
          case 8:
            return <Tag color="#e48f27">待审核</Tag>
          case 9:
            return <Tag color="#c31818">已退单</Tag>
          case 10:
            return <Tag color="#009688">已归档</Tag>
          case -1:
            return <Tag color="#d82d2d">已作废</Tag>
          default:
            return '';
        }
      }
    },

    {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      sorter: true,
      render: val => <span> {moment(val).format('YYYY-MM-DD')} </span>
    },
    {
      title: '关联地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      sorter: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
      sorter: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contactLink',
      key: 'contactLink',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align:'center',
      width: 95,
      fixed: 'right',
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => modify(record)}>
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>
          <span>
            <a onClick={() => modify(record)} key="modify">修改</a>
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
        scroll={{ x: 1200 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
