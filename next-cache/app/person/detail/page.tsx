'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Person, PersonDetailResponse } from '../types';
import { getPersonDetail } from '../../../api/person';

// 使用真实API调用
const fetchPersonDetail = async (id: string): Promise<PersonDetailResponse> => {
  try {
    return await getPersonDetail(id);
  } catch (error) {
    console.error('获取人员详情失败:', error);
    throw error;
  }
};

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const personId = params.id as string;

  useEffect(() => {
    const loadPersonDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchPersonDetail(personId);
        setPerson(response.data);
      } catch (err) {
        setError('获取人员详情失败');
        console.error('获取人员详情失败:', err);
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      loadPersonDetail();
    }
  }, [personId]);

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
        在职
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
        离职
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || '人员不存在'}</div>
          <Link
            href="/person/list"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 导航栏 */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/person/list" className="hover:text-blue-600">
            人员管理
          </Link>
          <span>/</span>
          <span className="text-gray-900">{person.name}</span>
        </nav>
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：基本信息卡片 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <img
                className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
                src={person.avatar || 'https://via.placeholder.com/200'}
                alt={person.name}
              />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{person.name}</h1>
              <p className="text-gray-600 mb-4">{person.position}</p>
              {getStatusBadge(person.status)}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-900">{person.email}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-900">{person.phone}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-900">{person.location}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-gray-900">{person.department}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                <span className="text-gray-900">入职时间: {person.joinDate}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  编辑信息
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  发送消息
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：详细信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 个人简介 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">个人简介</h2>
            <p className="text-gray-700 leading-relaxed">
              {person.bio || '暂无个人简介'}
            </p>
          </div>

          {/* 技能标签 */}
          {person.skills && person.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">专业技能</h2>
              <div className="flex flex-wrap gap-2">
                {person.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 工作信息 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">工作信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  所属部门
                </label>
                <p className="text-gray-900">{person.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  职位
                </label>
                <p className="text-gray-900">{person.position}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  入职时间
                </label>
                <p className="text-gray-900">{person.joinDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  工作状态
                </label>
                <div>{getStatusBadge(person.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  工作地点
                </label>
                <p className="text-gray-900">{person.location}</p>
              </div>
            </div>
          </div>

          {/* 操作历史 */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">更新了个人资料</p>
                  <p className="text-xs text-gray-500">2024-01-15 14:30</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">完成了项目里程碑</p>
                  <p className="text-xs text-gray-500">2024-01-10 09:15</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900">参加了团队会议</p>
                  <p className="text-xs text-gray-500">2024-01-08 16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 返回按钮 */}
      <div className="mt-8">
        <Link
          href="/person/list"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回人员列表
        </Link>
      </div>
    </div>
  );
}