import Page from '@/components/Common/Page';
import { Divider, message, Table, Modal } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import Link from 'umi/link';
import React from 'react';
import { RemoveForm } from './House.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(id: string): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, pagination, data, modify, reload } = props;
  const changePage = (pag: PaginationConfig, filters, sorter) => {
    onchange(pag, filters, sorter);
  };
  const doInvalid = record => {
    Modal.confirm({
      title: '请确认',
      content: `您确认要作废${record.name}吗？`,
      onOk: () => {
        RemoveForm(record.id).then(() => {
          message.success('作废成功');
          reload();
        });
      },
    });
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        //return <Link to={`housemore?pstructid=${record.id}&type=2`}>{record.name}</Link>   
        return <Link key='linkto' to={{ pathname: 'housemore', state: { organizeid: record.organizeid, pstructid: record.id } }}>{record.name}</Link>
      },

    },
    {
      title: '总建筑面积',
      dataIndex: 'area',
      key: 'area',
      width: 130,
      // sorter: (a, b) => a.area - b.area
      sorter: true,
    },
    {
      title: '房产总数',
      dataIndex: 'roomcount',
      key: 'roomcount',
      width: 100,
      sorter: true,
    },
    {
      title: '入住面积',
      dataIndex: 'checkarea',
      key: 'checkarea',
      width: 110,
      sorter: true,
    },
    {
      title: '空置面积',
      dataIndex: 'emptyarea',
      key: 'emptyarea',
      width: 110,
      // render: (text, record) => {
      //   return record.area - record.checkarea;
      // },
      sorter: true,
    },
    {
      title: '入住房产数',
      dataIndex: 'checkroom',
      key: 'checkroom',
      width: 120,
      sorter: true,
    },
    {
      title: '空置房产数',
      dataIndex: 'vacancyroom',
      key: 'vacancyroom',
      width: 120,
      sorter: true,
    },
    {
      title: '入驻率',
      //dataIndex: 'checkrate',
      sorter: true,
      key: 'checkrate',
      render: (text, record) => {
        return (
          (record.roomcount ? (record.checkroom / record.roomcount) * 100 : 0).toFixed(2) + '%'
        );
      },
      // render: (text, record) => {
      //   if (text != null)
      //     return text + '%';
      //   else
      //     return '';
      // }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 95,
      fixed: 'right',
      render: (text, record) => {
        return [
          // <Button
          //   type="primary"
          //   key="modify"
          //   style={{ marginRight: '10px' }}
          //   onClick={() => modify(record.id)} >
          //   修改
          // </Button>,
          // <Button type="danger" key="delete" onClick={() => doDelete(record)}>
          //   删除
          // </Button>, 
          <span key='buttons'>
            <a onClick={() => modify(record.id)} key="modify">修改</a>
            <Divider type="vertical" key="split" />
            <a onClick={() => doInvalid(record)} key="delete">作废</a>
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
        scroll={{ x: 1100 }}
        onChange={(pag: PaginationConfig, filters, sorter) => changePage(pag, filters, sorter)}
        loading={loading}
      />
    </Page>
  );
}

export default ListTable;
