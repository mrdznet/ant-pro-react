//合同变更
import {
  Tag, Spin, Divider, PageHeader, AutoComplete, InputNumber, TreeSelect, message,
  Tabs, Select, Button, Card, Col, DatePicker, Drawer, Form, Input, Row
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import {
  TreeEntity,
  HtLeasecontractcharge,
  HtLeasecontractchargefee,
  HtLeasecontractchargeincre,
  HtLeasecontractchargefeeoffer,
  LeaseContractDTO,
  ChargeDetailDTO
} from '@/model/models';
import React, { useEffect, useState } from 'react';
import ResultList from './ResultList';
import { SubmitForm, SaveForm, GetFeeItemsByUnitId, GetChargeByChargeId, GetFormJson, GetChargeDetail } from './Main.service';
import { GetOrgTreeSimple, GetAsynChildBuildingsSimple, GetCommonItems, GetUserList } from '@/services/commonItem';
import moment from 'moment';
import styles from './style.less';
import LeaseTermModify from './LeaseTermModify'; 

const { Option } = Select;
const { TabPane } = Tabs;

interface ChangeProps {
  visible: boolean;
  id?: string;//合同id
  chargeId?: string;//合同条款id
  closeDrawer(): void;
  form: WrappedFormUtils;
  reload(): void;
  // treeData: any[];
  // choose(): void;
};

const Change = (props: ChangeProps) => {
  const title = '合同详情';
  const { visible, closeDrawer, id, form, chargeId, reload } = props;
  const { getFieldDecorator } = form;
  //const [industryType, setIndustryType] = useState<any[]>([]); //行业  
  //const [feeitems, setFeeitems] = useState<TreeEntity[]>([]);
  const [infoDetail, setInfoDetail] = useState<LeaseContractDTO>({});
  const [contractCharge, setContractCharge] = useState<HtLeasecontractcharge>({});
  const [chargeFeeList, setChargeFeeList] = useState<HtLeasecontractchargefee[]>([]);
  const [chargeIncreList, setChargeIncreList] = useState<HtLeasecontractchargeincre[]>([]);
  const [chargeOfferList, setChargeOfferList] = useState<HtLeasecontractchargefeeoffer[]>([]);
  const [depositData, setDepositData] = useState<any[]>([]);//保证金
  const [chargeData, setChargeData] = useState<any[]>([]);//租金 
  const [industryType, setIndustryType] = useState<any[]>([]); //行业 
  const [feeItems, setFeeItems] = useState<TreeEntity[]>([]);
  const [isCal, setIsCal] = useState<boolean>(false);
  const [TermJson, setTermJson] = useState<string>();
  const [RateJson, setRateJson] = useState<string>();
  const [RebateJson, setRebateJson] = useState<string>();
  const [userSource, setUserSource] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]);

  // const close = () => {
  //   closeDrawer();
  // };

  //打开抽屉时初始化
  useEffect(() => {
    GetCommonItems('IndustryType').then(res => {
      setIndustryType(res || []);
    });
    //加载关联收费项目
    // GetAllFeeItems().then(res => {
    //   setFeeitems(res || []);
    // });

    //获取房产树
    GetOrgTreeSimple().then((res: any[]) => {
      setTreeData(res || []);
    });

  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (visible) {
      if (id) {
        setLoading(true);
        GetFormJson(id).then((tempInfo: LeaseContractDTO) => { 
          //处理一下房间
          let rooms: any[] = [];
          if (tempInfo != null && tempInfo.houseList != null) {
            tempInfo.houseList.forEach(item => {
              rooms.push(item.roomId);
            });
            setRooms(rooms);
          }

          GetFeeItemsByUnitId(tempInfo.billUnitId).then(res => {
            setFeeItems(res || []);
          });

          setInfoDetail(tempInfo);

          //获取条款
          GetChargeByChargeId(chargeId).then((charge: ChargeDetailDTO) => {
            setContractCharge(charge.contractCharge || {});
            setChargeFeeList(charge.chargeFeeList || []); 
            setChargeData(charge.chargeFeeResultList || []);//租金明细    
          })
          form.resetFields();
          setLoading(false);
        });
      } else {
        form.resetFields();
      }
    } else {
      form.setFieldsValue({});
    }
  }, [visible]);

  const handleSearch = value => {
    if (value == '')
      return;
    GetUserList(value, '员工').then(res => {
      setUserSource(res || []);
    })
  };

  const userList = userSource.map
    (item => <Option key={item.id} value={item.name}>{item.name}</Option>);

  const onFollowerSelect = (value, option) => {
    form.setFieldsValue({ followerId: option.key });
  };

  const onSignerSelect = (value, option) => {
    form.setFieldsValue({ signerId: option.key });
  };

  const onRoomChange = (value, label, extra) => {
    //多个房屋的时候，默认获取第一个房屋作为计费单元
    if (value.length == 0) {
      form.setFieldsValue({ billUnitId: '' });
      setFeeItems([]);
    } else {
      form.setFieldsValue({ billUnitId: value[0] });
      //加载房屋费项
      //加载关联收费项目
      GetFeeItemsByUnitId(value[0]).then(res => {
        setFeeItems(res || []);
      });
    }

    //选择房源,计算面积
    //["101 158.67㎡", "102 156.21㎡"]
    let area = 0;
    label.forEach((val, idx, arr) => {
      area += parseFloat(val.split(' ')[1].replace('㎡', ''));
    });
    form.setFieldsValue({ leaseSize: area.toFixed(2) });
    form.setFieldsValue({ leaseArea: area.toFixed(2) });
  };

  // const onIndustrySelect = (value, option) => {
  //   //设置行业名称
  //   form.setFieldsValue({ industry: option.props.children });
  // };

  //计算租金明细
  const calculation = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        setLoading(true);
        //数据处理  
        //租赁条款     
        let TermJson: HtLeasecontractchargefee[] = [];
        // let data: HtLeasecontractchargefee = {}; 
        // data.feeItemId = values.feeItemId[0];
        // data.startDate = values.startDate[0];
        // data.endDate = values.endDate[0];
        // data.price = values.price[0];
        // data.priceUnit = values.priceUnit[0];
        // data.advancePayTime = values.advancePayTime[0];
        // data.advancePayTimeUnit = values.advancePayTimeUnit[0];
        // data.billType = values.billType[0];
        // if (data.priceUnit == "1" || data.priceUnit == "3") {
        //   data.dayPriceConvertRule = values.dayPriceConvertRule[0];
        // }
        // data.yearDays = values.yearDays[0];
        // data.payCycle = values.payCycle[0];
        // data.rentalPeriodDivided = values.rentalPeriodDivided[0];
        // TermJson.push(data); 

        //动态添加的租期
        values.LeaseTerms.map(function (k, index, arr) {
          let data: HtLeasecontractchargefee = {};
          // data.feeItemId = k.feeItemId;
          // data.feeItemName = k.feeItemName;
          // data.startDate = k.startDate;
          // data.endDate = k.endDate;
          // data.price = k.price;  
          // data.priceUnit = k.priceUnit;
          // data.advancePayTime = k.advancePayTime;
          // data.advancePayTimeUnit = k.advancePayTimeUnit;
          // data.billType = k.billType;
          // if (data.priceUnit == "元/m²·天" || data.priceUnit == "元/天") {
          //   data.dayPriceConvertRule = k.dayPriceConvertRule;
          // }
          // data.yearDays = k.yearDays;
          // data.payCycle = k.payCycle;
          // data.rentalPeriodDivided = k.rentalPeriodDivided; 

          data.feeItemId = values.feeItemId[index];
          data.feeItemName = values.feeItemName[index];
          // data.startDate = values.startDate[index];
          // data.endDate = values.endDate[index];
          data.price = values.price[index];
          data.priceUnit = values.priceUnit[index];
          data.advancePayTime = values.advancePayTime[index];
          data.advancePayTimeUnit = values.advancePayTimeUnit[index];
          data.billType = values.billType[index];
          if (data.priceUnit == "元/m²·天" || data.priceUnit == "元/天") {
            data.dayPriceConvertRule = values.dayPriceConvertRule[index];
          }
          data.yearDays = values.yearDays[index];
          data.payCycle = values.payCycle[index];
          data.rentalPeriodDivided = values.rentalPeriodDivided[index];
          TermJson.push(data);
        });

        //递增率
        let RateJson: HtLeasecontractchargeincre[] = [];
        values.IncreasingRates.map(function (k, index, arr) {
          let rate: HtLeasecontractchargeincre = {};
          rate.increDate = values.increDate[index];
          rate.increPrice = values.increPrice[index];
          rate.increPriceUnit = values.increPriceUnit[index];
          rate.increDeposit = values.increDeposit[index];
          rate.increDepositUnit = values.increDepositUnit[index];
          RateJson.push(rate);
        });

        //优惠
        let RebateJson: HtLeasecontractchargefeeoffer[] = [];
        values.Rebates.map(function (k, index, arr) {
          let rebate: HtLeasecontractchargefeeoffer = {};
          // rebate.type = values.rebateType[index];
          // rebate.startDate = values.rebateStartDate[index];
          // rebate.endDate = values.rebateEndDate[index];
          rebate.startPeriod = values.startPeriod[index];
          rebate.periodLength = values.periodLength[index];
          rebate.discount = values.discount[index];
          rebate.remark = values.remark[index];
          RebateJson.push(rebate);
        });

        //let entity = values; 
        let entity: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        // entity.depositFeeItemId = values.depositFeeItemId;
        // entity.depositFeeItemName = values.depositFeeItemName;
        entity.leaseArea = values.leaseArea;
        // entity.deposit = values.deposit;
        // entity.depositUnit = values.depositUnit;
        // entity.startDate = values.billingDate.format('YYYY-MM-DD');
        // entity.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // entity.payDate = values.contractStartDate.format('YYYY-MM-DD');

        let strTermJson = JSON.stringify(TermJson);
        setTermJson(strTermJson);

        let strRateJson = JSON.stringify(RateJson);
        setRateJson(strRateJson);
        let strRebateJson = JSON.stringify(RebateJson);
        setRebateJson(strRebateJson);
        GetChargeDetail({
          ...entity,
          BillUnitId: values.billUnitId,//计费单元id
          LeaseContractId: '',
          CalcPrecision: values.calcPrecision,
          CalcPrecisionMode: values.calcPrecisionMode,
          TermJson: strTermJson,
          RateJson: strRateJson,
          RebateJson: strRebateJson

        }).then(res => {
          setIsCal(true);//计算了租金
          setDepositData(res.depositFeeResultList);//保证金明细
          setChargeData(res.chargeFeeResultList);//租金明细  
          // setDepositResult(res.depositFeeResultList);
          // setChargeFeeResult(res.chargeFeeResultList); 
          setLoading(false);
        });
      }
    });
  };

  //提交审核
  const submit = () => {
    //弹出选人
    //choose();
    //save(); 
    //发起审批
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if (!isCal) {
          // Modal.warning({
          //   title: '提示',
          //   content: '请生成租金明细！',
          // });
          message.warning('请生成租金明细！');
          return;
        }
        //保存合同数据
        let ContractCharge: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        // ContractCharge.depositFeeItemId = values.depositFeeItemId;
        // ContractCharge.depositFeeItemName = values.depositFeeItemName;
        ContractCharge.leaseArea = values.leaseArea;
        // ContractCharge.deposit = values.deposit;
        // ContractCharge.depositUnit = values.depositUnit;
        // ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        // ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD');

        //合同信息
        let Contract: LeaseContractDTO = {};
        Contract.id = id;
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.followerId = values.followerId;
        Contract.leaseSize = values.leaseSize;
        Contract.contractStartDate = values.contractStartDate.format('YYYY-MM-DD');
        Contract.billingDate = values.billingDate.format('YYYY-MM-DD');
        Contract.contractEndDate = values.contractEndDate.format('YYYY-MM-DD');
        Contract.calcPrecision = values.calcPrecision;
        Contract.calcPrecisionMode = values.calcPrecisionMode;
        Contract.customer = values.customer;
        Contract.customerId = values.customerId;
        Contract.industry = values.industry;
        //Contract.industryId = values.industryId; 
        Contract.legalPerson = values.legalPerson;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.customerContact = values.customerContact;
        Contract.customerContactId = values.customerContactId;
        Contract.lateFee = values.lateFee;
        Contract.lateFeeUnit = values.lateFeeUnit;
        Contract.maxLateFee = values.maxLateFee;
        Contract.maxLateFeeUnit = values.maxLateFeeUnit;
        Contract.billUnitId = values.billUnitId;

        SubmitForm({
          ...Contract,
          ...ContractCharge,
          keyvalue: id,
          ChargeId: chargeId,
          room: values.room,
          TermJson: TermJson,
          RateJson: RateJson,
          RebateJson: RebateJson,
          DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData)

        }).then(res => {
          message.success('提交成功');
          closeDrawer();
          reload();
        });
      }
    });
  };


  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        //是否生成租金明细
        if (!isCal) {
          // Modal.warning({
          //   title: '提示',
          //   content: '请生成租金明细！',
          // });
          message.warning('请生成租金明细！');
          return;
        }
        //保存合同数据
        let ContractCharge: HtLeasecontractcharge = {};
        //费用条款-基本条款 
        // ContractCharge.depositFeeItemId = values.depositFeeItemId;
        // ContractCharge.depositFeeItemName = values.depositFeeItemName;
        ContractCharge.leaseArea = values.leaseArea;
        // ContractCharge.deposit = values.deposit;
        // ContractCharge.depositUnit = values.depositUnit;
        // ContractCharge.startDate = values.billingDate.format('YYYY-MM-DD');
        // ContractCharge.endDate = values.contractEndDate.format('YYYY-MM-DD');
        // ContractCharge.payDate = values.contractStartDate.format('YYYY-MM-DD');

        //合同信息
        let Contract: LeaseContractDTO = {};
        Contract.id = id;
        Contract.no = values.no;
        Contract.follower = values.follower;
        Contract.followerId = values.followerId;
        Contract.leaseSize = values.leaseSize;
        Contract.contractStartDate = values.contractStartDate.format('YYYY-MM-DD');
        Contract.billingDate = values.billingDate.format('YYYY-MM-DD');
        Contract.contractEndDate = values.contractEndDate.format('YYYY-MM-DD');
        Contract.calcPrecision = values.calcPrecision;
        Contract.calcPrecisionMode = values.calcPrecisionMode;
        Contract.customer = values.customer;
        Contract.customerId = values.customerId;
        Contract.industry = values.industry;
        //Contract.industryId = values.industryId; 
        Contract.legalPerson = values.legalPerson;
        Contract.signer = values.signer;
        Contract.signerId = values.signerId;
        Contract.customerContact = values.customerContact;
        Contract.customerContactId = values.customerContactId;
        Contract.lateFee = values.lateFee;
        Contract.lateFeeUnit = values.lateFeeUnit;
        Contract.maxLateFee = values.maxLateFee;
        Contract.maxLateFeeUnit = values.maxLateFeeUnit;
        Contract.billUnitId = values.billUnitId;
        SaveForm({
          ...Contract,
          ...ContractCharge,
          keyvalue: id,
          ChargeId: chargeId,
          room: values.room,
          TermJson: TermJson,
          RateJson: RateJson,
          RebateJson: RebateJson,
          DepositResult: JSON.stringify(depositData),
          ChargeFeeResult: JSON.stringify(chargeData)

        }).then(res => {
          message.success('保存成功');
          closeDrawer();
          reload();
        });
      }
    });
  };

  //异步加载房间，提高速度
  const onLoadData = treeNode =>
    new Promise<any>(resolve => {
      if (treeNode.props.children && treeNode.props.children.length > 0 && treeNode.props.type != 'D') {
        resolve();
        return;
      }
      setTimeout(() => {
        GetAsynChildBuildingsSimple(treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
          // treeNode.props.children = res || [];
          let newtree = treeData.concat(res);
          // setTreeData([...treeData]);
          setTreeData(newtree);
        });
        resolve();
      }, 50);
    });


  //转换状态
  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return <Tag color="#e4aa5b">新建</Tag>;
      case 1:
        return <Tag color="#e4aa4b">待审核</Tag>;
      case 2:
        return <Tag color="#19d54e">已审核</Tag>;
      case -1:
        return <Tag color="#d82d2d">已作废</Tag>
      default:
        return '';
    }
  };

  //保证金单位切换
  const changeFeeItem = (value, option) => {
    form.setFieldsValue({ depositFeeItemName: option.props.children });
  };

  return (
    <Drawer
      title={title}
      placement="right"
      width={1000}
      onClose={closeDrawer}
      visible={visible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <PageHeader 
       ghost={false} 
       title={GetStatus(infoDetail.status)}
      // extra={[
      //   <Button key="1">附件</Button>, 
      //   <Button key="2">打印</Button>,
      // ]}
      />
      <Divider dashed />
      <Form layout="vertical" hideRequiredMark>
        <Spin tip="数据处理中..." spinning={loading}>
          <Tabs defaultActiveKey="1" >
            <TabPane tab="基本信息" key="1">
              <Row gutter={24}>
                <Col span={12}>
                  <Card title="基本信息" className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同编号" required>
                          {getFieldDecorator('no', {
                            initialValue: infoDetail.no,
                            rules: [{ required: true, message: '未选择模版时，请输入编号' }],
                          })(<Input placeholder="如不填写系统将自动生成" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="跟进人" >
                          {getFieldDecorator('follower', {
                            initialValue: infoDetail.follower
                          })(
                            <AutoComplete
                              dataSource={userList}
                              onSearch={handleSearch}
                              placeholder="请输入跟进人"
                              onSelect={onFollowerSelect}
                            />
                          )}
                          {getFieldDecorator('followerId', {
                            initialValue: infoDetail.followerId
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="租赁数量（m²)">
                          {getFieldDecorator('leaseSize', {
                            initialValue: infoDetail.leaseSize,
                            rules: [{ required: true, message: '请输入租赁数量' }],
                          })(<InputNumber placeholder="请输入租赁数量" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同签订时间" required>
                          {getFieldDecorator('contractStartDate', {
                            initialValue: infoDetail.contractStartDate
                              ? moment(new Date(infoDetail.contractStartDate))
                              : moment(new Date()),
                            rules: [{ required: true, message: '请选择合同签订时间' }],
                          })(<DatePicker placeholder="请选择合同签订时间" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="合同计租时间">
                          {getFieldDecorator('billingDate', {
                            initialValue: infoDetail.billingDate
                              ? moment(new Date(infoDetail.billingDate))
                              : moment(new Date()),
                            rules: [{ required: true, message: '请选择合同计租时间' }],
                          })(<DatePicker placeholder="请选择合同计租时间" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="合同失效时间" required>
                          {getFieldDecorator('contractEndDate', {
                            initialValue: infoDetail.contractEndDate
                              ? moment(new Date(infoDetail.contractEndDate))
                              : moment(new Date()).add(1, 'years').add(-1, 'days'),
                            rules: [{ required: true, message: '请选择合同失效时间' }],
                          })(<DatePicker placeholder="请选择合同失效时间" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="单价保留小数点">
                          {getFieldDecorator('calcPrecision', {
                            initialValue: infoDetail.calcPrecision ? infoDetail.calcPrecision : 2,
                            rules: [{ required: true, message: '请填写保留几位' }],
                          })(<InputNumber placeholder="请填写保留几位" style={{ width: '100%' }} />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="计算精度">
                          {getFieldDecorator('calcPrecisionMode', {
                            initialValue: infoDetail.calcPrecisionMode ? infoDetail.calcPrecisionMode : "最终计算结果保留2位"
                          })(<Select>
                            <Option value="最终计算结果保留2位" >最终计算结果保留2位</Option>
                            <Option value="每步计算结果保留2位" >每步计算结果保留2位</Option>
                          </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={6}>
                        <Form.Item label="滞纳金比例" >
                          {getFieldDecorator('lateFee', {
                            initialValue: infoDetail.lateFee
                          })(<InputNumber placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={6}>
                        <Form.Item label="&nbsp;" >
                          {getFieldDecorator('lateFeeUnit', {
                            initialValue: infoDetail.lateFeeUnit ? infoDetail.lateFeeUnit : "%/天"
                          })(
                            <Select>
                              <Option value="%/天">%/天</Option>
                            </Select>)}
                        </Form.Item>
                      </Col>
                      <Col lg={7}>
                        <Form.Item label="滞纳金上限" >
                          {getFieldDecorator('maxLateFee', {
                            initialValue: infoDetail.maxLateFee
                          })(<InputNumber placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={5}>
                        <Form.Item label="&nbsp;" >
                          {getFieldDecorator('maxLateFeeUnit', {
                            initialValue: infoDetail.maxLateFeeUnit ? infoDetail.maxLateFeeUnit : "%"
                          })(<Select>
                            <Option value="%">%</Option>
                          </Select>)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="租赁信息" className={styles.addcard} hoverable>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="房源选择" required>
                          {getFieldDecorator('room', {
                            initialValue: rooms,
                            rules: [{ required: true, message: '请选择房源' }],
                          })(
                            <TreeSelect
                              placeholder="请选择房源"
                              allowClear
                              dropdownStyle={{ maxHeight: 300 }}
                              treeData={treeData}
                              loadData={onLoadData}
                              treeDataSimpleMode={true}
                              onChange={onRoomChange}
                              multiple={true}>
                            </TreeSelect>
                          )}
                          <span style={{ marginLeft: 8, color: "green" }}>多个房屋的时候，默认获取第一个房屋作为计费单元</span>
                          {getFieldDecorator('billUnitId', {
                            initialValue: infoDetail.billUnitId
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="租客" required>
                          {getFieldDecorator('customer', {
                            initialValue: infoDetail.customer,
                            rules: [{ required: true, message: '请填写姓名或公司' }],
                          })(<Input placeholder="请填写姓名或公司" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="行业" required>
                          {getFieldDecorator('industry', {
                            initialValue: infoDetail.industry,
                            rules: [{ required: true, message: '请选择行业' }],
                          })(
                            <Select placeholder="请选择行业"
                            // onSelect={onIndustrySelect}
                            >
                              {industryType.map(item => (
                                <Option value={item.value} key={item.key}>
                                  {item.title}
                                </Option>
                              ))}
                            </Select>
                          )}
                          {/* {getFieldDecorator('industry', {
                            initialValue: infoDetail.industry
                          })(
                            <input type='hidden' />
                          )} */}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={12}>
                        <Form.Item label="法人" required>
                          {getFieldDecorator('legalPerson', {
                            initialValue: infoDetail.legalPerson,
                            rules: [{ required: true, message: '请填写法人' }],
                          })(<Input placeholder="请填写法人" />)}
                        </Form.Item>
                      </Col>
                      <Col lg={12}>
                        <Form.Item label="签订人" required>
                          {getFieldDecorator('signer', {
                            initialValue: infoDetail.signer,
                            rules: [{ required: true, message: '请输入签订人' }],
                          })(
                            <AutoComplete
                              dataSource={userList}
                              onSearch={handleSearch}
                              placeholder="请输入签订人"
                              onSelect={onSignerSelect}
                            />
                          )}
                          {getFieldDecorator('signerId', {
                            initialValue: infoDetail.signerId,
                          })(
                            <input type='hidden' />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col lg={24}>
                        <Form.Item label="租客联系人">
                          {getFieldDecorator('customerContact', {
                            initialValue: infoDetail.customerContact,
                            rules: [{ required: true, message: '请输入租客联系人' }],
                          })(<Input placeholder="请输入租客联系人" />)}
                        </Form.Item>
                      </Col>
                    </Row>

                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="租赁条款" key="2">
              <Card title="基本条款" className={styles.card} hoverable>
                <Row gutter={24}>
                  <Col lg={4}>
                    <Form.Item label="租赁数量（㎡）" required>
                      {getFieldDecorator('leaseArea', {
                        initialValue: contractCharge.leaseArea
                      })(<Input readOnly />)}
                    </Form.Item>
                  </Col>
                  <Col lg={10}>
                    <Form.Item label="保证金关联费项" required>
                      {getFieldDecorator('depositFeeItemId', {
                        initialValue: contractCharge.depositFeeItemId,
                        rules: [{ required: true, message: '请选择费项' }]
                      })(
                        <Select placeholder="请选择费项"
                          onChange={changeFeeItem}
                        >
                          {feeItems.map(item => (
                            <Option value={item.value} key={item.key}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      )}

                      {getFieldDecorator('depositFeeItemName', {
                        initialValue: contractCharge.depositFeeItemName,
                      })(
                        <input type='hidden' />
                      )}

                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="保证金数量" required>
                      {getFieldDecorator('deposit', {
                        initialValue: contractCharge.deposit ? contractCharge.deposit : 1,
                        rules: [{ required: true, message: '请输入保证金数量' }],
                      })(<Input placeholder="请输入保证金数量" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={5}>
                    <Form.Item label="&nbsp;" >
                      {getFieldDecorator('depositUnit', {
                        initialValue: contractCharge.depositUnit ? contractCharge.depositUnit : "月"
                      })(
                        <Select>
                          <Option value="月">月</Option>
                          <Option value="元">元</Option>
                        </Select>)}
                    </Form.Item>
                  </Col>
                  {/* <Col lg={4}>
                  <Form.Item label="保证金金额" >
                    {getFieldDecorator('totalDeposit', {
                    })(<Input readOnly />)}
                  </Form.Item>
                </Col> */}
                </Row>
              </Card>
              <LeaseTermModify
                form={form}
                feeItems={feeItems}
                chargeFeeList={chargeFeeList}
              ></LeaseTermModify>
 
              <Button style={{ width: '100%', marginBottom: '10px' }}
                onClick={calculation}>点击生成租金明细</Button>
              <ResultList
                depositData={depositData}
                chargeData={chargeData}
              ></ResultList>
            </TabPane>

          </Tabs>
        </Spin>
      </Form>
      <div
        style={{
          position: 'absolute',
          zIndex: 999,
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
         <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
          关闭
          </Button>
        <Button onClick={save} style={{ marginRight: 8 }}>
          保存
          </Button>
        <Button onClick={submit} type="primary">
          提交
          </Button>
      </div>
    </Drawer >
  );
};

export default Form.create<ChangeProps>()(Change);

