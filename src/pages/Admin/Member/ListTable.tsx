import Page from "@/components/Common/Page";
import { Divider, message, Modal, Table } from "antd";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import React from "react";
import { RemoveForm } from "./Member.service";

interface ListTableProps {
  loading: boolean;
  pagination: PaginationConfig;
  data: any[];
  modify(record: any): void;
  // choose(record: any): void;
  onchange(page: any, filter: any, sort: any): any;
  reload(): void;
  setData(data: any[]): void;
}

function ListTable(props: ListTableProps) {
  const { onchange, loading, data, modify, reload, pagination } = props;
  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    onchange(pagination, filters, sorter);
  };
  const doDelete = record => {
    Modal.confirm({
      title: "请确认",
      content: `您确认要删除${record.fullName}吗？`,
      onOk: () => {
        RemoveForm(record.ruleId)
          .then(() => {
            message.success("删除成功");
            reload();
          }).catch(e => { });
      }
    });
  };

  const doModify = record => {
    modify({ ...record });
  };

  const columns = [

    {
      title: "头像",
      dataIndex: "headImgUrl",
      key: "headImgUrl", 
      align:'center',
      width: 80,
      render: val => val ? <img src={val} style={{ height: 50, width: 50 }} ></img> : ''
    },

    {
      title: "昵称",
      dataIndex: "nickName",
      key: "nickName",
      sorter: true,
      width: 150
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: 150,
    },
    {
      title: "手机号码",
      dataIndex: "mobile",
      key: "mobile",
      sorter: true,
      width: 120
    },
    {
      title: "所属机构",
      dataIndex: "orgName",
      key: "orgName",
      width: 150
    },

    {
      title: "积分",
      dataIndex: "scores",
      key: "scores",
      width: 80
    },
    {
      title: "注册时间",
      dataIndex: "createDate",
      key: "createDate",
      width: 160
    },
    {
      title: "默认房屋",
      dataIndex: "allName",
      key: "allName",
    },
    // {
    //   title: "有效",
    //   dataIndex: "enabledMark",
    //   key: "enabledMark",
    //   width: 100,
    //   render: (text: any, record, index) => {
    //     return (
    //       <Switch
    //         size="small"
    //         checked={text === ENABLEDMARKS.正常}
    //         checkedChildren={ENABLEDMARKS[ENABLEDMARKS.正常]}
    //         unCheckedChildren={ENABLEDMARKS[ENABLEDMARKS.禁用]}
    //         onClick={() => toggleDisabled(record)}
    //       />
    //     );
    //   }
    // }, 
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      align: 'center',
      width: 65,
      render: (text, record) => {
        return [ 
            <a onClick={() => doModify(record)} key="modify">编辑</a> 
        ];
      }
    }
  ] as ColumnProps<any>[];
  return (
    <Page>
      <Table
        style={{ border: "none" }}
        bordered={false}
        size="middle"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        scroll={{ y: 500 }}
        loading={loading}
        pagination={pagination}
        onChange={(pagination: PaginationConfig, filters, sorter) =>
          changePage(pagination, filters, sorter)
        }
      />
    </Page>
  );
}

export default ListTable;