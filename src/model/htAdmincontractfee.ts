/**
 * A6物业管理系统接口
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
export interface HtAdmincontractfee {
    /**
     * Desc:  Default:  Nullable:False
     */
    id?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    contractId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    beginDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    endDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    feeItemId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    feeItemName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    amount?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
}
