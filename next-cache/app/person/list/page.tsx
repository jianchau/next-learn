'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Person, PersonListResponse, PersonSearchParams } from '../types';
import { getPersonList } from '../../../api/person';

// 使用真实API调用
const fetchPersonList = async (params: PersonSearchParams): Promise<PersonListResponse> => {
  try {
    return await getPersonList(params);
  } catch (error) {
    console.error('获取人员列表失败:', error);
    // 如果API调用失败，返回空数据
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    };
  }
};

export default function PersonListPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<PersonSearchParams>({
    page: 1,
    pageSize: 10
  });
  const [total, setTotal] = useState(0);

  const loadPersons = async () => {
    setLoading(true);
    try {
      const response = await fetchPersonList(searchParams);
      setPersons(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('获取人员列表失败:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadPersons();
  }, [searchParams]);

  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword, page: 1 }));
  };

  const handleFilterChange = (field: keyof PersonSearchParams, value: any) => {
    setSearchParams(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        在职
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
        离职
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">人员管理</h1>
        <p className="text-gray-600">管理和查看所有员工信息</p>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索关键词
            </label>
            <input
              type="text"
              placeholder="姓名、邮箱或部门"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部门
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
            >
              <option value="">全部部门</option>
              <option value="技术部">技术部</option>
              <option value="产品部">产品部</option>
              <option value="设计部">设计部</option>
              <option value="运营部">运营部</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状态
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            >
              <option value="">全部状态</option>
              <option value="active">在职</option>
              <option value="inactive">离职</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSearchParams({ page: 1, pageSize: 10 })}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>

      {/* 人员列表 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              人员列表 ({total} 人)
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              添加人员
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    人员信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部门职位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    联系方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(persons || []).map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={person.avatar || 'https://via.placeholder.com/40'}
                            alt={person.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            入职时间: {person.joinDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.department}</div>
                      <div className="text-sm text-gray-500">{person.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.email}</div>
                      <div className="text-sm text-gray-500">{person.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(person.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/person/${person.id}/detail`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        查看详情
                      </Link>
                      <button className="text-gray-600 hover:text-gray-900">
                        编辑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                显示第 {(searchParams.page! - 1) * searchParams.pageSize! + 1} - {Math.min(searchParams.page! * searchParams.pageSize!, total)} 条，共 {total} 条记录
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(searchParams.page! - 1)}
                  disabled={searchParams.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  上一页
                </button>
                <span className="px-3 py-1 text-sm text-gray-700">
                  第 {searchParams.page} 页
                </span>
                <button
                  onClick={() => handlePageChange(searchParams.page! + 1)}
                  disabled={searchParams.page! * searchParams.pageSize! >= total}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}