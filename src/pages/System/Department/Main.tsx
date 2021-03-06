
import { Button, Icon,  Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import ListTable from './ListTable';
import { GetTreeListJson } from './Main.service';
import Modify from './Modify';

const { Content } = Layout;
// const { Search } = Input;

function Main() {
  const [search, setSearch] = useState<string>('');
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [currData, setCurrData] = useState<any>(); 

  useEffect(() => {
    initLoadData({ searchText: '' });
  }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };
  const showDrawer = (item?) => {

    setCurrData(item);
    setModifyVisible(true);
  };
  const loadData = ({ searchText }, sorter?) => {
    setSearch(searchText);
    let queryJson: any = { keyword: searchText };
    const searchCondition: any = {
      queryJson
    };

    if (sorter) {
      const { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'enCode';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || 'enCode';
    formData.sord = formData.sord || 'asc';
    return GetTreeListJson(formData).then(res => {
      setData(res);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = ({ searchText }) => {
    let queryJson: any = { keyword: searchText };
    const sidx = 'enCode';
    const sord = 'asc';
    return load({ sidx, sord, queryJson }).then(res => {
      return res;
    });
  };
 

  return (
    <Layout style={{ height: '100%' }}>
      <Content  >
        <div style={{ marginBottom: '40px', padding: '3px 0' }}>
          {/* <Search
            className="search-input"
            placeholder="请输入要查询的关键词"
            onSearch={value =>
              loadData({ searchText: value })
            }
            style={{ width: 200 }}
          /> */}
          <Button type="primary" 
            style={{ float: 'right' }}
            onClick={() => showDrawer()}>
            <Icon type="plus" />
            部门
          </Button>
        </div>
        <ListTable
          onchange={(sorter) =>
            loadData(
              { searchText: search },
              sorter
            )
          }
          loading={loading}
          data={data}
          modify={showDrawer}
          reload={() =>
            initLoadData({ searchText: search })
          }
        />
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeDrawer}
        data={currData}
        reload={() =>
          initLoadData({ searchText: search })
        }
      />
    </Layout>
  );
}

export default Main;
