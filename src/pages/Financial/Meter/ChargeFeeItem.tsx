//添加费项
import { Col, Form, Row, Modal } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState } from 'react';
import { GetReceivablesFeeItemTreeJson } from './Meter.service';
import './style.less';
import LeftTree from '../LeftTree';
// const Option = Select.Option;

interface ChargeFeeItemProps {
  visible: boolean;
  closeModal(): void;
  getSelectTree(id): void;
  form: WrappedFormUtils;
}

const ChargeFeeItem = (props: ChargeFeeItemProps) => {
  const { visible, closeModal, getSelectTree } = props;
  // const [treeData, setTreeData] = useState<TreeEntity[]>([]);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectId, setSelectId] = useState<any>({});
  useEffect(() => {
    if (visible) {
      GetReceivablesFeeItemTreeJson().then(res => {
        // const treeList = (res || []).map(item => {
        //   return Object.assign({}, item, {
        //     id: item.key,
        //     text: item.text,
        //     parentId: item.parentId
        //   });
        // });
        setTreeData(res || []);
      });
    }
  }, [visible]);
  const pushSelectKey = () => {
    getSelectTree(selectId);
    closeModal();
  }
  return (
    <Modal
      title="选择收费项目"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => pushSelectKey()}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'
    >
      {/* <Row gutter={24}>
        <Col span={8}>
          <Select placeholder="=请选择=" style={{width:'100%'}}>
            <Option value="Code">编号</Option>
            <Option value="Name">名称</Option>
          </Select>
        </Col>
        <Col span={18}>
          <Input placeholder="请输入要查询的关键字"/>
        </Col>
        <Col span={6}>
          <Button style={{width:'100%'}}>
          <Icon type="search" />查询</Button>
        </Col>
      </Row> */}
      <Row>
        <Col style={{ height: '420px', overflow: 'auto' }}>
          <LeftTree
            treeData={treeData}
            selectTree={(id, item) => {
              //console.log(item);
              setSelectId({ id: id, name: item.selectedNodes[0].props.title });
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};
export default Form.create<ChargeFeeItemProps>()(ChargeFeeItem);

