import Page from '@/components/Common/Page';
import { Divider, message, Modal, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { RemoveForm } from './PublicArea.service';

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
          .catch(e => {});
      },
    });
  };
  const columns = [
    {
      title: '公区名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      sorter: true,
    },
    {
      title: '公区编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 150,
      sorter: true,
    },
    {
      title: '全称',
      dataIndex: 'psAllName',
      key: 'psAllName',
      width: 300,
      sorter: true,
    },
    {
      title: '位置描述',
      dataIndex: 'otherCode',
      key: 'otherCode',
      width: 200,
      sorter: true,
    },
    {
      title: '是否审核',
      dataIndex: 'auditMark',
      key: 'auditMark',
      width: 100,
      sorter: true,
      render: (text: any) => {
        switch (text) {
          case 1:
            return '是';
          case 0:
            return '否';
          default:
            return null;
        }
      },
    },
    {
      title: '审核人',
      dataIndex: 'auditman',
      key: 'auditman',
      width: 150,
      sorter: true,
    },
    {
      title: '审核日期',
      dataIndex: 'auditdate',
      key: 'auditdate',
      width: 200,
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      key: 'memo',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 155,
      fixed: 'right',
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => modify(record)}
          // >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>,


          <span>
          <a onClick={() => modify(record.id)} key="modify">修改</a>
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
        rowKey={record => record.pCode}
        pagination={pagination}
        scroll={{ x: 1850 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
