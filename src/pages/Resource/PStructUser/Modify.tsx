// import { TreeEntity } from '@/model/models';
import { Tabs, Table, DatePicker, Button, Card, Col, Drawer, Form, Input, message, Row, Select, TreeSelect, Checkbox } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {
  GetUnitPageListJson,
  //ExistCellphone, 
  ExistCode, SaveForm
} from './PStructUser.service';
import { GetCommonItems, GetOrgs } from '@/services/commonItem';
import { DefaultPagination } from "@/utils/defaultSetting";
import { ColumnProps, PaginationConfig } from "antd/lib/table";
import styles from './style.less';
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { modifyVisible, data, closeDrawer, form, reload } = props;
  const { getFieldDecorator } = form;
  const title = data === undefined ? '添加住户' : '修改住户';
  const [infoDetail, setInfoDetail] = useState<any>({});
  const [treeData, setTreeData] = useState<any[]>([]); //所属机构
  const [banks, setBanks] = useState<any[]>([]); // 开户银行
  const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  const [deductionbanks, setDeductionanks] = useState<any[]>([]); //划扣银行
  const [loading, setLoading] = useState<boolean>(false);
  const [itemData, setItemData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationConfig>(new DefaultPagination());
  // const [banks, setBanks] = useState<any[]>([]); // 证件类别
  // const [banks, setBanks] = useState<any[]>([]); // 企业性质
  // 打开抽屉时初始化
  useEffect(() => {
    GetOrgs().then((res: any[]) => {
      setTreeData(res || []);
    });
    // 获取开户银行
    GetCommonItems('Bank').then(res => {
      setBanks(res || []);
    });

    GetCommonItems('IndustryType').then(res => {
      setIndustryType(res || []);
    });

    // 获取划账银行
    GetCommonItems('AccountBank').then(res => {
      setDeductionanks(res || []);
    });

    // // 获取证件类别
    // GetCommonItems('Bank').then(res => {
    //   setBanks(res || []);
    // });

    // // 获取企业性质
    // GetCommonItems('Bank').then(res => {
    //   setBanks(res || []);
    // });
  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail(data);
        initLoadData();
        form.resetFields();
      } else {
        setInfoDetail({});
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        doSave(newData);
      }
    });
  };
  const doSave = dataDetail => {
    dataDetail.keyvalue = dataDetail.id;
    if (dataDetail.birthdate != null)
      dataDetail.birthdate = dataDetail.birthdate.format('YYYY-MM-DD');
    if (dataDetail.signingDate != null)
      dataDetail.signingDate = dataDetail.signingDate.format('YYYY-MM-DD');
    SaveForm({ ...dataDetail }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

  //验证编码是否重复
  const checkCodeExist = (rule, value, callback) => {
    if (value == undefined) {
      callback();
    }
    else {
      const keyvalue = infoDetail.id == undefined ? '' : infoDetail.id;
      ExistCode(keyvalue, value).then(res => {
        if (res)
          callback('编号重复');
        else
          callback();
      })
    }
  };

  //验证手机号码
  // const checkCellphoneExist = (rule, value, callback) => {
  //   if (value == undefined) {
  //     callback();
  //   }
  //   else {
  //     const keyvalue = infoDetail.id == undefined ? '' : infoDetail.id;
  //     ExistCellphone(keyvalue, value).then(res => {
  //       if (res)
  //         callback('手机号码重复');
  //       else
  //         callback();
  //     })
  //   }
  // };

  const load = formData => {
    setLoading(true);
    formData.sidx = formData.sidx || "code";
    formData.sord = formData.sord || "asc";
    return GetUnitPageListJson(formData).then(res => {
      const { pageIndex: current, total, pageSize } = res;
      setPagination(pagesetting => {
        return {
          ...pagesetting,
          current,
          total,
          pageSize
        };
      });
      setItemData(res.data);
      setLoading(false);
      return res;
    });
  };

  const initLoadData = () => {
    const queryJson = { customerId: data.id };
    const sidx = "code";
    const sord = "asc";
    const { current: pageIndex, pageSize, total } = pagination;
    return load({ pageIndex, pageSize, sidx, sord, total, queryJson }).then(
      res => {
        return res;
      }
    );
  };

  //刷新
  const loadData = (paginationConfig?: PaginationConfig, sorter?) => {
    const { current: pageIndex, pageSize, total } = paginationConfig || {
      current: 1,
      pageSize: pagination.pageSize,
      total: 0,
    };
    let searchCondition: any = {
      pageIndex,
      pageSize,
      total,
      queryJson: { customerId: data.id },
    };

    if (sorter) {
      let { field, order } = sorter;
      searchCondition.sord = order === "descend" ? "desc" : "asc";
      searchCondition.sidx = field ? field : 'code';
    }
    return load(searchCondition).then(res => {
      return res;
    });
  };

  const changePage = (pagination: PaginationConfig, filters, sorter) => {
    loadData(pagination, sorter);
  };


  const columns = [
    {
      title: "房产编号",
      dataIndex: "code",
      key: "code",
      width: 160,
    },
    {
      title: "房产面积(㎡)",
      dataIndex: "area",
      key: "area",
      width: 100
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      width: 80,
      align: 'center',
    },
    {
      title: "房产全称",
      dataIndex: "allName",
      key: "allName",
    }
  ] as ColumnProps<any>[];

  return (
    <Drawer
      title={title}
      placement="right"
      width={700}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }} >

      <Tabs defaultActiveKey="1" >
        <TabPane tab="基本信息" key="1">
          <Card className={styles.card} hoverable>
            {modifyVisible ? (
              <Form layout="vertical" hideRequiredMark>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="隶属机构" required>
                      {getFieldDecorator('organizeId', {
                        initialValue: infoDetail.organizeId,
                        rules: [{ required: true, message: '请选择隶属机构' }],
                      })(
                        <TreeSelect
                          placeholder="请选择隶属机构"
                          treeData={treeData}
                          allowClear
                          treeDefaultExpandAll
                          dropdownStyle={{ maxHeight: 350 }}
                        >
                          {/* {renderTree(treeData)} */}
                        </TreeSelect>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="住户类别" required>
                      {getFieldDecorator('type', {
                        initialValue: infoDetail.type ? infoDetail.type : '1',
                        rules: [{ required: true, message: '请选择住户类别' }],
                      })(
                        <Select>
                          <Option value="1" key="1">
                            个人
                      </Option>
                          <Option value="2" key="2">
                            单位
                      </Option>
                        </Select>,
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>

                  <Col lg={12}>
                    <Form.Item label="住户名称" required>
                      {getFieldDecorator('name', {
                        initialValue: infoDetail.name,
                        rules: [{ required: true, message: '请输入住户名称' }],
                      })(<Input placeholder="请输入住户名称" />)}
                    </Form.Item>
                  </Col>

                  <Col lg={12}>
                    <Form.Item label="住户编号" required>
                      {getFieldDecorator('code', {
                        initialValue: infoDetail.code,
                        rules: [{ required: true, message: '请输入住户编号' },
                        {
                          validator: checkCodeExist
                        }],
                      })(<Input placeholder="请输入住户编号" />)}
                    </Form.Item>
                  </Col>

                  {/* <Col lg={12}>
                <Form.Item label="联系电话" required>
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                    rules: [{ required: true, message: '请输入联系电话' }],
                  })(<Input placeholder="请输入联系电话" />)}
                </Form.Item>
              </Col> */}
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="住户简称">
                      {getFieldDecorator('shortName', {
                        initialValue: infoDetail.shortName,
                      })(<Input placeholder="请输入住户简称" />)}
                    </Form.Item>
                  </Col>

                  <Col lg={12}>
                    <Form.Item label="手机号码">
                      {getFieldDecorator('phoneNum', {
                        initialValue: infoDetail.phoneNum,
                        rules: [{ required: true, message: '请输入手机号码' }
                          //{ validator: checkCellphoneExist}
                        ],
                      })(<Input placeholder="请输入手机号码" maxLength={11} />)}
                    </Form.Item>
                  </Col>
                </Row>

                {form.getFieldValue('type') === '1' ? (
                  <>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="性别" required>
                          {getFieldDecorator('Gender', {
                            initialValue: infoDetail.Gender ? infoDetail.Gender : 1,
                            rules: [{ required: true, message: '请选择性别' }],
                          })(
                            <Select>
                              <Option value={1} >
                                男
                          </Option>
                              <Option value={2}>
                                女
                      </Option>
                            </Select>,
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="生日">
                          {getFieldDecorator('birthdate', {
                            initialValue: infoDetail.birthdate
                              ? moment(new Date(infoDetail.birthdate))
                              : moment(new Date()),
                          })(<DatePicker style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="证件类别">
                          {getFieldDecorator('certificateType', {
                            initialValue: infoDetail.certificateType,
                          })(<Input placeholder="请输入证件类别" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="证件号码">
                          {getFieldDecorator('certificateNO', {
                            initialValue: infoDetail.certificateNO,
                          })(<Input placeholder="请输入证件号码" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="发证机关">
                          {getFieldDecorator('issuingOrgan', {
                            initialValue: infoDetail.issuingOrgan,
                          })(<Input placeholder="请输入发证机关" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="证件地址">
                          {getFieldDecorator('documentAddress', {
                            initialValue: infoDetail.documentAddress,
                          })(<Input placeholder="请输入证件地址" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                ) : (
                    <>
                      <Row gutter={24}>
                        <Col lg={12}>
                          <Form.Item label="行业" required>
                            {getFieldDecorator('industry', {
                              initialValue: infoDetail.industry,
                              rules: [{ required: true, message: '请选择行业' }],
                            })(
                              <Select placeholder="请选择行业">
                                {industryType.map(item => (
                                  <Option value={item.value} key={item.key}>
                                    {item.title}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col lg={12}>
                          <Form.Item label="法人" required >
                            {getFieldDecorator('legal', {
                              rules: [{ required: true, message: '请输入法人' }],
                            })(<Input placeholder="请输入法人" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col lg={12}>
                          <Form.Item label="经营范围">
                            {getFieldDecorator('nature', {
                              initialValue: infoDetail.nature,
                            })(<Input placeholder="请输入经营范围" />)}
                          </Form.Item>
                        </Col>
                        <Col lg={12}>
                          <Form.Item label="注册资本">
                            {getFieldDecorator('capital', {
                              initialValue: infoDetail.capital,
                            })(<Input placeholder="请输入注册资本" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col lg={12}>
                          <Form.Item label="信用代码">
                            {getFieldDecorator('creditCode', {
                              initialValue: infoDetail.creditCode,
                            })(<Input placeholder="请输入信用代码" />)}
                          </Form.Item>
                        </Col>
                        <Col lg={12}>
                          <Form.Item label="税务识别号">
                            {getFieldDecorator('taxCode', {
                              initialValue: infoDetail.taxCode,
                            })(<Input placeholder="请输入税务识别号" />)}
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={24}>
                        <Col lg={12}>
                          <Form.Item label="经营业态">
                            {getFieldDecorator('businessFormat', {
                              initialValue: infoDetail.businessFormat,
                            })(<Input placeholder="请输入经营业态" />)}
                          </Form.Item>
                        </Col>
                        <Col lg={12}>
                          <Form.Item label="招牌名称">
                            {getFieldDecorator('signboardName', {
                              initialValue: infoDetail.signboardName,
                            })(<Input placeholder="请输入招牌名称" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col lg={12}>
                          <Form.Item label="品牌名称">
                            {getFieldDecorator('brandName', {
                              initialValue: infoDetail.brandName,
                            })(<Input placeholder="请输入传真号码" />)}
                          </Form.Item>
                        </Col>
                        <Col lg={12}>
                          <Form.Item label="品牌级别">
                            {getFieldDecorator('brandLevel', {
                              initialValue: infoDetail.brandLevel,
                            })(<Input placeholder="请输入品牌级别" />)}
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  )}

                {/* <Row gutter={24}>
              <Col lg={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('telPhoneNum', {
                    initialValue: infoDetail.telPhoneNum,
                  })(<Input placeholder="请输入联系电话" />)}
                </Form.Item>
              </Col>
              <Col lg={12}>
                <Form.Item label="手机号码">
                  {getFieldDecorator('phoneNum', {
                    initialValue: infoDetail.phoneNum,
                  })(<Input placeholder="请输入手机号码" />)}
                </Form.Item>
              </Col>
            </Row> */}
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="传真号码">
                      {getFieldDecorator('fax', {
                        initialValue: infoDetail.fax,
                      })(<Input placeholder="请输入传真号码" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="电子邮箱">
                      {getFieldDecorator('email', {
                        initialValue: infoDetail.email,
                      })(<Input placeholder="请输入电子邮箱" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="划扣银行">
                      {getFieldDecorator('deductionBank', {
                        initialValue: infoDetail.deductionBank,
                        // rules: [{ required: true, message: '请选择划扣银行' }],
                      })(<Select placeholder="请选择划扣银行">
                        {deductionbanks.map(item => (
                          <Option value={item.value} key={item.key}>
                            {item.title}
                          </Option>
                        ))}
                      </Select>)}
                    </Form.Item>
                  </Col>

                  <Col lg={12}>
                    <Form.Item label="开户名">
                      {getFieldDecorator('accountName', {
                        initialValue: infoDetail.accountName,
                      })(<Input placeholder="请输入开户名" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="开户银行">
                      {getFieldDecorator('accountBank', {
                        initialValue: infoDetail.accountBank,
                      })(
                        <Select placeholder="请选择开户银行">
                          {banks.map(item => (
                            <Option value={item.value} key={item.key}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="银行账号">
                      {getFieldDecorator('bankAccount', {
                        initialValue: infoDetail.bankAccount,
                      })(<Input placeholder="请输入银行账号" />)}
                    </Form.Item>
                  </Col>
                </Row>


                <Row gutter={24}>
                  <Col lg={12}>
                    <Form.Item label="签约日期">
                      {getFieldDecorator('signingDate', {
                        initialValue: infoDetail.signingDate
                          ? moment(new Date(infoDetail.birthdate))
                          : null,
                      })(<DatePicker style={{ width: '100%' }} />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item label="协议编号">
                      {getFieldDecorator('agreementNo', {
                        initialValue: infoDetail.agreementNo,
                      })(<Input placeholder="请输入协议编号" />)}
                    </Form.Item>
                  </Col>

                </Row>

                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="联系地址">
                      {getFieldDecorator('address', {
                        initialValue: infoDetail.address,
                      })(<Input placeholder="请输入联系地址" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col lg={24}>
                    <Form.Item label="附加说明">
                      {getFieldDecorator('memo', {
                        initialValue: infoDetail.memo,
                      })(<TextArea rows={4} placeholder="请输入附加说明" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <Form.Item label="加入黑名单">
                      {getFieldDecorator('isBlackName', {
                        initialValue: infoDetail.isBlackName ? true : false,
                      })(<Checkbox checked={form.getFieldValue('isBlackName')} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ) : null}
          </Card>
        </TabPane>
        <TabPane tab="房产" key="2">
          <Table
            style={{ border: 'none' }}
            bordered={false}
            size="middle"
            dataSource={itemData}
            columns={columns}
            rowKey={record => record.id}
            pagination={pagination}
            scroll={{ y: 420 }}
            loading={loading}
            onChange={(pagination: PaginationConfig, filters, sorter) =>
              changePage(pagination, filters, sorter)
            }
          />
        </TabPane>
      </Tabs>
      <div
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={close} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button onClick={save} type="primary">
          提交
        </Button>
      </div>
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);

// const renderTree = (treeData: TreeEntity[], parentId: string) => {
//   return treeData
//     .filter(item => item.parentId === parentId)
//     .map(filteditem => {
//       return (
//         <TreeNode title={filteditem.text} key={filteditem.id} value={filteditem.id}>
//           {renderTree(treeData, filteditem.id as string)}
//         </TreeNode>
//       );
//     });
// };

// const renderTree = data =>
//     data.map(item => {
//       if (item.children) {
//         return ( 
//           <TreeNode {...item} dataRef={item} >
//             {renderTree(item.children)}
//           </TreeNode>
//         );
//       }
//       return <TreeNode {...item} dataRef={item} />;
//     });
