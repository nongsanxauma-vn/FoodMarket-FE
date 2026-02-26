
import React, { useEffect, useState } from 'react';
import {
  Users,
  Zap,
  ClipboardCheck,
  CheckCircle2,
  Search,
  Filter,
  MoreHorizontal,
  History,
  Lock,
  Unlock,
  Truck,
  Bike,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { userService, UserResponse } from '../../services';

const ShipperManagement: React.FC = () => {
  const [pendingShippers, setPendingShippers] = useState<UserResponse[]>([]);
  const [allShippers, setAllShippers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchShippers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userService.getAllUsers();
        const all = response.result || [];
        const shippers = all.filter((u) => u.role?.name === 'SHIPPER');
        setAllShippers(shippers);
        const pending = shippers.filter((u) => u.status !== 'ACTIVE');
        setPendingShippers(pending);
      } catch (err) {
        console.error('Failed to load shippers', err);
        setError('Không thể tải danh sách shipper. Vui lòng kiểm tra quyền Admin hoặc thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchShippers();
  }, []);

  const handleApproveShipper = async (userId: number) => {
    setApprovingId(userId);
    setError(null);
    try {
      const response = await userService.approveShipper(userId);
      const updated = response.result;
      if (updated) {
        setPendingShippers((prev) => prev.filter((u) => u.id !== updated.id));
        setAllShippers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
      }
    } catch (err) {
      console.error('Failed to approve shipper', err);
      setError('Duyệt hồ sơ shipper thất bại. Vui lòng thử lại sau.');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'TỔNG SỐ SHIPPER', value: allShippers.length.toString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          {
            label: 'ĐANG HOẠT ĐỘNG',
            value: allShippers.filter((s) => s.status === 'ACTIVE').length.toString(),
            icon: Zap,
            color: 'text-green-500',
            bg: 'bg-green-50',
          },
          {
            label: 'HỒ SƠ CHỜ DUYỆT',
            value: pendingShippers.length.toString(),
            icon: ClipboardCheck,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            badge: `${pendingShippers.length} hồ sơ mới`,
          },
          { label: 'GIAO THÀNH CÔNG', value: '98.5%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 font-display">
                {loading ? '...' : stat.value}
              </h3>
            </div>
            <div className={`size-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon className="size-7" />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 rounded-[32px] border border-red-100 shadow-sm p-6 text-sm text-red-700 flex items-center gap-3">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Approval Queue */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="size-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                <ClipboardCheck className="size-5" />
             </div>
             <h4 className="font-black text-gray-800 uppercase tracking-tight">Hàng đợi duyệt Shipper mới</h4>
          </div>
          <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {pendingShippers.length} hồ sơ mới
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tên</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại xe</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Khu vực hoạt động</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-6 text-sm text-gray-500">
                    Đang tải hàng đợi duyệt shipper...
                  </td>
                </tr>
              ) : pendingShippers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-6 text-sm text-gray-400 text-center">
                    Hiện không có hồ sơ shipper nào chờ duyệt.
                  </td>
                </tr>
              ) : (
                pendingShippers.map((shipper) => (
                  <tr key={shipper.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-5">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <Users className="size-5" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {shipper.fullName || shipper.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Bike className="size-4 text-gray-400" /> {shipper.vehicleNumber || 'Chưa cung cấp'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-600">
                      {shipper.address || '—'}
                    </td>
                    <td className="px-10 py-5 text-right">
                      <div className="flex items-center justify-end gap-6">
                        <button className="text-xs font-black text-gray-400 hover:text-primary transition-colors uppercase">
                          Xem hồ sơ
                        </button>
                        <button
                          onClick={() => shipper.id && handleApproveShipper(shipper.id)}
                          disabled={approvingId === shipper.id}
                          className="px-6 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:bg-gray-300 disabled:shadow-none"
                        >
                          {approvingId === shipper.id ? 'ĐANG DUYỆT...' : 'Duyệt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Shipper List */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6">
          <h4 className="font-black text-gray-800 uppercase tracking-tight">Danh sách Shipper toàn hệ thống</h4>
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <input type="text" placeholder="Tìm tên, ID shipper..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
            </div>
            <select className="px-6 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-black text-gray-600 outline-none cursor-pointer">
              <option>Tất cả khu vực</option>
            </select>
            <div className="relative">
               <select className="px-8 py-3 bg-gray-50 border border-transparent rounded-2xl text-xs font-black text-gray-600 outline-none cursor-pointer appearance-none pr-12">
                 <option>Trạng thái</option>
               </select>
               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 rotate-90" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipper</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phương tiện</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hiệu suất</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-10 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-6 text-sm text-gray-500">
                    Đang tải danh sách shipper...
                  </td>
                </tr>
              ) : allShippers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-6 text-sm text-gray-400 text-center">
                    Chưa có shipper nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                allShippers.map((shipper) => (
                  <tr key={shipper.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-[18px] bg-gray-100 flex items-center justify-center text-gray-400">
                          <Users className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">
                            {shipper.fullName || shipper.email}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            ID: {shipper.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-800">
                          {shipper.vehicleNumber || 'Biển số: —'}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {shipper.license || 'Giấy phép: —'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Star className="size-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-black text-gray-800">
                            {shipper.ratingAverage?.toFixed(1) ?? '—'}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold italic">
                          Khu vực: {shipper.address || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div
                        className={`px-4 py-1.5 rounded-full flex items-center gap-2 w-fit ${
                          shipper.status === 'ACTIVE'
                            ? 'text-green-500 bg-green-50'
                            : shipper.status === 'INACTIVE'
                            ? 'text-gray-400 bg-gray-50'
                            : 'text-red-500 bg-red-50'
                        }`}
                      >
                        <span className="size-2 bg-current rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-wider">
                          {shipper.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <button className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                          <History className="size-5" />
                        </button>
                        {shipper.status === 'ACTIVE' ? (
                          <button className="px-6 py-2.5 bg-red-50 text-red-500 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-red-100 transition-colors">
                            Khóa
                          </button>
                        ) : (
                          <button className="px-6 py-2.5 bg-green-50 text-green-600 text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-green-100 transition-colors">
                            Mở khóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-10 bg-white border-t border-gray-50 flex items-center justify-between">
           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hiển thị 10 trong tổng số 156 đối tác</p>
           <div className="flex items-center gap-3">
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50">
                 <ChevronLeft className="size-6" />
              </button>
              <button className="size-10 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300 hover:bg-gray-50">
                 <ChevronRight className="size-6" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Add fix: Export default
export default ShipperManagement;
