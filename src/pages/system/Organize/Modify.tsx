import { BaseModifyProvider } from '@/components/BaseModifyDrawer/BaseModifyDrawer';
import ModifyItem, { SelectItem } from '@/components/BaseModifyDrawer/ModifyItem';
import { Form, Row } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import React, { useState, useEffect } from 'react';
import { SaveForm, searchUser, searchTypes, searchOrgs } from './Organize.service';
import { TreeNode } from 'antd/lib/tree-select';

interface ModifyProps {
  visible: boolean;
  data?: any;
  form: WrappedFormUtils<any>;
  closeDrawer(): void;
  reload(): void;
}
const Modify = (props: ModifyProps) => {
  const { data, form } = props;
  const [managers, setManagers] = useState<SelectItem[]>([]);
  const [types, setTypes] = useState<SelectItem[]>([
    {
      label: '集团',
      value: 'A',
    },
    {
      label: '区域',
      value: 'B',
    },
    {
      label: '公司',
      value: 'C',
    },
    {
      label: '管理处',
      value: 'D',
    },
  ]);
  const [orgs, setOrgs] = useState<TreeNode[]>();

  let initData = data ? data : { enabledMark: 1 };
  initData.expDate = initData.expDate ? initData.expDate : new Date();

  const baseFormProps = { form, initData };

  useEffect(() => {
    // getTypes();
    searchManager('');
    getOrgs();
  }, []);

  const doSave = dataDetail => {
    let modifyData = { ...initData, ...dataDetail, keyValue: initData.organizeId };
    return SaveForm(modifyData);
  };

  const searchManager = value => {
    searchUser(value).then(res => {
      const users = res.map(item => {
        return {
          label: item.name,
          value: item.name,
        };
      });
      setManagers(users);
    });
  };
  // const getTypes = () => {
  //   searchTypes().then(res => {
  //     const temp = res.map(item => {
  //       return {
  //         label: item.title,
  //         value: item.key,
  //       };
  //     });
  //     setTypes(temp);
  //   });
  // };

  const getOrgs = () => {
    searchOrgs().then(res => {
      setOrgs(res);
    });
  };

  return (
    <BaseModifyProvider {...props} name="机构" save={doSave}>
      <Form layout="vertical" hideRequiredMark>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="fullName"
            label="机构名称"
            rules={[{ required: true, message: '请输入机构名称' }]}
          ></ModifyItem>
          <ModifyItem
            {...baseFormProps}
            field="enCode"
            label="机构编号"
            rules={[{ required: true, message: '请输入机构编号' }]}
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="parentId"
            label="隶属上级"
            type="tree"
            treeData={orgs}
            disabled={initData.parentId === '0'}
            rules={[{ required: true, message: '请选择隶属上级' }]}
          ></ModifyItem>{' '}
          <ModifyItem
            {...baseFormProps}
            field="manager"
            label="负责人"
            type="autoComplete"
            onSearch={searchManager}
            items={managers}
          ></ModifyItem>
        </Row>

        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            field="category"
            label="类型"
            type="select"
            items={types}
            rules={[{ required: true, message: '请选择类型' }]}
          ></ModifyItem>{' '}
          <ModifyItem
            {...baseFormProps}
            field="createDate"
            label="成立时间"
            type="date"
          ></ModifyItem>
        </Row>
        <Row gutter={24}>
          <ModifyItem {...baseFormProps} field="telPhone" label="电话"></ModifyItem>{' '}
        </Row>

        <Row gutter={24}>
          <ModifyItem
            {...baseFormProps}
            wholeLine={true}
            type="textarea"
            field="description"
            label="备注"
          ></ModifyItem>
        </Row>
      </Form>
    </BaseModifyProvider>
  );
};

export default Form.create<ModifyProps>()(Modify);