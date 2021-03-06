//选择维保设备，修改为同步树
import { Spin, Col, Form, Row, Modal, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState } from 'react';
import { SavePlanPointForm } from './Main.service';
import SelectTree2 from '../SelectTree2';
interface SelectDeviceProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  entity: any;
  treeData: any[];
  reload(): void;
}

const SelectDevice = (props: SelectDeviceProps) => {
  const { reload, visible, closeModal, entity, treeData } = props;
  // useEffect(() => {
  //   if (visible) {
  //   }
  // }, [visible]);

  const [unitData, setUnitData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Modal
      title="选择设备"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={() => {
        if (unitData.length == 0) {
          message.warning('请选择设备');
        } else {
          setLoading(true);
          var newdata = Object.assign({}, entity, { units: JSON.stringify(unitData) });
          SavePlanPointForm(newdata).then(res => {
            setLoading(false);
            closeModal();
            message.success('添加成功');
            reload();
          })
          //.catch(() => {
          //message.warning('数据保存错误');
          //});
        }
      }}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb' }}
      width='400px'
    >
      {/* <Row gutter={8}>
        <Col span={18}>
          <Input placeholder="请输入要查询的关键字" />
        </Col>
        <Col span={6}>
          <Button style={{ width: '100%' }}>
            <Icon type="search" />查询</Button>
        </Col>
      </Row> */}
      {/* <Row style={{ height: '400px', overflow: 'auto', marginTop: '5px', backgroundColor: 'rgb(255,255,255)' }}> */}
      <Spin tip="数据处理中..." spinning={loading}>
        <Row>
          <Col style={{ height: '420px', overflow: 'auto' }}>
            {/* <AsynSelectTree
            parentid={'0'}
            getCheckedKeys={(keys)=>{
              setUnitData(keys);
            }} 
            selectTree={(id, type, info?) => {
            }}
          /> */}

            <SelectTree2
              checkable={true}
              treeData={treeData}
              GetCheckedKeys={(keys) => {
                setUnitData(keys);
              }}
              selectTree={(id, type, info?) => {
              }}
            />

          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};
export default Form.create<SelectDeviceProps>()(SelectDevice);

