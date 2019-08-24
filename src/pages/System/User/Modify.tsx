import { Form, Input, Select, Tree, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState, useContext } from 'react';
import { BaseModify, BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { SaveForm, searchUser } from './User.service';
import moment from 'moment';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  let initData = data ? data : { accountType: 2, expMode: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date();
  const [names, setNames] = useState<any[]>([]);
  const [showTime, setShowTime] = useState<boolean>(true);
  useEffect(() => {
    setShowTime(form.getFieldValue('expMode') === 2);
  }, [form]);

  const baseFormProps = { form, initData };
  const expModes: SelectItem[] = [{ label: '永久有效', value: 1 }, { label: '临时', value: 2 }];
  const accountTypes: SelectItem[] = [
    { label: '系统初始账户', value: 1 },
    { label: '员工账户', value: 2 },
    { label: '客户账户', value: 3 },
    { label: '供应商账户', value: 4 },
    { label: '其他', value: 5 },
  ];
  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.id };
    modifyData.expDate = modifyData.expDate ? modifyData.expDate.format('YYYY-MM-DD') : undefined;
    return SaveForm(modifyData);
  };
  const searchName = value => {
    searchUser(value).then(res => {
      const users = res.map(item => {
        return {
          label: item.name,
          value: item.name,
        };
      });
      setNames(users);
    });
  };

  return (
    <BaseModifyProvider {...props} name="用户" save={doSave}>
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="name"
            label="用户"
            type="autoComplete"
            onSearch={searchName}
            items={names}
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="account"
            label="账户"
            rules={[{ required: true, message: '请输入账户' }]}
          ></ModifyItem>
          <ModifyItem
            {...baseFormProps}
            field="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            type="radio"
            field="expMode"
            label="有效期"
            items={expModes}
          ></ModifyItem>
          {showTime ? (
            <ModifyItem
              {...baseFormProps}
              field="expDate"
              label="有效期限"
              type="date"
            ></ModifyItem>
          ) : null}
        </Row>

        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            wholeLine={true}
            type="textarea"
            field="description"
            label="备注"
            items={accountTypes}
          ></ModifyItem>
        </Row>
      </Form>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
import { Form, Input, Select, Tree, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useEffect, useState, useContext } from 'react';
import { BaseModify, BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { visible, data, form } = props;
  const { saveSuccess } = useContext(BaseModify);

  const doSave = dataDetail => {
    // dataDetail.keyValue = dataDetail.id;
    // SaveForm({ ...dataDetail }).then(res => {
    //   message.success('保存成功');
    //   closeDrawer();
    //   reload();
    // });
  };
  const baseFormProps = { form, data };
  const accountTypes: SelectItem[] = [
    { label: '系统初始账户', value: 1 },
    { label: '员工账户', value: 2 },
    { label: '客户账户', value: 3 },
    { label: '供应商账户', value: 4 },
    { label: '其他', value: 5 },
  ];
  
  const expModes: SelectItem[] = [
    { label: '永久有效', value: 1 },
    { label: '临时', value: 2 },
  ];
  return (
    <BaseModifyProvider {...props} name="用户">
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            type="select"
            field="accountType"
            label="类型"
            items={accountTypes}
          ></ModifyItem>
          <ModifyItem {...baseFormProps} field="organizeId" label="所属机构"></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem {...baseFormProps} field="account" label="账户"></ModifyItem>
          <ModifyItem {...baseFormProps} field="password" label="密码"></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            type="radio"
            field="expMode"
            label="有效期"
            items={expModes}
          ></ModifyItem>
          <ModifyItem
            {...baseFormProps}
            field="account"
            label="有效期限"
          ></ModifyItem>
        </Row>

        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            wholeLine={true}
            type="textarea"
            field="description"
            label="备注"
            items={accountTypes}
          ></ModifyItem>
        </Row>
      </Form>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);
