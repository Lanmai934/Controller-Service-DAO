/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface User {
  /**
   * 用户ID
   * @example 1
   */
  id?: number;
  /**
   * 用户姓名
   * @minLength 2
   * @maxLength 50
   * @example "张三"
   */
  name: string;
  /**
   * 用户邮箱
   * @format email
   * @example "zhangsan@example.com"
   */
  email: string;
  /**
   * 用户年龄
   * @min 0
   * @max 150
   * @example 25
   */
  age?: number;
  /**
   * 手机号码
   * @example "13800138000"
   */
  phone?: string;
  /**
   * 用户地址
   * @example "北京市朝阳区"
   */
  address?: string;
  /**
   * 用户状态
   * @example "active"
   */
  status?: "active" | "inactive" | "deleted";
  /**
   * 创建时间
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt?: string;
  /**
   * 更新时间
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt?: string;
}

export interface UserInput {
  /**
   * 用户姓名
   * @minLength 2
   * @maxLength 50
   * @example "张三"
   */
  name: string;
  /**
   * 用户邮箱
   * @format email
   * @example "zhangsan@example.com"
   */
  email: string;
  /**
   * 用户年龄
   * @min 0
   * @max 150
   * @example 25
   */
  age?: number;
  /**
   * 手机号码
   * @example "13800138000"
   */
  phone?: string;
  /**
   * 用户地址
   * @example "北京市朝阳区"
   */
  address?: string;
}

export interface ApiResponse {
  /**
   * 请求是否成功
   * @example true
   */
  success?: boolean;
  /**
   * 响应消息
   * @example "操作成功"
   */
  message?: string;
  /** 响应数据 */
  data?: any;
  /** 错误信息 */
  error?: string;
}

export interface Error {
  /** @example false */
  success?: boolean;
  /**
   * 错误消息
   * @example "操作失败"
   */
  message?: string;
  /** 详细错误信息 */
  error?: string;
}
