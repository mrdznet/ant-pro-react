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
export interface JcAccount {
    
    /**
     * Desc:  Default:1  Nullable:True
     */
    enabledMark?: number;
    /**
     * Desc:  Default:1  Nullable:False
     */
    isBS?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    secretkey?: string;
    /**
     * Desc:  Default:1  Nullable:True
     */
    checkOnLine?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    expDate?: Date;
  
    /**
     * Desc:  Default:  Nullable:True
     */
    sourceId?: string;
   
    /**
     * Desc:  Default:1  Nullable:True
     */
    expMode?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    lastVisit?: Date;
    /**
     * Desc:  Default:1  Nullable:True
     */
    userOnLine?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
 
    /**
     * Desc:  Default:1  Nullable:True
     */
    logOnCount?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    headImg?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    name?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    id?: string;
   
    /**
     * Desc:  Default:  Nullable:True
     */
    account?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    customerCode?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    ipAddress?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    organizeId?: string;
    /**
     * Desc:  Default:1  Nullable:True
     */
    accountType?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    description?: string;
    /**
     * Desc:  Default:1  Nullable:False
     */
    isApp?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    password?: string;
}
