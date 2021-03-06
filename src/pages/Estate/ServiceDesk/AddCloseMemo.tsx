//闭单备注
import { message, Col, Form, Row, Modal, Input } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React from 'react';
const { TextArea } = Input;
import { Finish } from './Main.service';

interface AddCloseMemoProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  keyvalue: string;
  closeDrawer(): void;
  reload(): void;
}

const AddCloseMemo = (props: AddCloseMemoProps) => {
  const { visible, closeModal, form, keyvalue, reload, closeDrawer } = props;
  const { getFieldDecorator } = form;
  const save = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        const newData = { keyvalue: keyvalue, memo: values.memo };
        Finish({ ...newData }).then(res => {
          message.success('闭单成功');
          closeModal();
          closeDrawer();
          reload();
        });
      }
    });
  }

  return (
    <Modal
      title="闭单"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={save}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', height: '250px' }}
      width='400px' > 
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={6}>
          <Col lg={24}>
            <Form.Item >
              {getFieldDecorator('memo', {
                rules: [{ required: true, message: '请输入说明' }]
              })(<TextArea rows={9} placeholder="请输入说明" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Form.create<AddCloseMemoProps>()(AddCloseMemo);

