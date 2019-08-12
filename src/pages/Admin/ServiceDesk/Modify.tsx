import { TreeEntity } from '@/model/models';
import { Modal, Menu, Dropdown, Icon, Tabs, Select, Button, Card, Col, Drawer, Form, Input, message, Row, TreeSelect } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetRoomUser, GetQuickSimpleTreeAll, SaveForm, ChangeToRepair, ChangeToComplaint } from './Main.service';
import { getResult } from '@/utils/networkUtils';
import styles from './style.less';
import CommentBox from './CommentBox';

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
  var title = data === undefined ? '添加服务单' : '修改服务单';
  if (data && data.billStatus != '1') {
    title = '查看服务单';
  }

  const [infoDetail, setInfoDetail] = useState<any>({});
  const [treeData, setTreeData] = useState<any[]>([]);
  //const [roomUser, setRoomUser] = useState<any>(); 

  // 打开抽屉时初始化
  useEffect(() => {

    //获取房产树
    GetQuickSimpleTreeAll()
      .then(getResult)
      .then((res: TreeEntity[]) => {
        setTreeData(res || []);
        return res || [];
      });


  }, []);

  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {
      if (data) {
        setInfoDetail(data);
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
    dataDetail.keyValue = dataDetail.id;
    SaveForm({ ...dataDetail }).then(res => {
      message.success('保存成功');
      closeDrawer();
      reload();
    });
  };

  const onChange = (value, label, extr) => {
    //加载房间联系人以及联系电话 
    if (value) {
      GetRoomUser(value).then((res: any) => {
        //setRoomUser(res || null);
        form.setFieldsValue({ address: extr.triggerNode.props.allname });
        form.setFieldsValue({ contactName: res.contactName });
        form.setFieldsValue({ contactPhone: res.contactPhone });
      });
    } else {
      form.setFieldsValue({ address: '' });
      form.setFieldsValue({ contactName: '' });
      form.setFieldsValue({ contactPhone: '' });
    }
  };

  const handleMenuClick = (e) => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const title = e.item.props.children;
        Modal.confirm({
          title: '请确认',
          content: `确定要` + title + `吗？`,
          onOk: () => {
            const newData = data ? { ...data, ...values } : values;
            newData.keyValue = newData.id;

            if (e.key == '1') {
              ChangeToRepair({ ...newData }).then(res => {
                message.success('操作成功');
                closeDrawer();
                reload();
              });
            }
            else if (e.key == '2') {
              ChangeToComplaint({ ...newData }).then(res => {
                message.success('操作成功');
                closeDrawer();
                reload();
              });
            }
          }
        });
      }
    });
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">转报修</Menu.Item>
      <Menu.Item key="2">转投诉</Menu.Item>
      {/* <Menu.Item key="3">毕单</Menu.Item>
      <Menu.Item key="3">归档</Menu.Item> */}
    </Menu>
  );

  return (
    <Drawer
      title={title}
      placement="right"
      width={750}
      onClose={close}
      visible={modifyVisible}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}
    >
      {modifyVisible ? (
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基础信息" key="1">
            <Form layout="vertical" hideRequiredMark>
              {infoDetail.billStatus != 2 ? (
                <Card className={styles.card}  >
                  <Row gutter={24}>
                    <Col lg={8}>
                      <Form.Item label="单据来源" required>
                        {getFieldDecorator('source', {
                          initialValue: infoDetail.source == undefined ? '服务总台' : infoDetail.source
                        })(
                          <Select >
                            <Option value="服务总台">服务总台</Option>
                            <Option value="社区APP">社区APP</Option>
                            <Option value="微信公众号">微信公众号</Option>
                            <Option value="员工APP">员工APP</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={8}>
                      <Form.Item label="单据编号">
                        {getFieldDecorator('billCode', {
                          initialValue: infoDetail.billCode
                        })(<Input placeholder="自动获取编号" readOnly />)}
                      </Form.Item>
                    </Col>
                    <Col lg={8}>
                      <Form.Item label="单据时间">
                        <Input placeholder="自动获取时间" readOnly value={infoDetail.billDate} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={8}>
                      <Form.Item label="业务类型">
                        {getFieldDecorator('billType', {
                          initialValue: infoDetail.billType === undefined ? '服务' : infoDetail.billType
                        })(
                          <Select  >
                            <Option value="报修">报修</Option>
                            <Option value="投诉">投诉</Option>
                            <Option value="服务">服务</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={8}>
                      <Form.Item label="紧急程度">
                        {getFieldDecorator('emergencyLevel', {
                          initialValue: infoDetail.emergencyLevel == undefined ? '一般' : infoDetail.emergencyLevel
                        })(
                          <Select  >
                            <Option value="一般">一般</Option>
                            <Option value="紧急">紧急</Option>
                            <Option value="非常紧急">非常紧急</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={8}>
                      <Form.Item label="重要程度">
                        {getFieldDecorator('importance', {
                          initialValue: infoDetail.importance == undefined ? '一般' : infoDetail.importance
                        })(
                          <Select >
                            <Option value="一般">一般</Option>
                            <Option value="重要">重要</Option>
                            <Option value="非常重要">非常重要</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={8}>
                      <Form.Item label="房号" required>
                        {getFieldDecorator('roomId', {
                          initialValue: infoDetail.roomId,
                          rules: [{ required: true, message: '请选择房号' }],
                        })(
                          <TreeSelect
                            placeholder="请选择房号"
                            allowClear
                            onChange={onChange}
                            dropdownStyle={{ maxHeight: 300 }}
                            treeData={treeData}
                            treeDataSimpleMode={true} >
                          </TreeSelect>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={8}>
                      <Form.Item label="联系人">
                        {getFieldDecorator('contactName', {
                          initialValue: infoDetail.contactName
                        })(<Input placeholder="自动获取联系人" readOnly />)}
                      </Form.Item>
                    </Col>

                    <Col lg={8}>
                      <Form.Item label="联系电话">
                        {getFieldDecorator('contactPhone', {
                          initialValue: infoDetail.contactPhone
                        })(<Input placeholder="自动获取联系电话" readOnly />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="详细地址">
                        {getFieldDecorator('address', {
                          initialValue: infoDetail.address
                        })(<Input placeholder="自动获取详细地址" readOnly />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="内容">
                        {getFieldDecorator('contents', {
                          initialValue: infoDetail.contents,
                        })(<TextArea rows={4} placeholder="请输入内容" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ) :
                <Card className={styles.card}  >
                  <Row gutter={24}>
                    <Col lg={4}>
                      <Form.Item label="单据来源"  >
                        {infoDetail.source}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="单据编号">
                        {infoDetail.billCode}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="单据时间">
                        {infoDetail.billDate}
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="业务类型">
                        {infoDetail.billType}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="关联单号">
                        <a>{infoDetail.businessCode}</a>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={4}>
                      <Form.Item label="联系人">
                        {infoDetail.contactName}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="房号"  >
                        {infoDetail.roomId}
                      </Form.Item>
                    </Col>

                    <Col lg={6}>
                      <Form.Item label="联系电话">
                        {infoDetail.contactPhone}
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="紧急程度">
                        {infoDetail.emergencyLevel}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="重要程度">
                        {infoDetail.importance}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="详细地址">
                        {infoDetail.address}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="内容">
                        {infoDetail.contents}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              }
            </Form>
          </TabPane>
          {data ? (
            <TabPane tab="留言动态" key="2">
              <CommentBox data={data} />
            </TabPane>
          ) : null}

        </Tabs>) : null}

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


        {(infoDetail.billStatus && infoDetail.billStatus != 2) ? (
          <div>
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
           </Button>
            <Dropdown overlay={menu} >
              <Button style={{ marginRight: 8 }}>
                操作<Icon type="down" />
              </Button>
            </Dropdown>
            <Button onClick={save} type="primary">
              保存
           </Button></div>) : 
           <div> 
            <Button onClick={close} style={{ marginRight: 8 }}>
              取消
           </Button>
            <Button onClick={save} type="primary">
              保存
           </Button>
          </div>}
      </div>
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);
