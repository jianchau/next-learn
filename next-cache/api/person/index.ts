import axios from 'axios';
import { Person, PersonListResponse, PersonDetailResponse, PersonSearchParams } from '../../app/person/types';

// 基础API配置
const API_BASE_URL = 'http://localhost:12306';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    // config.headers.Authorization = `Bearer ${token}`;
    console.log('API请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('API响应:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API响应错误:', error.response?.status, error.message);
    
    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未授权错误
      console.error('未授权访问，请重新登录');
    } else if (error.response?.status === 500) {
      // 处理服务器错误
      console.error('服务器内部错误');
    }
    
    return Promise.reject(error);
  }
);

/**
 * 获取人员列表
 * @param params 搜索参数
 * @returns Promise<PersonListResponse>
 */
export const getPersonList = async (params?: PersonSearchParams): Promise<PersonListResponse> => {
  try {
    const response = await apiClient.get<PersonListResponse>('/persons', {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        keyword: params?.keyword || '',
        department: params?.department || '',
        status: params?.status || '',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('获取人员列表失败:', error);
    throw new Error('获取人员列表失败，请稍后重试');
  }
};

/**
 * 获取人员详情
 * @param id 人员ID
 * @returns Promise<PersonDetailResponse>
 */
export const getPersonDetail = async (id: string): Promise<PersonDetailResponse> => {
  try {
    const response = await apiClient.get<PersonDetailResponse>(`/getPerson/${id}`);
    return response.data;
  } catch (error) {
    console.error('获取人员详情失败:', error);
    throw new Error('获取人员详情失败，请稍后重试');
  }
};

/**
 * 创建人员
 * @param personData 人员数据
 * @returns Promise<PersonDetailResponse>
 */
export const createPerson = async (personData: Omit<Person, 'id'>): Promise<PersonDetailResponse> => {
  try {
    const response = await apiClient.post<PersonDetailResponse>('/createPerson', personData);
    return response.data;
  } catch (error) {
    console.error('创建人员失败:', error);
    throw new Error('创建人员失败，请稍后重试');
  }
};

/**
 * 更新人员信息
 * @param id 人员ID
 * @param personData 更新的人员数据
 * @returns Promise<PersonDetailResponse>
 */
export const updatePerson = async (id: string, personData: Partial<Person>): Promise<PersonDetailResponse> => {
  try {
    const response = await apiClient.put<PersonDetailResponse>(`/updatePerson/${id}`, personData);
    return response.data;
  } catch (error) {
    console.error('更新人员信息失败:', error);
    throw new Error('更新人员信息失败，请稍后重试');
  }
};

/**
 * 删除人员
 * @param id 人员ID
 * @returns Promise<{ success: boolean; message: string }>
 */
export const deletePerson = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.delete(`/deletePerson/${id}`);
    return response.data;
  } catch (error) {
    console.error('删除人员失败:', error);
    throw new Error('删除人员失败，请稍后重试');
  }
};

/**
 * 批量删除人员
 * @param ids 人员ID数组
 * @returns Promise<{ success: boolean; message: string }>
 */
export const batchDeletePersons = async (ids: string[]): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post('/batchDeletePersons', { ids });
    return response.data;
  } catch (error) {
    console.error('批量删除人员失败:', error);
    throw new Error('批量删除人员失败，请稍后重试');
  }
};

// 导出axios实例，供其他地方使用
export { apiClient };

// 导出类型
export type { Person, PersonListResponse, PersonDetailResponse, PersonSearchParams } from '../../app/person/types';