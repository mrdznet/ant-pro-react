import Page from '@/components/Common/Page';
import { Divider, message, Modal, Switch, Table } from 'antd';
import { ColumnProps, PaginationConfig } from 'antd/lib/table';
import React from 'react';
import { SaveForm, RemoveForm } from './Role.service';

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  choose(record: any): void;
  showAuth(record: any): void;

  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  setData(data: any[]): void;
}

function ListTable(props: ListTableProps) {
  const { loading, data, modify, reload, pagination, setData, choose, showAuth } = props;

  const doDelete = record => {
    Modal.confirm({
      title: '请确认',
      content: `您是否要删除 ${record.fullName} 吗`,
      onOk: () => {
        RemoveForm(record.roleId)
          .then(() => {
            message.success('删除成功');
            reload();
          })
          .catch(e => { });
      },
    });
  };
  const doModify = record => {
    modify({ ...record });
  };
  const toggleDisabled = record => {
    record.enabledMark = record.enabledMark === 0 ? 1 : 0;
    let keyValue = record.roleId;
    SaveForm({ ...record, keyValue }).then(() => {
      setData([...data]);
    });
  };
  const columns = [
    {
      title: '角色编号',
      dataIndex: 'enCode',
      key: 'enCode',
      width: 100,
    },
    {
      title: '角色名称',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      key: 'createDate',
      width: 120,
    },
    {
      title: '有效',
      dataIndex: 'enabledMark',
      key: 'enabledMark',
      width: 80,
      render: (text: any, record, index) => {
        return (
          <Switch
            size="small"
            checked={text === ENABLEDMARKS.正常}
            checkedChildren={ENABLEDMARKS[ENABLEDMARKS.正常]}
            unCheckedChildren={ENABLEDMARKS[ENABLEDMARKS.禁用]}
            onClick={() => toggleDisabled(record)}
          />
        );
      },
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      width: 140,
      render: (text, record) => {
        return [
          <span>
            <a
              type="link"
              key="modify"
              onClick={() => doModify(record)}
            >
              修改
          </a>
            <Divider type="vertical" key='divider' />
            <a key="choose" type='link' onClick={() => choose(record)}>
              角色成员
          </a> 
          <Divider type="vertical" key='divider' /> 
          <a key="auth" type='link' onClick={() => showAuth(record)}>
              角色授权
          </a> 
            <Divider type="vertical" key='divider' />
            <a type="link" key="delete" onClick={() => doDelete(record)}>
              删除
          </a>
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
        rowKey={record => record.roleId}
        scroll={{ y: 500 }}
        loading={loading}
        pagination={pagination}
      />
    </Page>
  );
}

export default ListTable;

enum ENABLEDMARKS {
  正常 = 1,
  禁用 = 0,
}
