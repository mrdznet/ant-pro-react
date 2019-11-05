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
export interface GmParkingdetail {
    /**
     * Desc:  Default:  Nullable:True
     */
    cardNo?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    endRentDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    ownerName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    carNo?: string;
    /**
     * Desc:  Default:  Nullable:False
     */
    id?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    parkingId?: string;
    /**
     * Desc:计费面积  Default:  Nullable:True
     */
    chargingArea?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    memo?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    parkingNature?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    color?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    parkingType?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    createDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserId?: string;
    /**
     * Desc:  Default:0  Nullable:True
     */
    state?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    modifyUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    tenantId?: string;
    /**
     * Desc:建筑面积  Default:  Nullable:True
     */
    area?: number;
    /**
     * Desc:  Default:  Nullable:True
     */
    createUserName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    organizeId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    tenantName?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    beginRentDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    deliveryDate?: Date;
    /**
     * Desc:  Default:  Nullable:True
     */
    ownerId?: string;
    /**
     * Desc:  Default:  Nullable:True
     */
    vehicleBrand?: string;
}
