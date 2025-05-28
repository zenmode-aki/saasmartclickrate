'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  MousePointer, 
  TrendingUp, 
  Calculator,
  LogOut,
  Info,
  Plus,
  Calendar,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ClickData {
  date: string;
  rootViews: number;
  searchViews: number;
  servicesViews: number;
  downloadViews: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clickData, setClickData] = useState<ClickData[]>([]);
  
  // 入力フォーム用の状態
  const [formData, setFormData] = useState({
    date: '',
    rootViews: '',
    searchViews: '',
    servicesViews: '',
    downloadViews: ''
  });

  useEffect(() => {
    // 認証チェック
    const auth = localStorage.getItem('isAuthenticated');
    if (!auth) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }

    // 保存されたデータを読み込み
    const savedData = localStorage.getItem('clickAnalyticsData');
    if (savedData) {
      setClickData(JSON.parse(savedData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newData: ClickData = {
      date: formData.date,
      rootViews: parseInt(formData.rootViews),
      searchViews: parseInt(formData.searchViews),
      servicesViews: parseInt(formData.servicesViews),
      downloadViews: parseInt(formData.downloadViews)
    };

    const updatedData = [...clickData, newData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    setClickData(updatedData);
    localStorage.setItem('clickAnalyticsData', JSON.stringify(updatedData));
    
    // フォームをリセット
    setFormData({
      date: '',
      rootViews: '',
      searchViews: '',
      servicesViews: '',
      downloadViews: ''
    });
  };

  // クリック率計算
  const calculateClickRates = () => {
    if (clickData.length === 0) return null;
    
    const latest = clickData[clickData.length - 1];
    const rootToSearch = ((latest.searchViews / latest.rootViews) * 100).toFixed(1);
    const rootToServices = ((latest.servicesViews / latest.rootViews) * 100).toFixed(1);
    const rootToDownload = ((latest.downloadViews / latest.rootViews) * 100).toFixed(1);
    
    return { rootToSearch, rootToServices, rootToDownload, latest };
  };

  const rates = calculateClickRates();

  // チャート用データ
  const chartData = clickData.map(data => ({
    date: new Date(data.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
    'ルート→検索': parseFloat(((data.searchViews / data.rootViews) * 100).toFixed(1)),
    'ルート→サービス': parseFloat(((data.servicesViews / data.rootViews) * 100).toFixed(1)),
    'ルート→ダウンロード': parseFloat(((data.downloadViews / data.rootViews) * 100).toFixed(1))
  }));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl mr-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  SaasSmart Analytics
                </h1>
                <p className="text-xs text-gray-500">クリック率分析ダッシュボード</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 説明セクション */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-xl mr-4">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-blue-900 mb-3">
                📊 使用方法
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-blue-800">
                    <p className="font-medium">1. Google Analyticsでデータ確認</p>
                    <p className="text-sm text-blue-700">期間を指定して各ページの表示回数を確認</p>
                  </div>
                  <div className="text-blue-800">
                    <p className="font-medium">2. フォームに数値を入力</p>
                    <p className="text-sm text-blue-700">下記フォームに数値を入力してクリック率を計算</p>
                  </div>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="font-semibold text-blue-900 mb-2">📋 タグの説明</p>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">/</span> ホーム画面（ルート）</p>
                    <p><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">/search</span> 検索・クリック後の画面</p>
                    <p><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">/services</span> 特定サービス詳細画面</p>
                    <p><span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">/service-material/download</span> 資料DL画面</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIカード */}
        {rates && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ルート画面表示数</p>
                  <p className="text-3xl font-bold text-gray-900">{rates.latest.rootViews.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">総訪問者数</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ルート→検索率</p>
                  <p className="text-3xl font-bold text-emerald-600">{rates.rootToSearch}%</p>
                  <p className="text-xs text-gray-500 mt-1">検索への遷移</p>
                </div>
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <MousePointer className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ルート→サービス率</p>
                  <p className="text-3xl font-bold text-purple-600">{rates.rootToServices}%</p>
                  <p className="text-xs text-gray-500 mt-1">サービス詳細へ</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ルート→DL率</p>
                  <p className="text-3xl font-bold text-orange-600">{rates.rootToDownload}%</p>
                  <p className="text-xs text-gray-500 mt-1">最終コンバージョン</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Calculator className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* データ入力フォーム */}
          <div className="xl:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-xl mr-3">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  データ入力
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    日付
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ルート画面（/）表示数
                  </label>
                  <input
                    type="number"
                    value={formData.rootViews}
                    onChange={(e) => setFormData({...formData, rootViews: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50"
                    placeholder="例: 1,000"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    検索画面（/search）表示数
                  </label>
                  <input
                    type="number"
                    value={formData.searchViews}
                    onChange={(e) => setFormData({...formData, searchViews: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50"
                    placeholder="例: 300"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    サービス画面（/services）表示数
                  </label>
                  <input
                    type="number"
                    value={formData.servicesViews}
                    onChange={(e) => setFormData({...formData, servicesViews: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50"
                    placeholder="例: 150"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ダウンロード画面（/service-material/download）表示数
                  </label>
                  <input
                    type="number"
                    value={formData.downloadViews}
                    onChange={(e) => setFormData({...formData, downloadViews: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white/50"
                    placeholder="例: 50"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  データを追加
                </button>
              </form>
            </div>
          </div>

          {/* チャート */}
          <div className="xl:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                クリック率推移
              </h2>
              
              {chartData.length > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, '']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ルート→検索" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ルート→サービス" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="ルート→ダウンロード" 
                        stroke="#f59e0b" 
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-emerald-50 rounded-xl">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs font-medium text-emerald-700">ルート→検索</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs font-medium text-purple-700">ルート→サービス</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs font-medium text-orange-700">ルート→ダウンロード</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">データを入力するとチャートが表示されます</p>
                  <p className="text-sm">左側のフォームからデータを追加してください</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* データ履歴テーブル */}
        {clickData.length > 0 && (
          <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              データ履歴
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      日付
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ルート表示数
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ルート→検索率
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ルート→サービス率
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      ルート→DL率
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clickData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(data.date).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.rootViews.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                        {((data.searchViews / data.rootViews) * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                        {((data.servicesViews / data.rootViews) * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                        {((data.downloadViews / data.rootViews) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 