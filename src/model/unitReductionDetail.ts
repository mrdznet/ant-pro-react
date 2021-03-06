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


/**
 * 减免费用明细
 */
export interface UnitReductionDetail {
    /**
     * 收费明细Id
     */
    billId?: string;
    /**
     * 房间id
     */
    unitId?: string;
    /**
     * 费项名称
     */
    feeName?: string;
    /**
     * 应收期间
     */
    period?: Date;
    /**
     * 计费起始日期
     */
    beginDate?: Date;
    /**
     * 计费截止日期
     */
    endDate?: Date;
    /**
     * 原金额
     */
    amount?: number;
    /**
     * 累计减免
     */
    sumReductionAmount?: number;
    /**
     * 减免金额
     */
    reductionAmount?: number;
    /**
     * 减免后金额
     */
    lastAmount?: number;
    /**
     * 备注
     */
    memo?: string;
}
