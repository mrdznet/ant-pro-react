//添加编辑费项
import {  Col,   Form,  Row,Modal, message,Tree} from 'antd';
import { TreeEntity } from '@/model/models';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import {SaveVirtualForm} from './Meter.service';
import { GetQuickVirtualMeterTree } from '@/services/commonItem'; 
import './style.less';


interface SelectReadingMeterVirtualProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  readingDetail:any;
  reload():any;
  // id?:string;
}

const SelectReadingMeterVirtual = (props: SelectReadingMeterVirtualProps) => {
  const { visible, closeModal,readingDetail, reload} = props;
  const [feeTreeData,setFeeTreeData]=useState<TreeEntity[]>([]);
  const [feeData,setFeeData]=useState<any>();
  useEffect(() => {
    if(visible){
      GetQuickVirtualMeterTree().then(res=>{
        setFeeTreeData(res);
      });
    }
  }, [visible]);
  const renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      return (
        <Tree.TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderTreeNodes(item.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={item.key} {...item} dataRef={item} />;
  });
  return (
    <Modal
      title="选择收费项目"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if(feeData.length==0){
          message.warning('请选择虚拟费表');
        }else{
          var newdata=Object.assign({},readingDetail,{meters:JSON.stringify(feeData)});
          console.log(newdata);
          SaveVirtualForm(newdata).then(res=>{
            closeModal();
            reload();
            message.success('数据保存成功');
          }).catch(()=>{
            message.warning('数据保存错误');
          })
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='600px'
    >
      <Row gutter={8} style={{height:'400px',overflow:'auto' ,marginTop:'5px',backgroundColor:'rgb(255,255,255)'}}>
        <Col span={12} style={{height:'395px',overflow:'auto' }}>
          <Tree
            checkable
            onCheck={(checkedKeys)=>{
              setFeeData(checkedKeys);
            }}
            showLine>
            {renderTreeNodes(feeTreeData)}
          </Tree>
        </Col>
      </Row>
    </Modal>
  );
};

export default Form.create<SelectReadingMeterVirtualProps>()(SelectReadingMeterVirtual);

