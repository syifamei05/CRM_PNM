// components/AuditLog.tsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, User, Calendar, Activity, BarChart3 } from 'lucide-react';

const ACTION_COLORS = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  VIEW: 'bg-gray-100 text-gray-800',
  EXPORT: 'bg-purple-100 text-purple-800',
  LOGIN: 'bg-indigo-100 text-indigo-800',
  LOGOUT: 'bg-orange-100 text-orange-800',
};

// Data dummy untuk audit logs
const dummyLogs = [
  {
    id: 1,
    user: {
      userID: 'admin',
      role: 'ADMIN'
    },
    action: 'LOGIN',
    module: 'SYSTEM',
    description: 'User berhasil login ke sistem',
    endpoint: '/api/auth/login',
    ip_address: '192.168.1.100',
    timestamp: '2024-01-15T08:30:00Z',
    is_success: true
  },
  {
    id: 2,
    user: {
      userID: 'john_doe',
      role: 'USER'
    },
    action: 'CREATE',
    module: 'INVESTASI',
    description: 'Membuat data investasi baru - PT. ABC Corporation',
    endpoint: '/api/investments',
    ip_address: '192.168.1.101',
    timestamp: '2024-01-15T09:15:00Z',
    is_success: true
  },
  {
    id: 3,
    user: {
      userID: 'jane_smith',
      role: 'MANAGER'
    },
    action: 'UPDATE',
    module: 'PASAR',
    description: 'Memperbarui analisis pasar saham',
    endpoint: '/api/market-analysis',
    ip_address: '192.168.1.102',
    timestamp: '2024-01-15T10:45:00Z',
    is_success: true
  },
  {
    id: 4,
    user: {
      userID: 'bob_wilson',
      role: 'ANALYST'
    },
    action: 'EXPORT',
    module: 'LIKUIDITAS',
    description: 'Mengekspor laporan likuiditas bulanan',
    endpoint: '/api/liquidity/export',
    ip_address: '192.168.1.103',
    timestamp: '2024-01-15T11:20:00Z',
    is_success: true
  },
  {
    id: 5,
    user: {
      userID: 'alice_brown',
      role: 'COMPLIANCE'
    },
    action: 'VIEW',
    module: 'KEPATUHAN',
    description: 'Melihat laporan kepatuhan regulasi',
    endpoint: '/api/compliance/reports',
    ip_address: '192.168.1.104',
    timestamp: '2024-01-15T13:10:00Z',
    is_success: true
  }
];

// Data dummy untuk statistics
const dummyStats = {
  today: [{ count: '12' }],
  week: [{ count: '89' }],
  month: [{ count: '345' }],
  modules: ['INVESTASI', 'PASAR', 'LIKUIDITAS', 'OPERASIONAL', 'KEPATUHAN', 'USER_MANAGEMENT', 'SYSTEM']
};

export const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    action: '',
    module: '',
    search: '',
    page: 1,
    limit: 20,
  });

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter data dummy berdasarkan kriteria
      let filteredLogs = dummyLogs;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.user.userID.toLowerCase().includes(searchLower) ||
          log.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      
      if (filters.module) {
        filteredLogs = filteredLogs.filter(log => log.module === filters.module);
      }
      
      setLogs(filteredLogs);
      setTotal(filteredLogs.length);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats(dummyStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    fetchStats();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      action: '',
      module: '',
      search: '',
      page: 1,
      limit: 20,
    });
  };

  const exportToExcel = async () => {
    try {
      console.log('Exporting data with filters:', filters);
      alert('Fitur export akan mengunduh file Excel dengan data audit log');
    } catch (error) {
      console.error('Error exporting:', error);
    }
  };

  return (
    <div className=" bg-gray-50 p-6">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
              <p className="text-gray-600 mt-2">Monitor semua aktivitas sistem secara real-time</p>
            </div>
            <button 
              onClick={exportToExcel} 
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.today.reduce((acc, curr) => acc + parseInt(curr.count), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Minggu Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.week.reduce((acc, curr) => acc + parseInt(curr.count), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.month.reduce((acc, curr) => acc + parseInt(curr.count), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Module</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.modules.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)} 
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button 
                  onClick={resetFilters} 
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari user atau deskripsi..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                  <input 
                    type="date" 
                    value={filters.start_date} 
                    onChange={(e) => handleFilterChange('start_date', e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                  <input 
                    type="date" 
                    value={filters.end_date} 
                    onChange={(e) => handleFilterChange('end_date', e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aksi</label>
                  <select 
                    value={filters.action} 
                    onChange={(e) => handleFilterChange('action', e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Aksi</option>
                    <option value="CREATE">Create</option>
                    <option value="UPDATE">Update</option>
                    <option value="DELETE">Delete</option>
                    <option value="VIEW">View</option>
                    <option value="EXPORT">Export</option>
                    <option value="LOGIN">Login</option>
                    <option value="LOGOUT">Logout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                  <select 
                    value={filters.module} 
                    onChange={(e) => handleFilterChange('module', e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Module</option>
                    <option value="INVESTASI">Investasi</option>
                    <option value="PASAR">Pasar</option>
                    <option value="LIKUIDITAS">Likuiditas</option>
                    <option value="OPERASIONAL">Operasional</option>
                    <option value="HUKUM">Hukum</option>
                    <option value="STRATEJIK">Stratejik</option>
                    <option value="KEPATUHAN">Kepatuhan</option>
                    <option value="REPUTASI">Reputasi</option>
                    <option value="USER_MANAGEMENT">User Management</option>
                    <option value="SYSTEM">System</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Memuat data audit...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{log.user.userID}</div>
                              <div className="text-sm text-gray-500 capitalize">{log.user.role.toLowerCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.module}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                          <div className="line-clamp-2">{log.description}</div>
                          {log.endpoint && <div className="text-xs text-gray-500 mt-1 truncate">{log.endpoint}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip_address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${log.is_success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {log.is_success ? 'Berhasil' : 'Gagal'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {logs.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data audit</h3>
                  <p className="text-gray-500">Tidak ada aktivitas yang tercatat untuk filter yang dipilih.</p>
                </div>
              )}

              {/* Pagination */}
              {total > 0 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Menampilkan {(filters.page - 1) * filters.limit + 1} - {Math.min(filters.page * filters.limit, total)} dari {total} data
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleFilterChange('page', filters.page - 1)} 
                        disabled={filters.page === 1} 
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handleFilterChange('page', filters.page + 1)}
                        disabled={filters.page * filters.limit >= total}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};