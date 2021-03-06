//通知单
import { DefaultPagination } from '@/utils/defaultSetting';
import { DatePicker, message, Dropdown, Menu, Button, Icon, Input, Layout, Modal, Select } from 'antd';
import { PaginationConfig } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { GetBillPageData, BatchRemoveForm, GetNoticeTemplates, BatchAudit, BatchPrint } from './Main.service';
import AsynLeftTree from '../AsynLeftTree';
import ListTable from './ListTable';
// import DetailTable from './DetailTable';
import Modify from './Modify';
import Verify from './Verify';
import Show from './Show';
import { getResult } from '@/utils/networkUtils';
import { GetUnitTreeAll } from '@/services/commonItem';//获取全部房间树
const { MonthPicker } = DatePicker;
const { Content } = Layout;
const { Search } = Input;
// const { TabPane } = Tabs;
// const { Option } = Select;
import AuthButton from '@/components/AuthButton/AuthButton';

function Main() {
  // const [organize, SetOrganize] = useState<any>({});
  // const [treeSearch, SetTreeSearch] = useState<any>({});
  const [id, setId] = useState<string>();
  // const [selectRecords, setSelectRecords] = useState<any>();
  const [selectIds, setSelectIds] = useState<any>();
  // const [billCheckSearch, setBillCheckSearch] = useState<string>(''); 
  const [billCheckPagination, setBillCheckPagination] = useState<DefaultPagination>(new DefaultPagination());
  // const [billNoticeSearch, setBillNoticeSearch] = useState<string>('');
  // const [billNoticePagination, setBillNoticePagination] = useState<DefaultPagination>(new DefaultPagination());
  const [ifVerify, setIfVerify] = useState<boolean>(false);
  const [verifyVisible, setVerifyVisible] = useState<boolean>(false);
  const [showCheckBillVisible, setShowCheckBillVisible] = useState<boolean>(false);
  const [tempListData, setTempListData] = useState<any[]>([]);
  const [unitTreeData, setUnitTreeData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  //树查询
  const [orgId, setOrgId] = useState<string>('');//左侧树选择的id
  const [orgType, setOrgType] = useState<string>();//类型 
  const [noticeData, setNoticeData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  // const [detailData, setDetailData] = useState<any[]>([]);
  // const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const doSelectTree = (id, type, info) => {
    // SetOrganize(info.node.props.dataRef);
    // initBillCheckLoadData(info.node.props.dataRef, billCheckSearch);
    // initBillNoticeLoadData(info.node.props.dataRef, billNoticeSearch); 
    //初始化页码，防止页码错乱导致数据查询出错  
    const page = new DefaultPagination();
    loadData(search, id, type, page);
    //loadDetailData(billNoticeSearch, id, type, page);
  };

  useEffect(() => {
    //获取房产树
    GetUnitTreeAll()
      .then(getResult)
      .then((res: any[]) => {
        setUnitTreeData(res || []);
        return res || [];
      });

    GetNoticeTemplates().then(res => {
      setTempListData(res);
    }).then(() => {
      initLoadData('', '', '');
      //initDetailLoadData('', '', '');
    })
  }, []);

  const loadData = (search, orgId, type, paginationConfig?: PaginationConfig, sorter?) => {
    // setBillCheckSearch(search);
    //赋值,必须，否则查询条件会不起作用
    setSearch(search);
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: billCheckPagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: {
        keyword: search,//billCheckSearchParams.search,
        TemplateId: templateId,
        // BillType: billType,
        TreeTypeId: orgId,//organize.id,
        TreeType: type,//organize.type,
        BelongDate: belongDate
      }
    };

    debugger

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === 'ascend' ? 'asc' : 'desc';
      searchCondition.sidx = field ? field : 'createDate';
    }
    return load(searchCondition);
  }

  const load = data => {
    setLoading(true);
    data.sidx = data.sidx || 'createDate';
    data.sord = data.sord || 'desc';
    return GetBillPageData(data).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setBillCheckPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize,
        };
      });
      setNoticeData(res.data);
      setLoading(false);
      return res;
    }).catch(err => {
      setLoading(false);
    });
  };

  const initLoadData = (orgId, type, searchText) => {
    //console.log(org);
    // setBillCheckSearch(searchText);
    setSearch(searchText);
    const queryJson = {
      TemplateId: templateId,
      // BillType: billType,
      keyword: searchText,
      TreeTypeId: orgId,//org.key,
      TreeType: type,//org.type,
      BelongDate: belongDate
    };
    const sidx = 'createDate';
    const sord = 'desc';
    const { current: pageIndex, pageSize, total } = billCheckPagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson });
  };

  // const loadDetailData = (search, orgId, type, paginationConfig?: PaginationConfig, sorter?) => {
  //   setBillNoticeSearch(search);
  //   const { current: pageIndex, pageSize, total } = paginationConfig || {
  //     current: 1,
  //     pageSize: billNoticePagination.pageSize,
  //     total: 0,
  //   };
  //   let searchCondition: any = {
  //     pageIndex,
  //     pageSize,
  //     total,
  //     queryJson: {
  //       keyword: search,
  //       TreeTypeId: orgId,//organize.id,
  //       TreeType: type,//organize.type
  //     }
  //   };
  //   if (sorter) {
  //     let { field, order } = sorter;
  //     searchCondition.sord = order === "descend" ? "desc" : "asc";
  //     searchCondition.sidx = field ? field : 'id';
  //   }
  //   return detailLoad(searchCondition);
  // };

  // const detailLoad = data => {
  //   setDetailLoading(true);
  //   data.sidx = data.sidx || 'id';
  //   data.sord = data.sord || 'asc';
  //   return GetBillDetailPageData(data).then(res => {
  //     const { pageIndex: current, total, pageSize } = res;
  //     setBillNoticePagination(pagesetting => {
  //       return {
  //         ...pagesetting,
  //         current,
  //         total,
  //         pageSize,
  //       };
  //     });
  //     setDetailData(res.data);
  //     setDetailLoading(false);
  //     return res;
  //   }).catch(err => {
  //     setDetailLoading(false);
  //   });
  // };

  // const initDetailLoadData = (orgId, type, searchText) => {
  //   setBillNoticeSearch(searchText);
  //   const queryJson = {
  //     keyword: searchText,
  //     TreeTypeId: orgId,//org.key,
  //     TreeType: type,// org.type,
  //   };
  //   const sidx = 'id';
  //   const sord = 'asc';
  //   const { current: pageIndex, pageSize, total } = billNoticePagination;
  //   return detailLoad({ pageIndex, pageSize, sidx, sord, total, queryJson });
  // };

  const closeVerify = (result?) => {
    setVerifyVisible(false);
    if (result) {
      loadData(search, orgId, orgType);
    }
    setId('');
  };

  const showVerify = (id?, ifVerify?) => {
    setVerifyVisible(true);
    setIfVerify(ifVerify);
    if (id != null && id != '')
      setId(id);
  };

  const closeModify = (result?) => {
    setModifyVisible(false);
    if (result) {
      //initCheckLoadData(organize, null);
    }
  };
  const [modifyVisible, setModifyVisible] = useState<boolean>(false);

  const showModify = (id?, isedit?) => {
    // setIsEdit(isedit);
    setModifyVisible(true);
    setId(id);
  };

  // const deleteData = (id?) => {
  //   Modal.confirm({
  //     title: '是否确认删除该记录?',
  //     onOk() {
  //       RemoveForm({
  //         keyvalue: id
  //       }).then(res => {
  //       });
  //     },
  //     onCancel() { },
  //   });
  // };

  // const [billCheckSearchParams, setBillCheckSearchParams] = useState<any>({});
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  // const [divideVisible,setDivideVisible]=useState<boolean>(false);

  const [templateId, setTemplateId] = useState<string>('');
  // const [billType, setBillType] = useState<string>('');
  const [belongDate, setBelongDate] = useState<any>('');

  const handleMenuClick = (e) => {
    if (e.key == '1') {
      if (selectIds == undefined) {
        message.error('请选择需要审核的账单');
        return;
      } else {
        //如果选择了多条 在批量审核
        if (selectIds && selectIds.length > 1) {
          Modal.confirm({
            title: '请确认',
            content: `您是否要审核这些账单?`,
            onOk: () => {
              setLoading(true);
              BatchAudit({
                keyValues: JSON.stringify(selectIds),
                IfVerify: true
              })
                .then(() => {
                  setLoading(false);
                  message.success('审核成功');
                  initLoadData(orgId, orgType, search);
                })
                .catch(e => { setLoading(false); });
            },
          });
        }
        //如果仅选择一条 则显示账单
        else {
          showVerify(selectIds[0], true);
        }
      }
    }
    else if (e.key == '2') {
      // if (selectIds && selectIds.length > 1) {
      if (selectIds == undefined) {
        message.error('请选择需要反审的账单！');
        return;
      }
      else {
        if (selectIds && selectIds.length > 1) {
          Modal.confirm({
            title: '请确认',
            content: `您是否要反审这些账单?`,
            onOk: () => {
              setLoading(true);
              BatchAudit({
                keyValues: JSON.stringify(selectIds),
                IfVerify: false
              })
                .then(() => {
                  setLoading(false);
                  message.success('反审成功');
                  initLoadData(orgId, orgType, search);
                }).catch(e => { setLoading(false); });
            },
          });
        } else {
          showVerify(id, false);
        }
      }
    } else if (e.key == '3') {

      // if (billType == '') {
      //   message.error('请选择账单类型！');
      //   return;
      // }

      if (templateId == '') {
        message.error('请选择模板类型！');
        return;
      }

      //批量打印 
      if (selectIds == undefined) {
        message.error('请选择需要打印的账单！');
        return;
      } else {
        setLoading(true);
        BatchPrint({
          keyValues: JSON.stringify(selectIds),
          templateId: templateId
        }).then(res => {
          //window.location.href = res;
          window.open(res);
          //setLoading(false);
        }).finally(() => {
          setLoading(false);
        });
      }
    }
    else {
      //删除
      if (selectIds == undefined) {
        message.error('请选择需要删除的账单！');
        return;
      } else {
        Modal.confirm({
          title: '是否确认删除?',
          onOk() {
            setLoading(true);
            BatchRemoveForm({
              keyValues: JSON.stringify(selectIds)
            }).then(res => {
              setLoading(false);
              message.success('删除成功');
              initLoadData(orgId, orgType, search);
            }).catch(e => { setLoading(false); });
          },
          onCancel() { },
        });
      }
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">审核</Menu.Item>
      <Menu.Item key="2">反审</Menu.Item>
      <Menu.Item key="3">打印</Menu.Item>
      <Menu.Item key="4">删除</Menu.Item>
    </Menu>
  );

  //tab切换刷新数据
  // const changeTab = (e: string) => {
  //   if (e === '1') {
  //     loadData(search, orgId, orgType);
  //   } else {
  //     loadDetailData(billNoticeSearch, orgId, orgType);
  //   }
  // };

  return (
    <Layout>
      <AsynLeftTree
        parentid={'0'}
        selectTree={(id, type, info) => {
          setOrgId(id);
          setOrgType(type);
          doSelectTree(id, type, info);
        }}
      />
      <Content style={{ paddingLeft: '18px' }}>
        {/* <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="账单列表" key="1"> */}
        {/* <div style={{ marginBottom: '20px', padding: '3px 2px' }}
              onChange={(value) => {
                var params = Object.assign({}, billCheckSearchParams, { billChecktype: value });
                setBillCheckSearchParams(params);
              }}> */}
        <div style={{ marginBottom: '10px' }}>
          {/* <Select placeholder="账单类型" style={{ width: '120px', marginRight: '5px' }}
            onChange={(value: string) => {
              setBillType(value);
            }}>
            <Select.Option value="通知单">通知单</Select.Option>
            <Select.Option value="催款单">催款单</Select.Option>
            <Select.Option value="催缴函">催缴函</Select.Option>
            <Select.Option value="律师函">律师函</Select.Option>
          </Select> */}
          <Select placeholder="模版类型" style={{ width: '150px', marginRight: '5px' }}
            onChange={(value: string) => {
              setTemplateId(value);
            }}
          >
            {
              (tempListData || []).map(item => {
                return <Select.Option value={item.value}>{item.title}</Select.Option>
              })
            }
          </Select>

          <MonthPicker placeholder="账单归属年月"
            style={{ width: '140px', marginRight: '5px' }}
            onChange={(date, dateString) => {
              debugger
              setBelongDate(dateString);
            }}
          />

          <Search
            className="search-input"
            placeholder="搜索单号"
            style={{ width: 200 }}
            onChange={e => {
              // var params = Object.assign({}, billCheckSearchParams, { search: e.target.value });
              // setBillCheckSearchParams(params);
              setSearch(e.target.value);
            }}
          />

          {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (selectIds.length > 1) {
                    Modal.confirm({
                      title: '请确认',
                      content: `您是否要取消审核这些账单?`,
                      onOk: () => {
                        BatchAudit({
                          keyValues: JSON.stringify(selectIds),
                          IfVerify: false
                        })
                          .then(() => {
                            message.success('审核成功');
                            initBillCheckLoadData('', '');
                          })
                          .catch(e => { });
                      },
                    });
                  } else {
                    if (id == null || id == '') {
                      message.warning('请先选择账单');
                    } else {
                      showVerify('', false);
                    }
                  }
                }} disabled={ifVerify ? false : true}
              >
                <Icon type="minus-square" />
                取消审核
              </Button>
              <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {
                  if (selectIds.length > 1) {
                    Modal.confirm({
                      title: '请确认',
                      content: `您是否要审核这些账单?`,
                      onOk: () => {
                        BatchAudit({
                          keyValues: JSON.stringify(selectIds),
                          IfVerify: true
                        })
                          .then(() => {
                            message.success('审核成功');
                            initBillCheckLoadData('', '');
                          })
                          .catch(e => { });
                      },
                    });
                  } else {
                    if (id == null || id == '') {
                      message.warning('请先选择账单');
                    } else {
                      showVerify('', true);
                    }
                  }
                }}
                disabled={ifVerify ? true : false}>
                <Icon type="check-square" />
                审核
              </Button> */}

          <Button type="primary" style={{ marginLeft: '10px' }}
            onClick={() => { loadData(search, orgId, orgType) }}
          >
            <Icon type="search" />
                查询
              </Button>

          <Dropdown overlay={menu}  >
            <Button style={{ float: 'right', marginLeft: '10px' }}>
              更多<Icon type="down" />
            </Button>
          </Dropdown>

          {/* <Button type="primary" style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => { showModify(null, true) }}
              >
                <Icon type="plus" />
                新增
              </Button> */}


          <AuthButton
            style={{ float: 'right', marginLeft: '10px' }}
            onClick={() => showModify(null, true)}
            module="Billnotice"
            code="add"
            btype="primary">
            <Icon type="plus" />
                新增
               </AuthButton>

        </div>

        <ListTable
          onchange={(paginationConfig, filters, sorter) => {
            loadData(search, orgId, orgType, paginationConfig, sorter)
          }}
          loading={loading}
          pagination={billCheckPagination}
          data={noticeData}
          showCheckBill={(id) => {
            if (id != null && id != '') {
              setId(id);
            }
            setShowCheckBillVisible(true);
          }}
          reload={() => initLoadData(orgId, orgType, search)}
          getRowSelect={(records) => {
            // setSelectRecords(records);
            if (records.length == 1) {
              setId(records[0].billId);
              if (records[0].ifVerify == 1) {
                setIfVerify(true);
              } else {
                setIfVerify(false);
              }
            }
            var recordList: Array<string> = [];
            records.forEach(record => {
              recordList.push(record.billId)
            })
            setSelectIds(recordList);
          }}
        />

        {/* </TabPane>
          <TabPane tab="账单明细" key="2">
            <div style={{ marginBottom: '20px', padding: '3px 2px' }}>
              <Search
                className="search-input"
                placeholder="搜索单号"
                style={{ width: 200 }}
                onSearch={value => loadDetailData(value, orgId, orgType)}
              />
            </div>
            <DetailTable
              showModify={(id) => {
                setId(id);
              }}
              onchange={(paginationConfig, filters, sorter) =>
                loadDetailData(billNoticeSearch, orgId, orgType, paginationConfig, sorter)
              }
              loading={detailLoading}
              pagination={billNoticePagination}
              data={detailData}
              reload={() => initDetailLoadData(orgId, orgType, billNoticeSearch)}
              getRowSelect={(record) => {
                setId(record.billId);
                if (record.ifVerify == 1) {
                  setIfVerify(true);
                } else {
                  setIfVerify(false);
                }
              }}
            />
          </TabPane>
        </Tabs> */}
      </Content>
      <Modify
        visible={modifyVisible}
        closeDrawer={closeModify}
        id={id}
        treeData={unitTreeData}
        isEdit={true}
        reload={() => initLoadData(orgId, orgType, search)}
      />
      <Show
        visible={showCheckBillVisible}
        closeDrawer={() => {
          setShowCheckBillVisible(false);
        }}
        id={id}
      />
      <Verify
        verifyVisible={verifyVisible}
        closeVerify={closeVerify}
        ifVerify={ifVerify}
        id={id}
        reload={() => initLoadData(orgId, orgType, search)}
      />
    </Layout>
  );
}
export default Main;