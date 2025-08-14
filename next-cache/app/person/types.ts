// 人员相关的类型定义

export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'active' | 'inactive';
  bio?: string;
  skills?: string[];
  location: string;
}

export interface PersonListResponse {
  data: Person[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PersonDetailResponse {
  data: Person;
}

export interface PersonSearchParams {
  keyword?: string;
  department?: string;
  status?: 'active' | 'inactive';
  page?: number;
  pageSize?: number;
}