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
 * 合同审批记录
 */
export interface htContractapprovelog {
    
   /**
   * Desc:  Default:b'0'  Nullable:False
   */
    ifVerify?: boolean;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    verifyMemo?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    action?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    contractId?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    id?: string;
}