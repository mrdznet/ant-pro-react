import { DefaultPagination } from '@/utils/defaultSetting';
import { Checkbox, Tabs, Button, Icon, Input, Layout, Select, DatePicker, message } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useState } from 'react';
import { NotChargeFeeData, ChargeFeePageData } from './Main.service';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
import ChargeListTable from './ChargeListTable';
import Modify from './Modify';
import Show from './Show';
import Vertify from './Vertify';
import Split from './Split';
import Transform from './Transform';
const { Content } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

function Main() {
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);
  // const [addFeeVisible, setAddFeeVisibleisible] = useState<boolean>(false);
  // const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  const [data, setData] = useState<any[]>([]);
  const [dataCharge, setChargeData] = useState<any[]>([]);
  const [paginationCharge, setPaginationCharge] = useState<PaginationConfig>(new DefaultPagination());

  const [id, setId] = useState<string>('');//当前费用Id
  const [organizeId, setOrganizeId] = useState<string>('');//左侧树选择的id
  const [adminOrgId, setAdminOrgId] = useState<string>('');//当前房间的管理处Id
  const [search, setSearch] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [showname, setShowname] = useState<string>('');
  const [addButtonDisable, setAddButtonDisable] = useState<boolean>(true);
  // const [showCustomerFee, setShowCustomerFee] = useState<boolean>(false)

  const [splitVisible, setSplitVisible] = useState<boolean>(false);
  const [transVisible, setTransVisible] = useState<boolean>(false);
  // const [billDetailVisible, setBillDetailVisible] = useState<boolean>(false);

  const [showVisible, setShowVisible] = useState<boolean>(false);
  const [vertifyVisible, setVertifyVisible] = useState<boolean>(false);
  const [ifVertify, setIfVertify] = useState<boolean>(false);

  // const [flushVisible, setflushVisible] = useState<boolean>(false);
  // const [chargeRowStatus, setChargeRowStatus] = useState<number>(0);
  // const [billRowKey, setBillRowKey] = useState<number>(0);

  const [unChargeSelectedKeys, setUnChargeSelectedKeys] = useState<any[]>([]);
  const [modifyEdit, setModifyEdit] = useState<boolean>(true);
  // const [organize, SetOrganize] = useState<any>({});
  const [chargedSearchParams, setChargedSearchParams] = useState<any>({});

  const selectTree = (id, search) => {
    initLoadData(search, id);
    //initChargeLoadData(id)
    //loadChargeData(id);
  };

  // useEffect(() => {
  //   //getTreeData().then(res => {
  //   //initLoadData('','');
  //   initChargeLoadData('');
  //   //});
  // }, []);

  const closeDrawer = () => {
    setModifyVisible(false);
  };

  const showDrawer = (id?, edit = true) => {
    setModifyEdit(edit);
    if (!edit) {
      if (unChargeSelectedKeys.length != 1) {
        message.warning("请选择一条记录查看！");
        return;
      }
      setModifyVisible(true);
      setId(unChargeSelectedKeys[0].id);
    }
    else {
      setModifyVisible(true);
      if (id) {
        setId(id);
      } else {
        setId('');
      }
    }
  };

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
      queryJson: { keyword: search, roomid: organizeId },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billDate';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billDate';
    data.sord = data.sord || 'desc';
    return NotChargeFeeData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setData(res.data);
      setLoading(false);
      return res;
    });
  };


  const initLoadData = (search, unitId = '', showCustomerFee = false) => {
    setSearch(search);
    // setShowCustomerFee(showCustomerFee);
    const queryJson = { keyword: search, unitId: unitId, showCustomerFee: showCustomerFee };
    const sidx = 'billDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  //已收款
  const loadChargeData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
        TreeType: "5",
        TreeTypeId: organizeId,
        Status: chargedSearchParams.status ? chargedSearchParams.status : '',
        StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
        EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : ''
      },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'billCode';
    }
    return loadCharge(searchCondition).then(res => {
      return res;
    });
  };

  const loadCharge = data => {
    setLoading(true);
    data.sidx = data.sidx || 'billCode';
    data.sord = data.sord || 'desc';
    return ChargeFeePageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPaginationCharge(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setChargeData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initChargeLoadData = (id) => {
    const queryJson = {
      keyword: chargedSearchParams.search ? chargedSearchParams.search : '',
      TreeType: "5",
      TreeTypeId: id,
      Status: chargedSearchParams.status ? chargedSearchParams.status : '',
      StartDate: chargedSearchParams.startDate ? chargedSearchParams.startDate : '',
      EndDate: chargedSearchParams.endDate ? chargedSearchParams.endDate : ''
    };
    const sidx = 'billCode';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = paginationCharge;
    return loadCharge({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(res => {
      return res;
    });
  };

  const onShowCustomerChange = (e: any) => {
    initLoadData(search, organizeId, e.target.checked);
  }

  const showVertify = (id: string, ifVertify: boolean) => {
    setId(id);
    setVertifyVisible(true);
    setIfVertify(ifVertify);
  }

  const closeVertify = () => {
    setVertifyVisible(false);
  }
  const [splitId, setSplitId] = useState<string>('');
  const showSplit = (id) => {
    console.log(id);
    setSplitId(id);
    setSplitVisible(true);
  }

  const closeSplit = () => {
    setSplitId('');
    setSplitVisible(false);
  }
  const [transId, setTransId] = useState<string>('');
  const showTrans = (id) => {
    setTransId(id);
    setTransVisible(true);
  }

  const closeTrans = () => {
    setTransId('');
    setTransVisible(false);
  }

  const showDetail = () => {
    setShowVisible(true);
  }

  const closeDetail = () => {
    setShowVisible(false);
  }

  // const onInvalid = () => {
  //   if (chargedRowSelectedKey == null || chargedRowSelectedKey == {}) {
  //     message.warning("请选择要作废的表单");
  //     return;
  //   }
  //   Modal.confirm({
  //     title: '请确认',
  //     content: `您是否要作废？`,
  //     onOk: () => {
  //       InvalidForm(chargedRowSelectedKey.billId).then(res => {
  //         initChargeLoadData(organizeId);
  //       });
  //     },
  //   });
  // }

  // const onRedFlush = () => {
  //   if (chargedRowSelectedKey == null || chargedRowSelectedKey == {}) {
  //     message.warning("请选择要冲红表单");
  //     return;
  //   }
  //   Modal.confirm({
  //     title: '请确认',
  //     content: `您是否要冲红？`,
  //     onOk: () => {
  //       CheckRedFlush(chargedRowSelectedKey.billId).then(res => {
  //         if (res == "1") {
  //           RedFlush(chargedRowSelectedKey.billId).then(res => {
  //             initChargeLoadData(organizeId);
  //           });
  //         } else {
  //           message.warning("当前表单无法冲红。");
  //         }
  //       })
  //     },
  //   });
  // }

  const GetUnChargeSelectedKeys = (rowSelectedKeys?) => {
    setUnChargeSelectedKeys(rowSelectedKeys);
    // console.log(rowSelectedKeys);
  }
  const [chargedRowSelectedKey, setChargedRowSelectedKey] = useState<any>({});
  const GetChargedSelectedKey = (record) => {
    setChargedRowSelectedKey(record);
  }

  //tab切换刷新数据
  const changeTab = (e: string) => {
    if (e === '1') { 
      if (organizeId)
        initLoadData(search, organizeId);
    } else {
      initChargeLoadData(organizeId);
    }
  };

  return (
    <Layout style={{ height: '100%' }}>
      {/* <Sider theme="light" style={{ overflow: 'hidden', height: '100%' }} width="245px"> */}
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, type, info?) => {
          setAdminOrgId(info.node.props.organizeId);//管理处Id
          setOrganizeId(id);
          // SetOrganize(info);
          if (type == 5) {
            setAddButtonDisable(false);
            var cusname = info.node.props.tenantname;
            setCustomerName(cusname);
            setShowname(info.node.props.allname + ' 当前住户 ' + cusname);
            //清空之前的收款信息 
            selectTree(id, search);
          }
        }}
      />
      {/* </Sider> */}
      <Content style={{ paddingLeft: '18px' }}>
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="未收列表" key="1" >
            <div style={{ marginBottom: '10px' }}>
              <Search
                className="search-input"
                placeholder="请输入要查询费项"
                style={{ width: 200 }}
                onSearch={value => loadData(value)} />
              <Checkbox style={{ marginLeft: '3px' }} onChange={onShowCustomerChange} >显示该户其他费用</Checkbox>
              {/* <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showTrans()}
                disabled={billRowKey == -1 ? true : false}  >
                <Icon type="minus-square" />
                转费
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showSplit()}
                disabled={billRowKey == -1 ? true : false}
              >
                <Icon type="minus-square" />
                拆费
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showDrawer('', false)}
                disabled={billRowKey == -1 ? true : false}
              >
                <Icon type="minus-square" />
                查看
              </Button> */}

              <span style={{ marginLeft: 8, color: "green" }}>
                已选择：{showname}
              </span>

              <Button type="primary" style={{ float: 'right' }}
                onClick={() => showDrawer()}
                disabled={addButtonDisable}
              >
                <Icon type="plus" />
                加费
              </Button>
              {/* <Button type="primary" style={{ float: 'right',marginLeft:'3px' }}
                onClick={() => showVertify('',false)}
              >
                <Icon type="minus-square" />
                刷新
              </Button> */}
            </div>

            <ListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadData(search, paginationConfig, sorter)
              }
              loading={loading}
              pagination={pagination}
              data={data}
              modify={showDrawer}
              reload={() => initLoadData(search, organizeId)}
              rowSelect={GetUnChargeSelectedKeys}
              organizeId={organizeId}
              customerName={customerName}
              showSplit={showSplit}
              showTrans={showTrans}
              showDetail={(billId) => { chargedRowSelectedKey.billId = billId; showDetail(); }}
            />
          </TabPane>
          <TabPane tab="收款单列表" key="2">
            <div style={{ marginBottom: '10px' }}>
              <Select placeholder="=请选择="
                allowClear={true}
                style={{ width: '120px', marginRight: '5px' }} onChange={(value) => {
                  var params = Object.assign({}, chargedSearchParams, { status: value });
                  setChargedSearchParams(params);
                }} >
                <Option key='2' value='2'>
                  {'已审核'}
                </Option>
                <Option key='1' value='1'>
                  {'未审核'}
                </Option>
                <Option key='3' value='3'>
                  {'已冲红'}
                </Option>
                <Option key='-1' value='-1'>
                  {'已作废'}
                </Option>
              </Select>
              <DatePicker
                placeholder='收款日期'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { startDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginRight: '5px' }} />
              至
              <DatePicker
                placeholder='收款日期'
                onChange={(date, dateStr) => {
                  var params = Object.assign({}, chargedSearchParams, { endDate: dateStr });
                  setChargedSearchParams(params);
                }} style={{ marginLeft: '5px', marginRight: '5px' }} />
              <Search
                className="search-input"
                placeholder="请输入收款单号"
                style={{ width: 200 }}
                onChange={e => {
                  var params = Object.assign({}, chargedSearchParams, { search: e.target.value });
                  setChargedSearchParams(params);
                }}
              />
              <Button type="primary" style={{ marginLeft: '3px' }}
                onClick={() => {
                  initChargeLoadData(organizeId);
                }}
              >
                <Icon type="search" />
                搜索
              </Button>

              {/* <Button type="danger" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => onInvalid()}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 2 || chargedRowSelectedKey.status == 3 || chargedRowSelectedKey.status == -1 || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="delete" />
                作废
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => onRedFlush()}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 3 || chargedRowSelectedKey.status == 1 || chargedRowSelectedKey.status == -1 || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="form" />
                冲红
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showVertify('', false)}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 3 || chargedRowSelectedKey.status == -1 || chargedRowSelectedKey.status == 1 || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="minus-square" />
                反审
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showVertify('', true)}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 3 || chargedRowSelectedKey.status == -1 || chargedRowSelectedKey.status == 2 || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="check-square" />
                审核
              </Button>
              <Button type="default" style={{ float: 'right', marginLeft: '3px' }}
                onClick={() => showDetail()}
                disabled={chargedRowSelectedKey.status == null || chargedRowSelectedKey.status == 0 ? true : false}
              >
                <Icon type="file" />
                查看
              </Button> */}
            </div>

            <ChargeListTable
              onchange={(paginationConfig, filters, sorter) =>
                loadChargeData(paginationConfig, sorter)
              }
              loading={loading}
              pagination={paginationCharge}
              data={dataCharge}
              showDetail={showDetail}
              showVertify={showVertify}
              reload={() => initChargeLoadData(organizeId)}
              getRowSelect={GetChargedSelectedKey}
            />
          </TabPane>
        </Tabs>
      </Content>
      <Modify
        modifyVisible={modifyVisible}
        closeDrawer={closeDrawer}
        id={id}
        organizeId={organizeId}
        adminOrgId={adminOrgId}
        reload={() => initLoadData(search, organizeId)}
        edit={modifyEdit}
      />
      <Show
        showVisible={showVisible}
        closeShow={closeDetail}
        id={chargedRowSelectedKey.billId}
      />
      <Vertify
        vertifyVisible={vertifyVisible}
        closeVertify={closeVertify}
        id={chargedRowSelectedKey.billId}
        ifVertify={ifVertify}
        reload={() => initChargeLoadData(organizeId)}
      />
      <Split
        splitVisible={splitVisible}
        closeSplit={closeSplit}
        id={splitId}
        reload={() => initLoadData(search, organizeId)}
      />
      <Transform
        transVisible={transVisible}
        closeTrans={closeTrans}
        id={transId}
        reload={() => initLoadData(search, organizeId)}
      />
    </Layout>
  );
}
export default Main;
