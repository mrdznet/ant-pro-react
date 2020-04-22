//对账
import { message, Form, Modal, Button, Upload } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { CheckBill } from './Lastschrift.service';

interface CheckProps {
  visible: boolean;
  closeModal(): void;
  form: WrappedFormUtils;
  id?: string;
  reload(): void;
}

const Check = (props: CheckProps) => {
  const { visible, closeModal, form, id, reload } = props;
  const { getFieldDecorator } = form;
  const save = () => {

    if (!isUpload) {
      message.warning('请上传对账单');
      return;
    }

    const newData = { keyValue: id, uploadFile: form.getFieldValue('uploadFile') };
    CheckBill(newData).then(res => {
      message.success('对账成功');
      closeModal();
      reload();
    });
  }

  const [isUpload, setIsUpload] = useState<boolean>(false);

  const uploadProps = {
    name: 'file',
    accept: '.xls,.xlsx',
    multiple: false,
    // showUploadList: false,
    action: process.env.basePath + '/Lastschrift/Upload',
    // headers: {
    //   authorization: 'authorization-text',
    // },
    onChange(info) {
      // if (info.fileList.length > 1) {
      //   message.error('只允许上传一个文件，请删除一个'); 
      // } 
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        //设置项目图片 
        form.setFieldsValue({ uploadFile: info.file.response });
        setIsUpload(true); 
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onRemove(info) {
      setIsUpload(false);
    }
  };

  return (
    <Modal
      title="对账"
      visible={visible}
      okText="确认"
      cancelText="取消"
      onCancel={() => closeModal()}
      onOk={save}
      destroyOnClose={true}
      bodyStyle={{ background: '#f6f7fb', height: '150px' }}
      width='320px'>
      {/* <div style={{ textAlign: 'center' }}> */}
      <Upload {...uploadProps}>
        {isUpload ? null : <Button><UploadOutlined /> 请上传对账单 </Button>}
      </Upload>

      {getFieldDecorator('uploadFile', {
      })(
        <input type='hidden' />
      )}
      {/* </div> */}
    </Modal>
  );
};

export default Form.create<CheckProps>()(Check);

