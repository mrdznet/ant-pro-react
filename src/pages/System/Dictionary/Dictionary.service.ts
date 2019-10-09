import { getResult, objToFormdata } from "@/utils/networkUtils";
import request from "@/utils/request";
import { TreeEntity } from '@/model/models';

export function GetDataList(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Dictionary/GetPageListJson`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}

// 新增修改
export function SaveForm(data): Promise<any> {
  return request
    .post(process.env.basePath + `/Dictionary/SaveForm`, {
      data: objToFormdata(data)
    })
    .then(getResult as any);
}
 
// 删除
export function RemoveForm(keyValue): Promise<any> {
  return request
    .post(process.env.basePath + `/Dictionary/RemoveForm?keyValue=${keyValue}`, {})
    .then(getResult as any);
}
 

//获取字典分类
export function GetDataItemTreeList(): Promise<TreeEntity[]> {
  return request.get(process.env.basePath + `/Dictionary/GetDataItemTreeList`, {}).then(getResult as any);
}
