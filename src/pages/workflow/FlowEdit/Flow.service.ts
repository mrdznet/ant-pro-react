import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowDesigner/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
// 逻辑删除
export function RemoveForm(keyvalue): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowDesigner/RemoveForm?keyvalue=${keyvalue}`, {})
    .then(getResult as any);
}


//获取分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/FlowDesigner/GetDataItemTreeList`, {}).then(getResult as any);
}

export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/FlowDesigner/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
//获取角色
export function GetTreeRoleJson(): Promise<any[]> { 
  return request
    .get(process.env.basePath + `/Role/GetTreeRoleJson`)
    .then(getResult as any);
}