/**
 * A6资产管理系统接口
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { LeaseContractHouseDTO } from './leaseContractHouseDTO';


/**
 * 合同信息
 */
export interface LeaseContractDTO {
  /**
   * 唯一键
   */
  id?: string;
  /**
   * 合同编号
   */
  no?: string;
  /**
   * 跟进人代码
   */
  followerId?: string;
  /**
   * 跟进人
   */
  follower?: string;
  /**
   * 租赁数量
   */
  leaseSize?: number;
  /**
   * 合同签约日期
   */
  contractStartDate?: Date;
  /**
   * 合同计租日期
   */
  billingDate?: Date;
  /**
   * 合同结束日期
   */
  contractEndDate?: Date;
  /**
   * 单价保留小数点位数
   */
  calcPrecision?: number;
  /**
   * 计算精度的方式  0-精确计算结果保留2位小数  1-每步计算保留2位小数
   */
  calcPrecisionMode?: string;
  /**
   * 租客代码
   */
  customerId?: string;
  /**
   * 租客名称
   */
  customer?: string;
  /**
   * 行业
   */
  industry?: string;
//   /**
//  * 行业
//  */
//   industryId?: string;
  /**
   * 法人
   */
  legalPerson?: string;
  /**
   * 签订人代码
   */
  signerId?: string;
  /**
   * 签订人
   */
  signer?: string;
  /**
   * 租客联系人
   */
  customerContact?: string;

  /**
     * 租客联系人
     */
  customerContactId?: string;

  /**
   * 滞纳金比例
   */
  lateFee?: number;
  /**
   * 滞纳金比例单位
   */
  lateFeeUnit?: string;
  /**
   * 滞纳金上限
   */
  maxLateFee?: number;
  /**
   * 滞纳金上限单位
   */
  maxLateFeeUnit?: string;
  /**
   * 合同状态
   */
  status?: string;
  /**
   * 条款单价
   */
  leasePrice?: number;
  /**
   * 租出合同房源
   */
  houseList?: Array<LeaseContractHouseDTO>;
  /**
   * 合同条款Id
   */
  chargeId?: string;

 /**
   * 计费单元Id
   */
  billUnitId?: string;
   /**
   * 机构Id
   */
  organizeId?: string;
  
}
