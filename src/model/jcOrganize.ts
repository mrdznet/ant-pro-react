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
export interface JcOrganize {
    /**
     * Desc:  Default:0  Nullable:True
     */
    category?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    deleteMark?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    innerPhone?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    outerPhone?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    chargeLeader?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    description?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    manager?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    parentId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    chargeLeaderId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    email?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    managerId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    postalcode?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    cityId?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    enabledMark?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    provinceId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    countyId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    enCode?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    shortName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    fax?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    sortCode?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    address?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    foundedTime?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    nature?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    webAddress?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    businessScope?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    fullName?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    organizeId?: string;
}
