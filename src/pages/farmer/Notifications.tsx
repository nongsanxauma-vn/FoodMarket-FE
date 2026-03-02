
import React, { useEffect, useState } from 'react';
import { Bell, Clock, ShoppingCart, Info, TrendingUp, CheckCircle2, ChevronRight, MoreHorizontal, Trash2, AlertCircle } from 'lucide-react';
import { notificationService, NotificationItem } from '../../services';

type UiNotificationType = 'order' | 'market' | 'system' | 'info';

interface UiNotification extends NotificationItem {
  uiType: UiNotificationType;
  timeLabel: string;
}

const mapNotificationToUi = (notification: NotificationItem): UiNotification => {
  let uiType: UiNotificationType = 'system';

  const title = notification.title?.toLowerCase() || '';

  if (title.includes('đơn hàng') || title.includes('order')) {
    uiType = 'order';
  } else if (title.includes('thị trường') || title.includes('giá')) {
    uiType = 'market';
  } else if (title.includes('kyc') || title.includes('xác minh')) {
    uiType = 'system';
  } else {
    uiType = 'info';
  }

  const createdAt = notification.createAt;
  const timeLabel = createdAt ? new Date(createdAt).toLocaleString('vi-VN') : 'Vừa xong';

  return {
    ...notification,
    uiType,
    timeLabel,
  };
};

const FarmerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<UiNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await notificationService.getMyNotifications();
        const list = response.result || [];
        setNotifications(list.map(mapNotificationToUi));
      } catch (err) {
        console.error('Failed to load notifications', err);
        setError('Không thể tải danh sách thông báo. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black font-display text-gray-900 uppercase tracking-tight">Thông báo của bạn</h2>
          <p className="text-gray-400 font-medium text-sm mt-1">Cập nhật tin nhắn hệ thống, đơn hàng và biến động thị trường.</p>
        </div>
        <button
          className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline disabled:text-gray-300"
          disabled={!notifications.length}
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="max-w-4xl space-y-4">
        {loading && (
          <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-4">
            <Clock className="size-5 text-primary animate-spin-slow" />
            <p className="text-sm font-medium text-gray-600">Đang tải danh sách thông báo...</p>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 bg-red-50 rounded-[40px] border border-red-100 shadow-sm flex items-center gap-4">
            <AlertCircle className="size-5 text-red-500" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && notifications.map((n) => (
          <div
            key={n.id}
            className={`p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm flex items-start gap-8 group hover:shadow-md transition-all relative overflow-hidden ${!n.isRead ? 'border-primary/20 bg-primary/5' : ''}`}
          >
            {!n.isRead && (
              <div className="absolute top-8 right-8 size-2.5 bg-primary rounded-full shadow-lg shadow-primary/40" />
            )}

            <div
              className={`size-16 rounded-[24px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500 ${n.uiType === 'order'
                  ? 'bg-blue-50 text-blue-500'
                  : n.uiType === 'market'
                    ? 'bg-orange-50 text-orange-500'
                    : n.uiType === 'system'
                      ? 'bg-emerald-50 text-emerald-500'
                      : 'bg-gray-50 text-gray-400'
                }`}
            >
              {n.uiType === 'order' && <ShoppingCart className="size-8" />}
              {n.uiType === 'market' && <TrendingUp className="size-8" />}
              {n.uiType === 'system' && <CheckCircle2 className="size-8" />}
              {n.uiType === 'info' && <Info className="size-8" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-xl font-black text-gray-900 leading-tight">{n.title}</h4>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  • {n.timeLabel}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                {n.message}
              </p>
              <div className="flex items-center gap-6">
                <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-600 uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                  Xem chi tiết <ChevronRight className="size-3" />
                </button>
                <button className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1">
                  <Trash2 className="size-3" /> Xóa
                </button>
              </div>
            </div>

            <button className="absolute top-8 right-12 text-gray-200 hover:text-gray-900 transition-colors opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="size-6" />
            </button>
          </div>
        ))}

        {!loading && !error && !notifications.length && (
          <div className="pt-8 text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
              Hiện chưa có thông báo nào mới
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerNotifications;
