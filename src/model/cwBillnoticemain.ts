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
 * 
 */
export interface CwBillnoticemain {
    billId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    memo?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyMemo?: string;
    /**
     * Desc:单据类型  Default:  Nullable:False
     */
    billType?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyPerson?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    createDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    createUserName?: string;
    customerId?: string;
    organizeId?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    beginDate?: Date;
    /**
     * Desc:  Default:  Nullable:False
     */
    endDate?: Date;
    templateId?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    billCode?: string;
    /**
     * Desc:  Default:b'0'  Nullable:False
     */
    ifVerify?: boolean;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyDate?: Date;
    /**
     * 缴交时间距离通知单日的日期
     */
    mustDate?: Date;
}
