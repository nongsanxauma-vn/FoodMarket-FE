import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronRight, MapPin, Truck, Box, CheckCircle2, Clock,
  Phone, MessageSquare, ArrowLeft, Navigation, Wifi, WifiOff,
  Package, AlertCircle, RefreshCw
} from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { shipperService, ShipperLocationResponse } from '../../services/shipper.service';
import { API_BASE_URL } from '../../services/api.config';

// ===================== TYPES =====================
interface TrackingProps {
  onBack: () => void;
  orderId: number;       // ← orderId thật từ parent
  orderCode?: string;    // ← mã đơn hiển thị VD: #XM-99218
}

interface LocationState {
  lat: number;
  lng: number;
  updatedAt: string;
  shipperName: string;
}

// ===================== COMPONENT =====================
const Tracking: React.FC<TrackingProps> = ({ onBack, orderId, orderCode = `#${orderId}` }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const shipperMarkerRef = useRef<any>(null);
  const stompClientRef = useRef<Client | null>(null);

  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { label: 'Đã đặt hàng', time: '14:20, 24/10', done: true, icon: Box },
    { label: 'Nhà vườn đang chuẩn bị', time: '14:45, 24/10', done: true, icon: Clock },
    { label: 'Shipper đang lấy hàng', time: '15:10, 24/10', active: true, icon: Truck },
    { label: 'Đang trên đường giao', time: 'Dự kiến: 16:00', icon: MapPin },
    { label: 'Giao hàng thành công', time: '--:--', icon: CheckCircle2 },
  ];

  // ===================== INIT LEAFLET MAP =====================
  const initMap = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Dynamic import Leaflet để tránh SSR issues
    import('leaflet').then((L) => {
      // Fix default icon path
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });

      // OpenStreetMap tile (free, no API key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // ✅ Shipper marker (custom blue truck icon)
      const shipperIcon = L.divIcon({
        html: `
          <div style="
            width: 44px; height: 44px;
            background: #3B82F6;
            border: 3px solid white;
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 16px rgba(59,130,246,0.5);
            transform: rotate(0deg);
            transition: all 0.3s ease;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 3h15v13H1z"/><path d="m16 8 4 0 3 3 0 5-3 0"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <div style="
            position:absolute; bottom:-24px; left:50%; transform:translateX(-50%);
            background:#1D4ED8; color:white; padding:3px 10px;
            border-radius:20px; font-size:10px; font-weight:900;
            white-space:nowrap; letter-spacing:0.05em;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          ">Shipper</div>
        `,
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const marker = L.marker([lat, lng], { icon: shipperIcon }).addTo(map);
      shipperMarkerRef.current = marker;
      leafletMapRef.current = map;
    });
  }, []);

  // ===================== UPDATE MARKER POSITION =====================
  const updateMarker = useCallback((lat: number, lng: number) => {
    import('leaflet').then((L) => {
      if (shipperMarkerRef.current) {
        shipperMarkerRef.current.setLatLng([lat, lng]);
        // Smoothly pan map to follow shipper
        leafletMapRef.current?.panTo([lat, lng], { animate: true, duration: 1 });
      } else {
        initMap(lat, lng);
      }
    });
  }, [initMap]);

  // ===================== LOAD CSS LEAFLET =====================
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  // ===================== FETCH INITIAL LOCATION (REST) =====================
  useEffect(() => {
    const fetchInitialLocation = async () => {
      try {
        setLoadingInitial(true);
        const res = await shipperService.getShipperLocation(orderId);
        if (res.result) {
          const loc = res.result;
          setLocation({
            lat: loc.latitude,
            lng: loc.longitude,
            updatedAt: loc.updatedAt,
            shipperName: loc.shipperName,
          });
          initMap(loc.latitude, loc.longitude);
        }
      } catch (err) {
        // Shipper chưa bắt đầu giao → chưa có location, dùng HCM làm default
        initMap(10.7769, 106.7009);
        setError('Shipper chưa bắt đầu di chuyển');
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchInitialLocation();
  }, [orderId]);

  // ===================== WEBSOCKET REALTIME =====================
  useEffect(() => {
    const wsUrl = `${API_BASE_URL}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,

      onConnect: () => {
        setWsStatus('connected');
        setError(null);

        // Subscribe nhận vị trí shipper theo orderId
        client.subscribe(`/topic/order/${orderId}/location`, (message) => {
          try {
            const data: ShipperLocationResponse = JSON.parse(message.body);
            setLocation({
              lat: data.latitude,
              lng: data.longitude,
              updatedAt: data.updatedAt,
              shipperName: data.shipperName,
            });
            updateMarker(data.latitude, data.longitude);
          } catch (e) {
            console.error('Parse WS message error:', e);
          }
        });
      },

      onDisconnect: () => setWsStatus('disconnected'),
      onStompError: () => setWsStatus('disconnected'),
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [orderId, updateMarker]);

  // ===================== FORMAT TIME =====================
  const formatTime = (dateStr: string) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // ===================== RENDER =====================
  return (
    <div className="flex-1 bg-background animate-in fade-in duration-500 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={onBack}
            className="size-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Chi tiết hành trình</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              Đơn hàng: {orderCode} • Dự kiến nhận: 16:00 hôm nay
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* ====== LEFT: Timeline + Shipper Info ====== */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* Timeline */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
              <div className="space-y-8 relative">
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100" />
                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-6">
                    <div className={`size-12 rounded-2xl flex items-center justify-center z-10 shadow-sm transition-all ${
                      step.done ? 'bg-primary text-white' :
                      step.active ? 'bg-blue-500 text-white animate-pulse' :
                      'bg-gray-50 text-gray-300 border border-gray-100'
                    }`}>
                      <step.icon className="size-6" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-black uppercase tracking-tight ${
                        step.done ? 'text-gray-900' :
                        step.active ? 'text-blue-600' :
                        'text-gray-300'
                      }`}>{step.label}</p>
                      <p className="text-[11px] font-bold text-gray-400 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipper Info */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Thông tin Shipper</h4>

                {/* WebSocket status badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  wsStatus === 'connected' ? 'bg-green-50 text-green-600' :
                  wsStatus === 'connecting' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-red-50 text-red-500'
                }`}>
                  {wsStatus === 'connected'
                    ? <><Wifi className="size-3" /> Live</>
                    : wsStatus === 'connecting'
                    ? <><RefreshCw className="size-3 animate-spin" /> Đang kết nối</>
                    : <><WifiOff className="size-3" /> Mất kết nối</>
                  }
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="https://picsum.photos/seed/shipper_val/100/100"
                    className="size-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-black text-gray-900">
                      {location?.shipperName || 'Đang tải...'}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">⭐ 4.9 • Biển số: 59-X1 123.45</p>
                    {location && (
                      <p className="text-[10px] text-green-500 font-bold mt-1 flex items-center gap-1">
                        <Navigation className="size-3" />
                        Cập nhật lúc {formatTime(location.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="size-11 bg-green-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Phone className="size-5" />
                  </button>
                  <button className="size-11 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                    <MessageSquare className="size-5" />
                  </button>
                </div>
              </div>

              {/* Coordinates display */}
              {location && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Vị trí hiện tại</p>
                  <p className="text-xs font-mono text-gray-600">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-2xl p-4 border border-yellow-100">
                  <AlertCircle className="size-4 shrink-0" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* ====== RIGHT: Map + Order Summary ====== */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* ✅ LEAFLET MAP */}
            <div className="relative rounded-[40px] overflow-hidden shadow-lg border border-gray-100 bg-gray-100" style={{ height: '450px' }}>

              {/* Loading overlay */}
              {loadingInitial && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 gap-4">
                  <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải bản đồ...</p>
                </div>
              )}

              {/* Map container */}
              <div ref={mapRef} className="w-full h-full" />

              {/* Live indicator overlay */}
              {wsStatus === 'connected' && (
                <div className="absolute top-5 left-5 z-[1000] flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Đang theo dõi live</span>
                </div>
              )}

              {/* Center on shipper button */}
              {location && (
                <button
                  onClick={() => leafletMapRef.current?.setView([location.lat, location.lng], 16, { animate: true })}
                  className="absolute bottom-5 right-5 z-[1000] bg-white/95 backdrop-blur px-5 py-3 rounded-2xl flex items-center gap-2 text-xs font-black shadow-xl hover:bg-white transition-all uppercase tracking-widest border border-white/20 text-primary"
                >
                  <Navigation className="size-4" /> Tìm shipper
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tóm tắt đơn hàng</h4>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3 món • Tổng: 169.100đ</span>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {[
                  { seed: 't1', name: 'Cải Bệ Xanh', desc: '1kg x 25k' },
                  { seed: 't2', name: 'Cà Chua Bi', desc: '500g x 45k' },
                  { seed: 't3', name: 'Khoai Lang Mật', desc: '2kg x 32k' },
                ].map((item) => (
                  <div key={item.seed} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                    <img src={`https://picsum.photos/seed/${item.seed}/60/60`} className="size-12 rounded-xl object-cover" />
                    <div>
                      <p className="text-xs font-black text-gray-800">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;