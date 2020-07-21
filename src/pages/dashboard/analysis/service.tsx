//分析页面数据

import request from '@/utils/request';
import { getResult } from '@/utils/networkUtils';

//获取机构

//只加载管理处,子级不可展开
export async function GetOrgs(): Promise<any[]> {
  return request.get(process.env.basePath + `/Common/GetBIOrgs`).then(getResult as any);
}


export async function fakeChartData(orgId: any, orgType: any) { 
  
  //return request('/api/fake_chart_data'); 
  //获取后台分析数据
  return request.get(process.env.basePath
    + `/Dashboard/GetDashboardAnalysis?orgId=${orgId}&orgType=${orgType}`).then(getResult as any);

  // return {
  //   "visitData":
  //     [{ "x": "2019-08-20", "y": 9 },
  //     { "x": "2019-08-24", "y": 5 }, { "x": "2019-08-25", "y": 4 },
  //     { "x": "2019-08-26", "y": 2 }, { "x": "2019-08-27", "y": 4 },
  //     { "x": "2019-08-28", "y": 7 }, { "x": "2019-08-29", "y": 5 },
  //     { "x": "2019-08-30", "y": 6 }, { "x": "2019-08-31", "y": 5 },
  //     { "x": "2019-09-01", "y": 9 }, { "x": "2019-09-02", "y": 6 },
  //     { "x": "2019-09-03", "y": 3 }, { "x": "2019-09-04", "y": 1 },
  //     { "x": "2019-09-05", "y": 5 }, { "x": "2019-09-06", "y": 3 },
  //     { "x": "2019-09-07", "y": 6 }, { "x": "2019-09-08", "y": 5 }],
  //   "visitData2": [{ "x": "2019-08-23", "y": 1 },
  //   { "x": "2019-08-24", "y": 6 },
  //   { "x": "2019-08-25", "y": 4 },
  //   { "x": "2019-08-26", "y": 8 },
  //   { "x": "2019-08-27", "y": 3 },
  //   { "x": "2019-08-28", "y": 7 },
  //   { "x": "2019-08-29", "y": 2 }],
  //   "salesData": [{ "x": "1月", "y": 795 },
  //   { "x": "2月", "y": 717 },
  //   { "x": "3月", "y": 454 },
  //   { "x": "4月", "y": 818 },
  //   { "x": "5月", "y": 365 },
  //   { "x": "6月", "y": 419 },
  //   { "x": "7月", "y": 299 },
  //   { "x": "8月", "y": 908 },
  //   { "x": "9月", "y": 281 },
  //   { "x": "10月", "y": 1012 },
  //   { "x": "11月", "y": 826 },
  //   { "x": "12月", "y": 632 }],
  //   "searchData": [{ "index": 1, "keyword": "搜索关键词-0", "count": 549, "range": 71, "status": 1 },
  //   { "index": 2, "keyword": "搜索关键词-1", "count": 509, "range": 10, "status": 1 },
  //   { "index": 3, "keyword": "搜索关键词-2", "count": 959, "range": 60, "status": 1 },
  //   { "index": 4, "keyword": "搜索关键词-3", "count": 173, "range": 79, "status": 1 },
  //   { "index": 5, "keyword": "搜索关键词-4", "count": 846, "range": 59, "status": 1 },
  //   { "index": 6, "keyword": "搜索关键词-5", "count": 937, "range": 27, "status": 0 },
  //   { "index": 7, "keyword": "搜索关键词-6", "count": 371, "range": 92, "status": 1 },
  //   { "index": 8, "keyword": "搜索关键词-7", "count": 416, "range": 53, "status": 1 },
  //   { "index": 9, "keyword": "搜索关键词-8", "count": 579, "range": 37, "status": 1 },
  //   { "index": 10, "keyword": "搜索关键词-9", "count": 542, "range": 52, "status": 0 },
  //   { "index": 11, "keyword": "搜索关键词-10", "count": 747, "range": 81, "status": 0 },
  //   { "index": 12, "keyword": "搜索关键词-11", "count": 415, "range": 99, "status": 0 },
  //   { "index": 13, "keyword": "搜索关键词-12", "count": 849, "range": 16, "status": 1 },
  //   { "index": 14, "keyword": "搜索关键词-13", "count": 168, "range": 78, "status": 1 },
  //   { "index": 15, "keyword": "搜索关键词-14", "count": 757, "range": 96, "status": 1 },
  //   { "index": 16, "keyword": "搜索关键词-15", "count": 652, "range": 8, "status": 1 }],

  //   "offlineData":
  //     [{ "name": "管理处 0", "cvr": 0.2 },
  //     { "name": "管理处 1", "cvr": 0.4 },
  //     { "name": "管理处 2", "cvr": 0.8 },
  //     { "name": "管理处 3", "cvr": 0.5 },
  //     { "name": "管理处 4", "cvr": 0.6 },
  //     { "name": "管理处 5", "cvr": 0.2 },
  //     { "name": "管理处 6", "cvr": 0.3 },
  //     { "name": "管理处 7", "cvr": 0.5 },
  //     { "name": "管理处 8", "cvr": 0.1 },
  //     { "name": "管理处 9", "cvr": 0.1 }],

  //   "offlineChartData":
  //     [{ "x": 1566541196496, "y1": 53, "y2": 64 },
  //     { "x": 1566542996496, "y1": 89, "y2": 94 },
  //     { "x": 1566544796496, "y1": 70, "y2": 97 },
  //     { "x": 1566546596496, "y1": 41, "y2": 59 },
  //     { "x": 1566548396496, "y1": 25, "y2": 92 },
  //     { "x": 1566550196496, "y1": 26, "y2": 49 },
  //     { "x": 1566551996496, "y1": 55, "y2": 78 },
  //     { "x": 1566553796496, "y1": 99, "y2": 67 },
  //     { "x": 1566555596496, "y1": 64, "y2": 45 },
  //     { "x": 1566557396496, "y1": 96, "y2": 17 },
  //     { "x": 1566559196496, "y1": 31, "y2": 33 },
  //     { "x": 1566560996496, "y1": 27, "y2": 95 },
  //     { "x": 1566562796496, "y1": 48, "y2": 12 },
  //     { "x": 1566564596496, "y1": 37, "y2": 68 },
  //     { "x": 1566566396496, "y1": 14, "y2": 63 },
  //     { "x": 1566568196496, "y1": 18, "y2": 59 },
  //     { "x": 1566569996496, "y1": 36, "y2": 94 },
  //     { "x": 1566571796496, "y1": 17, "y2": 11 },
  //     { "x": 1566573596496, "y1": 66, "y2": 45 },
  //     { "x": 1566575396496, "y1": 106, "y2": 90 }],

  //   "feeTypeData":
  //     [{ "x": "物业费", "y": 4544 },
  //     { "x": "电费", "y": 3321 },
  //     { "x": "水费", "y": 3113 },
  //     { "x": "车位服务费", "y": 2341 },
  //     { "x": "车位停放费", "y": 1231 },
  //     { "x": "其他", "y": 1231 }],
  //   "salesTypeDataOnline": [{ "x": "物业费", "y": 244 },
  //   { "x": "电费", "y": 321 },
  //   { "x": "水费", "y": 311 },
  //   { "x": "车位服务费", "y": 41 },
  //   { "x": "车位停放费", "y": 121 },
  //   { "x": "其他", "y": 111 }],
  //   "salesTypeDataOffline": [{ "x": "物业费", "y": 99 },
  //   { "x": "电费", "y": 188 },
  //   { "x": "水费", "y": 344 },
  //   { "x": "车位服务费", "y": 255 },
  //   { "x": "其他", "y": 65 }],
  //   "radarData": [{ "name": "个人", "label": "引用", "value": 10 },
  //   { "name": "个人", "label": "口碑", "value": 8 },
  //   { "name": "个人", "label": "产量", "value": 4 },
  //   { "name": "个人", "label": "贡献", "value": 5 },
  //   { "name": "个人", "label": "热度", "value": 7 },
  //   { "name": "团队", "label": "引用", "value": 3 },
  //   { "name": "团队", "label": "口碑", "value": 9 },
  //   { "name": "团队", "label": "产量", "value": 6 },
  //   { "name": "团队", "label": "贡献", "value": 3 },
  //   { "name": "团队", "label": "热度", "value": 1 },
  //   { "name": "部门", "label": "引用", "value": 4 },
  //   { "name": "部门", "label": "口碑", "value": 1 },
  //   { "name": "部门", "label": "产量", "value": 6 },
  //   { "name": "部门", "label": "贡献", "value": 5 },
  //   { "name": "部门", "label": "热度", "value": 7 }]
  // }

}
