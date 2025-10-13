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

import { ApiResponse, Error, User, UserInput } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 创建新用户账户
   *
   * @tags Authentication
   * @name UsersRegisterCreate
   * @summary 用户注册
   * @request POST:/api/users/register
   */
  usersRegisterCreate = (data: any, params: RequestParams = {}) =>
    this.request<
      ApiResponse & {
        data?: User;
      },
      Error
    >({
      path: `/api/users/register`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 用户登录获取访问令牌
   *
   * @tags Authentication
   * @name UsersLoginCreate
   * @summary 用户登录
   * @request POST:/api/users/login
   */
  usersLoginCreate = (data: any, params: RequestParams = {}) =>
    this.request<
      ApiResponse & {
        data?: any;
      },
      Error
    >({
      path: `/api/users/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 获取系统中所有用户的列表
   *
   * @tags Users
   * @name UsersList
   * @summary 获取所有用户
   * @request GET:/api/users
   */
  usersList = (params: RequestParams = {}) =>
    this.request<
      ApiResponse & {
        data?: User[];
      },
      Error
    >({
      path: `/api/users`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description 在系统中创建一个新的用户
   *
   * @tags Users
   * @name UsersCreate
   * @summary 创建新用户
   * @request POST:/api/users
   */
  usersCreate = (data: UserInput, params: RequestParams = {}) =>
    this.request<
      ApiResponse & {
        data?: User;
      },
      Error
    >({
      path: `/api/users`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 通过用户ID获取特定用户的详细信息
   *
   * @tags Users
   * @name UsersDetail
   * @summary 根据ID获取用户
   * @request GET:/api/users/{id}
   */
  usersDetail = (id: number, params: RequestParams = {}) =>
    this.request<
      ApiResponse & {
        data?: User;
      },
      Error
    >({
      path: `/api/users/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description 更新指定用户的信息
   *
   * @tags Users
   * @name UsersUpdate
   * @summary 更新用户信息
   * @request PUT:/api/users/{id}
   */
  usersUpdate = (id: number, data: UserInput, params: RequestParams = {}) =>
    this.request<
      ApiResponse & {
        data?: User;
      },
      Error
    >({
      path: `/api/users/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 从系统中删除指定的用户
   *
   * @tags Users
   * @name UsersDelete
   * @summary 删除用户
   * @request DELETE:/api/users/{id}
   */
  usersDelete = (id: number, params: RequestParams = {}) =>
    this.request<ApiResponse, Error>({
      path: `/api/users/${id}`,
      method: "DELETE",
      format: "json",
      ...params,
    });
}
