//水电费管理
import { DefaultPagination } from '@/utils/defaultSetting';
import { Tabs, Button, Icon, Input, Layout, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetMeterPageList, GetUnitMeterPageList, GetReadingMeterPageList, GetMeterFormsPageList } from './Meter.service';
import AsynLeftTree from '../AsynLeftTree';
import MeterTable from './MeterTable';
import MeterFormsTable from './MeterFormsTable';
import ReadingMeterTable from './ReadingMeterTable';
import UnitMeterTable from './UnitMeterTable';
import MeterModify from './MeterModify';
import ReadingMeterModify from './ReadingMeterModify';
import ReadingMeterVertify from './ReadingMeterVertify';
import { GetUnitTreeAll } from '@/services/commonItem';//获取全部房间树
import { getResult } from '@/utils/networkUtils';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
function Meter() {
  const [organize, SetOrganize] = useState<any>({});
  // const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();

  const [readingMeterId, setReadingMeterId] = useState<string>();

  const [meterLoading, setMeterLoading] = useState<boolean>(false);
  const [meterFormsLoading, setMeterFormsLoading] = useState<boolean>(false);
  const [readingMeterLoading, setReadingMeterLoading] = useState<boolean>(false);
  const [unitMeterLoading, setUnitMeterLoading] = useState<boolean>(false);

  const [meterData, setMeterData] = useState<any>();
  const [unitMeterData, setUnitMeterData] = useState<any>();
  const [readingMeterData, setReadingMeterData] = useState<any>();
  const [meterFormsData, setMeterFormsData] = useState<any>();

  const [meterSearch, setMeterSearch] = useState<string>('');
  const [unitMeterSearch, setUnitMeterSearch] = useState<string>('');
  const [readingMeterSearch, setReadingMeterSearch] = useState<string>('');
  const [meterFormsSearch, setMeterFormsSearch] = useState<string>('');

  const [meterPagination, setMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [unitMeterPagination, setUnitMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [readingMeterPagination, setReadingMeterPagination] = useState<DefaultPagination>(new DefaultPagination());
  const [meterFormsPagination, setMeterFormsPagination] = useState<DefaultPagination>(new DefaultPagination());

  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);

  // const [meterKinds, setMeterKinds] = useState<any>([]);
  // const [meterTypes, setMeterTypes] = useState<any>([]);

  const [ifVertify, setIfVertify] = useState<boolean>(false);
  const [vertifyVisible, setVertifyVisible] = useState<boolean>(false);
  const selectTree = (org, item, searchText) => {
    SetOrganize(item);

    initMeterLoadData(item, '');
    initReadingMeterLoadData(item, '');
    initMeterFormsLoadData(item, '');
    initUnitMeterLoadData(item, '');
  };

  // let meterKind = [];
  // let meterType = [];

  useEffect(() => {

    //获取房产树
    GetUnitTreeAll()
      .then(getResult)
      .then((res: any[]) => {
        setUnitTreeData(res || []);
        return res || [];
      });

    //获取费表类型
    // GetDataItemTreeJson('EnergyMeterKind').then(res => {
    //   setMeterKinds(res);
    //   meterKind = res;
    //   return;
    // }).then(() => {
    //   //获取费表种类
    //   return GetDataItemTreeJson('EnergyMeterType')
    // }).then(res => {
    //   setMeterTypes(res);
    //   meterType = res;
    //   return;
    // }).then(() => {
    initMeterLoadData('', '');
    initUnitMeterLoadData('', '');
    initMeterFormsLoadData('', '');
    initReadingMeterLoadData('', '')
    // })
  }, []);


  const loadMeterData = (paginationConfig?: PaginationConfig, sorter?) => {
    //setMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: meterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: meterSearchParams.search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'meterkind';
    }

    return meterload(searchCondition);
  }
  const loadUnitMeterData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setUnitMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: unitMeterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'unitmeterid';
    }
    return unitMeterload(searchCondition);
  };

  const loadReadingMeterData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setReadingMeterSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: readingMeterPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      // queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billcode';
    }

    return readingMeterload(searchCondition);
  }
  const loadMeterFormsData = (search, paginationConfig?: PaginationConfig, sorter?) => {
    setMeterFormsSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: meterFormsPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { keyword: search }
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.order = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billcode';
    }

    return meterFormsload(searchCondition);
  }
  const meterload = data => {
    setMeterLoading(true);
    data.sidx = data.sidx || 'meterkind';
    data.sord = data.sord || 'asc';

    //获取费表类型
    // GetDataItemTreeJson('EnergyMeterKind').then(res => {
    //   setMeterKinds(res);
    //   meterKind = res;
    //   return;
    // }).then(() => {
    //   //获取费表种类
    //   return GetDataItemTreeJson('EnergyMeterType')
    // }).then(res => {
    //   setMeterTypes(res);
    //   meterType = res;
    //   return;
    // }).then(() => {
    return GetMeterPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      /*var newData=[];
      res.data.map(item=>{
        var meterkindname="";
        var metertypename="";

        meterKind.map(i=>{
          if(item.meterkind==i.key){
            meterkindname=i.title;
          }
        });
        meterType.map(i=>{
          if(item.metertype==i.key){
            metertypename=i.title;
          }
        });
        var d=Object.assign({},item,{meterkindname,metertypename});
        newData.push(d);
      })
      console.log(newData);*/
      setMeterData(res.data);
      setMeterLoading(false);
      return res;
    });
    // }); 
  };


  const unitMeterload = data => {
    setUnitMeterLoading(true);
    data.sidx = data.sidx || 'unitmeterid';
    data.sord = data.sord || 'asc';
    //获取费表类型
    // GetDataItemTreeJson('EnergyMeterKind').then(res => {
    //   setMeterKinds(res);
    //   meterKind = res;
    //   return;
    // }).then(() => {
    //   //获取费表种类
    //   return GetDataItemTreeJson('EnergyMeterType')
    // }).then(res => {
    //   setMeterTypes(res);
    //   meterType = res;
    //   return;
    // }).then(() => {
    return GetUnitMeterPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setUnitMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });

      /*var newData=[];
      res.data.map(item=>{
        var meterkindname="";
        var metertypename="";
        meterKind.map(i=>{
          if(item.meterkind==i.key){
            meterkindname=i.title;
          }
        });
        meterType.map(i=>{
          if(item.metertype==i.key){
            metertypename=i.title;
          }
        });
        var d=Object.assign({},item,{meterkindname,metertypename});
        newData.push(d);
      })*/
      // console.log(meterKind,meterType,newData);
      setUnitMeterData(res.data);
      setUnitMeterLoading(false);
      return res;
    });
    // });
  };

  const readingMeterload = data => {
    setReadingMeterLoading(true);
    data.sidx = data.sidx || 'billcode';
    data.sord = data.sord || 'asc';
    return GetReadingMeterPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setReadingMeterPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setReadingMeterData(res.data);
      setReadingMeterLoading(false);
      return res;
    });
  };
  const meterFormsload = data => {
    setMeterFormsLoading(true);
    data.sidx = data.sidx || 'billcode';
    data.sord = data.sord || 'asc';
    return GetMeterFormsPageList(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setMeterFormsPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setMeterFormsData(res.data);
      setMeterFormsLoading(false);
      return res;
    });
  };

  const initMeterLoadData = (org, searchText) => {
    setMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'meterkind';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = meterPagination;
    //setAddButtonDisable(true);
    return meterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };
  const initUnitMeterLoadData = (org, searchText) => {
    setUnitMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'unitmeterid';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = unitMeterPagination;
    //setAddButtonDisable(true);
    return unitMeterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };
  const initReadingMeterLoadData = (org, searchText) => {
    setReadingMeterSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = readingMeterPagination;
    //setAddButtonDisable(true);
    return readingMeterload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };
  const initMeterFormsLoadData = (org, searchText) => {
    setMeterFormsSearch(searchText);
    const queryJson = {
      OrganizeId: org.organizeId,
      keyword: searchText,
      TreeTypeId: org.id,
      TreeType: org.type,
    };
    const sidx = 'billcode';
    const sord = 'asc';
    const { current: pageIndex, pageSize, total } = meterFormsPagination;
    //setAddButtonDisable(true);
    return meterFormsload({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  const closeVertify = (result?) => {
    setVertifyVisible(false);
    if (result) {
      loadReadingMeterData(organize);
    }
    setId('');
  };

  const showVertify = (id?, ifVertify?) => {
    setVertifyVisible(true);
    setIfVertify(ifVertify);
    setId(id);
  };

  const closeModify = (result?) => {
    setModifyVisible(false);
    if (result) {
      //initCheckLoadData(organize, null);
    }
  };
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  const [modifyReadingMeterVisible, setModifyReadingMeterVisible] = useState<boolean>(false);
  const showReadingMeterModify = (id?) => {
    setModifyReadingMeterVisible(true);
    setReadingMeterId(id);
  }
  const closeReadingMeterModify = (result?) => {
    setModifyReadingMeterVisible(false);
    setReadingMeterId('');
    if (result) {
      initReadingMeterLoadData(organize.id, '');
    }
  }
  const showModify = (id?) => {
    setModifyVisible(true);
    setId(id);
  };
  //删除冲抵单
  // const deleteData = (id?) => {
  //   Modal.confirm({
  //     title: '是否确认删除该条抵冲记录?',
  //     onOk() {
  //       RemoveForm({
  //         keyValue: id
  //       }).then(res => {

  //       });
  //     },
  //     onCancel() { },
  //   });
  // }


  //页签切换刷新
  const changeTab = key => {
    if (key == "1") {
      initMeterLoadData('', meterSearch);
    } else if (key == "2") {
      initUnitMeterLoadData('', unitMeterSearch);
    } else if (key == "3") {
      initReadingMeterLoadData('', readingMeterSearch);
    } else {
      initMeterFormsLoadData('', meterFormsSearch);
    }
  };

  const [meterSearchParams, setMeterSearchParams] = useState<any>({});
  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, item) => {
          selectTree(id, item, '');
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="费表列表" key="1">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }} onChange={(value) => {
              var params = Object.assign({}, meterSearchParams, { metertype: value });
              setMeterSearchParams(params);
            }}>
              <Select placeholder="=请选择=" style={{ width: '120px', marginRight: '5px' }} onChange={value => {
                var params = Object.assign({}, meterSearchParams, { meterkind: value });
                setMeterSearchParams(params);
              }}>
                <Option value="private">单元表</Option>
                <Option value="public" >公用表</Option>
                <Option value="virtual">虚拟表</Option>
              </Select>
              <Search
                className="search-input"
                placeholder="请输入要查询的费表名称"
                style={{ width: 200 }}
                onChange={e => {
                  var params = Object.assign({}, meterSearchParams, { search: e.target.value });
                  setMeterSearchParams(params);
                }}
              />
              <Button type="primary" style={{ marginLeft: '10px' }}
                onClick={() => { loadMeterData() }}
              >
                <Icon type="search" />
                查询
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { showModify(null) }}
              >
                <Icon type="plus" />
                新增
              </Button>
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}
              >
                <Icon type="reload" />
                刷新
              </Button> */}
            </div>
            <MeterTable
              onchange={(paginationConfig, filters, sorter) => {
                loadMeterData(paginationConfig, sorter)
              }
              }
              loading={meterLoading}
              pagination={meterPagination}
              data={meterData}
              showModify={(id) => {
                setId(id);
                setModifyVisible(true);
              }}
              reload={() => initMeterLoadData('', meterSearch)}
            />
          </TabPane>
          <TabPane tab="装表列表" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的名称或者编号"
                style={{ width: 280 }}
                onSearch={value => loadUnitMeterData(value)}
              />
            </div>
            <UnitMeterTable
              onchange={(paginationConfig, filters, sorter) =>
                loadUnitMeterData(unitMeterSearch, paginationConfig, sorter)
              }
              loading={unitMeterLoading}
              pagination={unitMeterPagination}
              data={unitMeterData}
              reload={() => initUnitMeterLoadData('', unitMeterSearch)}
            />
          </TabPane>
          <TabPane tab="抄表单列表" key="3">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 280 }}
                onSearch={value => loadReadingMeterData(value)}
              />
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { }} disabled={ifVertify ? false : true}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (readingMeterId == null || readingMeterId == '') {
                    message.warning('请先选择抄表单');
                  } else {
                    showVertify(true);
                  }
                }}
                disabled={!ifVertify ? false : true}
              >
                <Icon type="check-square" />
                审核
              </Button> */}
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  showReadingMeterModify();
                }}
              >
                <Icon type="plus" />
                新增
              </Button>
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                }} >
                <Icon type="reload" />
                刷新
              </Button> */}
            </div>
            <ReadingMeterTable
              onchange={(paginationConfig, filters, sorter) =>
                loadReadingMeterData(readingMeterSearch, paginationConfig, sorter)
              }
              loading={readingMeterLoading}
              showVertify={showVertify}
              pagination={readingMeterPagination}
              data={readingMeterData}
              reload={() => initReadingMeterLoadData('', readingMeterSearch)}
              showModify={(id?) => {
                setModifyReadingMeterVisible(true);
                if (id != null && id != '') {
                  setReadingMeterId(id);
                }
              }}
              getRowSelect={(record) => {
                setReadingMeterId(record.billId);
                if (record.ifverify == 1) {
                  setIfVertify(true);
                } else {
                  setIfVertify(false);
                }
              }}
            />
          </TabPane>
          <TabPane tab="抄表列表" key="4">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询的单号"
                style={{ width: 280 }}
                onSearch={value => loadUnitMeterData(value)}
              />
            </div>

            <MeterFormsTable
              onchange={(paginationConfig, filters, sorter) => {
                loadMeterFormsData(meterFormsSearch, paginationConfig, sorter)
              }
              }
              loading={meterFormsLoading}
              pagination={meterFormsPagination}
              data={meterFormsData}
              reload={() => initMeterFormsLoadData('', meterFormsSearch)}
            />
          </TabPane>
        </Tabs>
      </Content>
      <MeterModify
        modifyVisible={modifyVisible}
        closeDrawer={closeModify}
        organizeId={organize}
        id={id}
        treeData={unitTreeData}
        reload={() => loadMeterData()}
      />
      <ReadingMeterModify
        modifyVisible={modifyReadingMeterVisible}
        closeDrawer={closeReadingMeterModify}
        organizeId={organize}
        id={readingMeterId}
        reload={() => loadReadingMeterData('')}
      />
      <ReadingMeterVertify
        vertifyVisible={vertifyVisible}
        closeVertify={closeVertify}
        ifVertify={ifVertify}
        id={readingMeterId}
        reload={() => loadReadingMeterData('')}
      />
    </Layout>
  );
}

export default Meter;
