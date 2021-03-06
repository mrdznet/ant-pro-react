
import { Spin, Upload, Modal, Icon, Tabs, Select, Button, Card, Col, Drawer, Form, Input, message, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetOperationRecords, GetFilesData, RemoveFile, SaveForm, ChangeToRepair, ChangeToComplaint, Visit } from './Main.service';
import { GetRoomUser } from '@/services/commonItem';
import styles from './style.less';
import CommentBox from './CommentBox';
import OperationRecord from './OperationRecord';
import AddCloseMemo from './AddCloseMemo';
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
import SelectHouse from './SelectHouse';
import SelectTemplate from '../../System/Template/SelectTemplate'
import AuthButton from '@/components/AuthButton/AuthButton';

interface ModifyProps {
  modifyVisible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
  // treeData: any[];
  showLink(type, code): void;
}

const Modify = (props: ModifyProps) => {
  const { modifyVisible, data, closeDrawer, form, reload, showLink } = props;
  const { getFieldDecorator } = form;
  var title = data === undefined ? '添加服务单' : '修改服务单';
  if (data && data.status != 1 && data.status != '3') {
    title = '查看服务单';
  }
  const [infoDetail, setInfoDetail] = useState<any>({});
  // const [treeData, setTreeData] = useState<any[]>([]);
  //const [roomUser, setRoomUser] = useState<any>(); 
  const [keyvalue, setKeyvalue] = useState<any>();
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [addMemoVisible, setAddMemoVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // const [treeData, setTreeData] = useState<any[]>([]);

  // 打开抽屉时初始化
  // useEffect(() => {
  //   //获取房产树 
  //   GetOrgTreeSimple().then((res: any[]) => {
  //     setTreeData(res || []);
  //   });
  // }, []);

  const [comments, setComments] = useState<any[]>([]);


  // 打开抽屉时初始化
  useEffect(() => {
    if (modifyVisible) {

      if (data) {
        setLoading(true);
        setKeyvalue(data.id);
        setInfoDetail(data);
        form.resetFields();
        //图片
        GetFilesData(data.id).then(res => {
          setFileList(res || []);
        });

        //获取操作记录
        GetOperationRecords(data.id).then(info => {
          setComments(info || []);
        })

        setLoading(false);
      } else {
        setKeyvalue(guid());
        setInfoDetail({});
        form.resetFields();
        setFileList([]);
      }
    } else {
      form.resetFields();
    }
  }, [modifyVisible]);

  const close = () => {
    closeDrawer();
  };

  const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
    setLoading(true);
    dataDetail.keyvalue = keyvalue;//dataDetail.id ? dataDetail.id : guid(); 
    dataDetail.isAdd = dataDetail.billCode == undefined ? true : false;
    dataDetail.custEvaluate = 0;
    SaveForm({ ...dataDetail }).then(res => {
      message.destroy();//防止重复弹出提示
      message.success('保存成功');
      setLoading(false);
      closeDrawer();
      reload();
    })
      .catch(err => {
        //数据在APP端已经处理，弹出刷新确认
        Modal.confirm({
          title: '请确认',
          content: err,
          onOk: () => {
            setLoading(false);
            closeDrawer();
            reload();
          }
        });
      });
  };

  // const onChange = (value, label, extr) => {
  //   //加载房间联系人以及联系电话 
  //   if (value) {
  //     GetRoomUser(value).then((res: any) => {
  //       //setRoomUser(res || null); 
  //       form.setFieldsValue({ address: extr.triggerNode.props.allname });
  //       if (res != null) {
  //         form.setFieldsValue({ contactName: res.contactName });
  //         form.setFieldsValue({ contactPhone: res.contactPhone });
  //         form.setFieldsValue({ contactId: res.custId });
  //       } else {
  //         form.setFieldsValue({ contactName: '' });
  //         form.setFieldsValue({ contactPhone: '' });
  //         form.setFieldsValue({ contactId: '' });
  //       }
  //     });
  //   } else {
  //     form.setFieldsValue({ address: '' });
  //     form.setFieldsValue({ contactName: '' });
  //     form.setFieldsValue({ contactPhone: '' });
  //     form.setFieldsValue({ contactId: '' });
  //   }
  // };

  const torepair = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        Modal.confirm({
          title: '请确认',
          content: '确定要转维修吗？',
          onOk: () => {
            setLoading(true);
            const newData = data ? { ...data, ...values } : values;
            newData.keyvalue = newData.id;
            ChangeToRepair({ ...newData }).then(res => {
              setLoading(false);
              message.destroy();//防止重复弹出提示
              message.success('操作成功');
              closeDrawer();
              reload();
            }).catch(err => {
              //数据在APP端已经处理，弹出刷新确认
              Modal.confirm({
                title: '请确认',
                content: err,
                onOk: () => {
                  setLoading(false);
                  closeDrawer();
                  reload();
                }
              });
            });
          }
        })
      }
    });
  };




  const tocomplaint = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        Modal.confirm({
          title: '请确认',
          content: '确定要转投诉吗？',
          onOk: () => {
            setLoading(true);
            const newData = data ? { ...data, ...values } : values;
            newData.keyvalue = newData.id;
            ChangeToComplaint({ ...newData }).then(res => {
              setLoading(false);
              message.destroy();//防止重复弹出提示
              message.success('操作成功');
              closeDrawer();
              reload();
            }).catch(err => {
              //数据在APP端已经处理，弹出刷新确认
              Modal.confirm({
                title: '请确认',
                content: err,
                onOk: () => {
                  setLoading(false);
                  closeDrawer();
                  reload();
                }
              });
            });
          }
        })
      }
    });
  };

  // const doClose = () => {
  //   //闭单，弹出备注页面
  //   setAddMemoVisible(true);
  // }



  // const handleMenuClick = (e) => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       if (e.key != '3') {
  //         const title = e.item.props.children;
  //         Modal.confirm({
  //           title: '请确认',
  //           content: `确定要` + title + `吗？`,
  //           onOk: () => {
  //             setLoading(true);
  //             const newData = data ? { ...data, ...values } : values;
  //             newData.keyvalue = newData.id;
  //             if (e.key == '1') { 
  //               ChangeToRepair({ ...newData }).then(res => {
  //                 setLoading(false);
  //                 message.destroy();//防止重复弹出提示
  //                 message.success('操作成功！');
  //                 closeDrawer();
  //                 reload();
  //               }).catch(err => {
  //                 //数据在APP端已经处理，弹出刷新确认
  //                 Modal.confirm({
  //                   title: '请确认',
  //                   content: err,
  //                   onOk: () => {
  //                     setLoading(false);
  //                     closeDrawer();
  //                     reload();
  //                   }
  //                 });
  //               });
  //             }
  //             else if (e.key == '2') {
  //               setLoading(true);
  //               ChangeToComplaint({ ...newData }).then(res => {
  //                 setLoading(false);
  //                 message.destroy();//防止重复弹出提示
  //                 message.success('操作成功！');
  //                 closeDrawer();
  //                 reload();
  //               }).catch(err => {
  //                 //数据在APP端已经处理，弹出刷新确认
  //                 Modal.confirm({
  //                   title: '请确认',
  //                   content: err,
  //                   onOk: () => {
  //                     setLoading(false);
  //                     closeDrawer();
  //                     reload();
  //                   }
  //                 });
  //               });
  //             }
  //           }
  //         });
  //       }
  //       else {
  //         //闭单，弹出备注页面
  //         setAddMemoVisible(true);
  //       }
  //     }
  //   });
  // };

  //异步加载房产
  // const onLoadData = treeNode =>
  //   new Promise<any>(resolve => {
  //     if (treeNode.props.children && treeNode.props.children.length > 0 && treeNode.props.type != 'D') {
  //       resolve();
  //       return;
  //     }
  //     setTimeout(() => {
  //       GetAsynChildBuildingsForServerDesk(treeNode.props.eventKey, treeNode.props.type).then((res: any[]) => {
  //         // treeNode.props.children = res || [];
  //         let newtree = treeData.concat(res);
  //         // setTreeData([...treeData]);
  //         setTreeData(newtree);
  //       });
  //       resolve();
  //     }, 50);
  //   });

  //不好权限控制，取消
  // const menu = (
  //   <Menu onClick={handleMenuClick}>
  //     <Menu.Item key="1">转维修</Menu.Item>
  //     <Menu.Item key="2">转投诉</Menu.Item>
  //     <Menu.Item key="3">闭单</Menu.Item>
  //     {/* <Menu.Item key="4">归档</Menu.Item> */}
  //   </Menu>
  // );

  //图片上传
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const uploadButton = (
    <div>
      <Icon type="plus" />
      <div className="ant-upload-text">上传图片(5张)</div>
    </div>
  );
  const handleCancel = () => setPreviewVisible(false);
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  //重新设置state
  const handleChange = ({ fileList }) => setFileList([...fileList]);
  //等价上面的
  // const handleChange = (info) => {
  //   console.log(info);
  //   //把fileList拿出来
  //   let { fileList } = info;
  //   const status = info.file.status;
  //   if (status !== 'uploading') {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (status === 'done') {
  //     message.success(`${info.file.name} file uploaded successfully.`);
  //   } else if (status === 'error') {
  //     message.error(`${info.file.name} file upload failed.`);
  //   } 
  //   //重新设置state
  //   setFileList([...fileList]);
  // } 

  const handleRemove = (file) => {
    const fileid = file.fileid || file.response.fileid;
    RemoveFile(fileid).then(res => {
    });
  };
  //图片上传结束


  // const closeAddMemo = () => {
  //   setAddMemoVisible(false);
  // };

  //获取客户回访结果
  const GetCustEvaluate = (status) => {
    switch (status) {
      case 1:
        return '非常不满意';
      case 2:
        return '不满意';
      case 3:
        return '一般';
      case 4:
        return '满意';
      case 5:
        return '非常满意';
      default:
        return '';
    }
  };

  //回访
  const visit = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = data ? { ...data, ...values } : values;
        Visit({ ...newData, keyvalue: newData.id }).then(res => {
          message.success('回访完成');
          closeDrawer();
          reload();
        });
      }
    });
  };


  //检验
  // const check = () => {
  //   form.validateFields((errors, values) => {
  //     if (!errors) {
  //       const newData = data ? { ...data, ...values } : values;
  //       newData.testDate = values.testDate.format('YYYY-MM-DD HH:mm');
  //       Check({ ...newData, keyvalue: newData.id }).then(res => {
  //         message.success('检验完成');
  //         closeDrawer();
  //         reload();
  //       });
  //     }
  //   });
  // };

  const [selectHouseVisible, setSelectHouseVisible] = useState<boolean>(false);

  const closeSelectHouse = () => {
    setSelectHouseVisible(false);
  }

  //选择模板
  const [modalvisible, setModalVisible] = useState<boolean>(false);

  //选择打印模板
  const showModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  // const disabledTestDate = (current) => {
  //   // Can not select days before today and today
  //   return current && current.isBefore(moment(infoDetail.endDate), 'day');
  // };

  return (
    <Drawer
      title={title}
      placement="right"
      width={820}
      onClose={close}
      visible={modifyVisible}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', minHeight: 'calc(100% - 55px)' }}>
      <Spin tip="数据处理中..." spinning={loading}>
        {/* {modifyVisible ? ( */}
        <Tabs defaultActiveKey="1" >
          <TabPane tab="基础信息" key="1">
            <Form layout="vertical" hideRequiredMark>
              {!infoDetail.status || infoDetail.status == 1 ? (
                <Card className={styles.card2} hoverable>
                  <Row gutter={24}>
                    <Col lg={10}>
                      <Form.Item label="服务单号">
                        {getFieldDecorator('billCode', {
                          initialValue: infoDetail.billCode
                        })(<Input placeholder="自动获取单号" disabled />)}
                      </Form.Item>
                    </Col>

                    <Col lg={7}>
                      <Form.Item label="单据来源" required>
                        {/* {getFieldDecorator('source', {
                          initialValue: infoDetail.source == undefined ? '服务总台' : infoDetail.source
                        })(
                          <Select >
                            <Option value="服务总台">服务总台</Option>
                            <Option value="社区APP">社区APP</Option>
                            <Option value="微信公众号">微信公众号</Option>
                            <Option value="员工APP">员工APP</Option>
                          </Select>
                        )} */}
                        {getFieldDecorator('source', {
                          initialValue: '服务总台'
                        })(<Input disabled />)}

                      </Form.Item>
                    </Col>

                    <Col lg={7}>
                      <Form.Item label="单据时间">
                        <Input placeholder="自动获取时间" disabled value={infoDetail.billDate} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={5}>
                      <Form.Item label="业务类型">
                        {getFieldDecorator('billType', {
                          initialValue: infoDetail.billType === undefined ? '咨询' : infoDetail.billType
                        })(
                          <Select>
                            <Option value="咨询">咨询</Option>
                            <Option value="建议">建议</Option>
                            <Option value="报修">报修</Option>
                            <Option value="投诉">投诉</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
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
                    <Col lg={5}>
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


                    <Col lg={5}>
                      <Form.Item label="维修区域">
                        {getFieldDecorator('repairArea', {
                          initialValue: infoDetail.repairArea == undefined ? '客户区域' : infoDetail.repairArea
                        })(
                          <Select disabled={form.getFieldValue('billType') == '报修' ? false : true} >
                            <Option value="客户区域">客户区域</Option>
                            <Option value="公共区域">公共区域</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={4}>
                      <Form.Item label="是否有偿">
                        {getFieldDecorator('isPaid', {
                          initialValue: infoDetail.isPaid == undefined ? '否' : infoDetail.isPaid
                        })(
                          <Select disabled={form.getFieldValue('billType') == '报修' ? false : true} >
                            <Option value="否">否</Option>
                            <Option value="是">是</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* {form.getFieldValue('billType') == '报修' ?
                    <Row gutter={24}>
                      <Col lg={8}>
                        <Form.Item label="维修区域">
                          {getFieldDecorator('repairArea', {
                            initialValue: infoDetail.repairArea == undefined ? '客户区域' : infoDetail.repairArea
                          })(
                            <Select  >
                              <Option value="客户区域">客户区域</Option>
                              <Option value="公共区域">公共区域</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col lg={8}>
                        <Form.Item label="是否有偿">
                          {getFieldDecorator('isPaid', {
                            initialValue: infoDetail.isPaid == undefined ? '否' : infoDetail.isPaid
                          })(
                            <Select>
                              <Option value="否">否</Option>
                              <Option value="是">是</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row> : null} */}

                  <Row gutter={24}>
                    <Col lg={12}>
                      {/* <Form.Item label="所属位置" required>
                        {getFieldDecorator('roomId', {
                          initialValue: infoDetail.roomId,
                          rules: [{ required: true, message: '请选择所属位置' }],
                        })(
                          <TreeSelect
                            placeholder="请选择所属位置"
                            disabled={infoDetail.source == "微信公众号" ? true : false}
                            allowClear
                            dropdownStyle={{ maxHeight: 300 }}
                            treeData={treeData}
                            loadData={onLoadData}
                            onChange={onChange}
                            treeDataSimpleMode={true}
                          >
                          </TreeSelect>
                        )} 
                      </Form.Item> */}

                      <Form.Item label="所在位置" required>
                        {getFieldDecorator('address', {
                          initialValue: infoDetail.address,
                          rules: [{ required: true, message: '请选择所在位置' }],
                        })(
                          <Input
                            onChange={e => {
                              var newInfo = Object.assign({}, infoDetail,
                                {
                                  roomId: '',
                                  address: '',
                                  contactName: '',
                                  contactPhone: '',
                                  contactId: ''
                                });
                              setInfoDetail(newInfo);
                            }}
                            allowClear={true}

                            addonAfter={<Icon type="setting" onClick={() => {
                              setSelectHouseVisible(true);
                            }} />} />
                        )}

                        {getFieldDecorator('roomId', {
                          initialValue: infoDetail.roomId,
                        })(
                          <input type='hidden' />
                        )}

                      </Form.Item>

                    </Col>
                    <Col lg={6}>
                      <Form.Item label="联系人">
                        {getFieldDecorator('contactName', {
                          initialValue: infoDetail.contactName
                        })(<Input placeholder="自动获取联系人" disabled />)}

                        {getFieldDecorator('contactId', {
                          initialValue: infoDetail.contactId,
                        })(
                          <input type='hidden' />
                        )}
                        {getFieldDecorator('organizeId', {
                          initialValue: infoDetail.organizeId,
                        })(
                          <input type='hidden' />
                        )}
                      </Form.Item>
                    </Col>

                    <Col lg={6}>
                      <Form.Item label="联系电话">
                        {getFieldDecorator('contactPhone', {
                          initialValue: infoDetail.contactPhone
                        })(<Input placeholder="自动获取联系电话" disabled />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="详细地址">
                        {getFieldDecorator('address', {
                          initialValue: infoDetail.address
                        })(<Input placeholder="自动获取详细地址" disabled />)}
                      </Form.Item>
                    </Col>
                  </Row> */}

                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="内容" required>
                        {getFieldDecorator('contents', {
                          initialValue: infoDetail.contents,
                          rules: [{ required: true, message: '请输入内容' }],
                        })(<TextArea rows={4} placeholder="请输入内容" />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col lg={24}>
                      <div className="clearfix">
                        <Upload
                          accept='image/*'
                          action={process.env.basePath + '/ServiceDesk/Upload?keyvalue=' + keyvalue}
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={handlePreview}
                          onChange={handleChange}
                          onRemove={handleRemove}
                        >
                          {fileList.length >= 4 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </div>
                    </Col>
                  </Row>
                </Card>
              ) :
                (<Card hoverable className={infoDetail.status == 1 ? styles.card2 : styles.card} title="基础信息" >
                  <Row gutter={24}>
                    <Col lg={7}>
                      <Form.Item label="服务单号">
                        {infoDetail.billCode}
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="单据来源"  >
                        {infoDetail.source}
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="创建人">
                        {infoDetail.createUserName}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="单据时间">
                        {infoDetail.billDate}
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="联系人">
                        {infoDetail.contactName}
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="联系电话">
                        {infoDetail.contactPhone}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={7}>
                      <Form.Item label="关联单号">
                        <a onClick={() => showLink(infoDetail.businessType, infoDetail.businessCode)}>{infoDetail.businessCode}</a>
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="业务类型">
                        {infoDetail.billType}
                      </Form.Item>
                    </Col>
                    <Col lg={3}>
                      <Form.Item label="紧急程度">
                        {infoDetail.emergencyLevel}
                      </Form.Item>
                    </Col>
                    {/* <Col lg={5}>
                      <Form.Item label="位置编号">
                        {infoDetail.roomId}
                      </Form.Item>
                    </Col>   */}
                    <Col lg={3}>
                      <Form.Item label="重要程度">
                        {infoDetail.importance}
                      </Form.Item>
                    </Col>
                    {infoDetail.billType == '报修' ?
                      (<><Col lg={4}>
                        <Form.Item label="维修区域">
                          {infoDetail.repairArea}
                        </Form.Item>
                      </Col>
                        <Col lg={4}>
                          <Form.Item label="是否有偿">
                            {infoDetail.isPaid}
                          </Form.Item>
                        </Col> </>) : null}
                  </Row>

                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="联系地点">
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
                  <Row gutter={24}>
                    <Col lg={24}>
                      <div className="clearfix">
                        <Upload
                          accept='image/*'
                          // action={process.env.basePath + '/News/Upload'}
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={handlePreview}
                          disabled={true}
                        // onChange={handleChange}
                        // onRemove={handleRemove}
                        >
                          {/* 只能查看 */}
                          {/* {fileList.length > 1 ? null : uploadButton} */}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                          <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                      </div>
                    </Col>
                  </Row>
                </Card>)}

              {infoDetail.status == 3 ? (
                <Card title="回访情况" className={styles.card2} hoverable>
                  <Row gutter={24}>
                    <Col lg={6}>
                      <Form.Item label="回访方式" required>
                        {getFieldDecorator('returnVisitMode', {
                          initialValue: '在线'
                        })(
                          <Select >
                            <Option value="在线">在线</Option>
                            <Option value="电话">电话</Option>
                            <Option value="上门">上门</Option>
                            <Option value="其他">其他</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="客户评价" required>
                        {getFieldDecorator('custEvaluate', {
                          initialValue: '4'
                        })(
                          <Select >
                            <Option value="5">非常满意</Option>
                            <Option value="4">满意</Option>
                            <Option value="3">一般</Option>
                            <Option value="2">不满意</Option>
                            <Option value="1">非常不满意</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="回访时间" >
                        {getFieldDecorator('returnVisitDate', {
                        })(<Input placeholder="自动获取时间" readOnly />)}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="回访人">
                        {getFieldDecorator('returnVisiterName', {
                        })(<Input placeholder="自动获取回访人" readOnly />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="回访结果" required>
                        {getFieldDecorator('returnVisitResult', {
                          rules: [{ required: true, message: '请输入回访结果' }],
                        })(<Input placeholder="请输入回访结果" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ) : null}

              {infoDetail.status > 4 ?
                (<Card title="回访情况"
                  hoverable
                  className={infoDetail.status == 5 ? styles.card2 : styles.card}>
                  <Row gutter={24}>
                    <Col lg={6}>
                      <Form.Item label="回访方式"  >
                        {infoDetail.returnVisitMode}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="客户评价"  >
                        {GetCustEvaluate(infoDetail.custEvaluate)}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="回访时间" >
                        {infoDetail.returnVisitDate}
                      </Form.Item>
                    </Col>
                    <Col lg={6}>
                      <Form.Item label="回访人">
                        {infoDetail.returnVisiterName}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col lg={24}>
                      <Form.Item label="回访结果" >
                        {infoDetail.returnVisitResult}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>) : null}

              {/* {infoDetail.status == 4 ?
                (<Card title="检验情况" className={styles.card2} hoverable>
                  <Row gutter={24}>
                    <Col lg={7}>
                      <Form.Item label="检验时间" required>
                        {getFieldDecorator('testDate', {
                          initialValue: infoDetail.testDate,
                          rules: [{ required: true, message: '请选择检验时间' }],
                        })(
                          <DatePicker
                            format="YYYY-MM-DD HH:mm"
                            placeholder="请选择完成时间"
                            showTime={true}
                            disabledDate={disabledTestDate}
                          // disabledTime={disabledDateTime}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="检验人"  >
                        {getFieldDecorator('testerName', {
                          initialValue: infoDetail.testerName,
                        })(<Input placeholder="自动获取" readOnly />)}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="检验结果" required>
                        {getFieldDecorator('testResult', {
                          initialValue: '1',
                          rules: [{ required: true, message: '请选择检验结果' }],
                        })(
                          <Select >
                            <Option value="1">合格</Option>
                            <Option value="0">不合格</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col lg={7}>
                      <Form.Item label="检验说明"  >
                        {getFieldDecorator('testRemark', {
                          initialValue: infoDetail.testRemark
                        })(<Input placeholder="请输入检验说明" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>) : */}

              {infoDetail.status == 6 ?
                (<Card title="检验情况" className={styles.card2} hoverable>
                  <Row gutter={24}>
                    <Col lg={7}>
                      <Form.Item label="检验时间" >
                        {infoDetail.testDate}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="检验人"  >
                        {infoDetail.testerName}
                      </Form.Item>
                    </Col>
                    <Col lg={5}>
                      <Form.Item label="检验结果" required>
                        {infoDetail.testResult == 1 ? '合格' : '不合格'}
                      </Form.Item>
                    </Col>
                    <Col lg={7}>
                      <Form.Item label="检验说明"  >
                        {infoDetail.testRemark}
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                ) : null}

            </Form>
          </TabPane>
          {data ? (

            <TabPane tab="留言动态" key="2">
              <CommentBox
                data={data}
              />
            </TabPane>

          ) : null}

          {data ? (<TabPane tab="操作记录" key="3">
            <OperationRecord
              data={comments}
            />
          </TabPane>
          ) : null}
        </Tabs>
        {/* ) : null} */}
      </Spin>

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

        <Button onClick={showModal}
          disabled={loading}
          type="primary" style={{ marginRight: 8 }}>
          打印
        </Button>

        {data === undefined ? (
          <Button onClick={save} type="primary" disabled={loading} >
            保存
          </Button>) : null}
        {(infoDetail.status && infoDetail.status == 1) ? (
          <span>
            <Button style={{ marginRight: 8 }} onClick={save} type="primary" disabled={loading}>
              保存
           </Button>
            {/* <Dropdown overlay={menu} >
              <Button disabled={loading}>
                更多<Icon type="down" />
              </Button>
            </Dropdown> */}

            <AuthButton
              style={{ marginRight: 8 }}
              onClick={torepair}
              disabled={loading}
              btype="primary"
              module="Servicedesk"
              code="torepair"
            >
              转维修
           </AuthButton>

            <AuthButton
              style={{ marginRight: 8 }}
              onClick={tocomplaint}
              btype="primary"
              module="Servicedesk"
              code="tocomplaint"
              disabled={loading}>
              转投诉
           </AuthButton>

            <AuthButton
              onClick={() => setAddMemoVisible(true)}
              btype="primary"
              module="Servicedesk"
              code="close"
              disabled={loading}>
              闭单
           </AuthButton>

          </span>) : null}

        {infoDetail.status == 3 ? (
          <Button onClick={visit} type="primary">
            回访
          </Button>) : null}

        {/* {infoDetail.status == 4 ? (
          <Button onClick={check} type="primary">
            检验
          </Button>) : null} */}

        {/* {(infoDetail.status && infoDetail.status == 4) ? (
          <Button onClick={close} type="primary">
            毕单
           </Button>) : null} */}
      </div>

      <AddCloseMemo
        visible={addMemoVisible}
        closeModal={() => setAddMemoVisible(false)}
        reload={reload}
        closeDrawer={closeDrawer}
        keyvalue={keyvalue}
      />

      <SelectHouse
        visible={selectHouseVisible}
        closeModal={closeSelectHouse}
        getSelectTree={(info) => {
          if (info.value) {
            GetRoomUser(info.value).then((res: any) => {
              if (res != null) {
                var newInfo = Object.assign({}, infoDetail,
                  {
                    roomId: info.value,
                    address: info.allname,
                    contactName: res.contactName,
                    contactPhone: res.contactPhone,
                    contactId: res.custId
                  });

                setInfoDetail(newInfo);

              } else {
                var newInfo = Object.assign({}, infoDetail,
                  {
                    roomId: info.value,
                    address: info.allname,
                    contactName: '',
                    contactPhone: '',
                    contactId: ''
                  });
                setInfoDetail(newInfo);

              }
            });
          } else {
            var newInfo = Object.assign({}, infoDetail,
              {
                roomId: '',
                address: '',
                contactName: '',
                contactPhone: '',
                contactId: ''
              });
            setInfoDetail(newInfo);
          }
        }}
      />

      <SelectTemplate
        id={keyvalue}
        visible={modalvisible}
        closeModal={closeModal}
        unitId={infoDetail.roomId}
      />
    </Drawer>
  );
};

export default Form.create<ModifyProps>()(Modify);
