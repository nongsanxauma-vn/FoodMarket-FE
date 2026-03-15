import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  MapPin, Truck, Box, CheckCircle2, Clock, Store,
  Phone, MessageSquare, ArrowLeft, Navigation, Wifi, WifiOff,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { shipperService, ShipperLocationResponse } from '../../services/shipper.service';
import { API_BASE_URL, TOKEN_KEY } from '../../services/api.config';

interface TrackingProps {
  onBack: () => void;
  orderId?: number;
  orderCode?: string;
}

interface LocationState {
  lat: number;
  lng: number;
  updatedAt: string;
  shipperName: string;
  shopLat?: number | null;
  shopLng?: number | null;
  destLat?: number | null;
  destLng?: number | null;
}

const Tracking: React.FC<TrackingProps> = ({ onBack, orderId: orderIdProp, orderCode }) => {
  const { orderId: orderIdParam } = useParams<{ orderId: string }>();
  const orderId = orderIdProp || Number(orderIdParam) || 0;
  const displayCode = orderCode || `#${orderId}`;

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const shipperMarkerRef = useRef<any>(null);
  const routeLayer1Ref = useRef<any>(null); // shipper → shop (cam)
  const routeLayer2Ref = useRef<any>(null); // shop → buyer (xanh)
  const stompClientRef = useRef<Client | null>(null);
  const userInteractingRef = useRef(false);
  const interactTimeoutRef = useRef<any>(null);

  const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [location, setLocation] = useState<LocationState | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followShipper, setFollowShipper] = useState(true);
  const [shipperActive, setShipperActive] = useState(false);
  const lastUpdateRef = useRef<number | null>(null);
  const shipperActiveRef = useRef(false);

  const steps = [
    { label: 'Đã đặt hàng', time: '14:20, 24/10', done: true, icon: Box },
    { label: 'Nhà vườn đang chuẩn bị', time: '14:45, 24/10', done: true, icon: Clock },
    { label: 'Shipper đang lấy hàng', time: '15:10, 24/10', active: true, icon: Truck },
    { label: 'Đang trên đường giao', time: 'Dự kiến: 16:00', icon: MapPin },
    { label: 'Giao hàng thành công', time: '--:--', icon: CheckCircle2 },
  ];

  // ---- INIT MAP ----
  const initMap = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || leafletMapRef.current) return;
    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, { center: [lat, lng], zoom: 15, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Marker shipper (xe màu xanh)
      const shipperIcon = L.divIcon({
        html: `
          <div style="width:44px;height:44px;background:#3B82F6;border:3px solid white;border-radius:12px;
            display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(59,130,246,0.5);">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 3h15v13H1z"/><path d="m16 8 4 0 3 3 0 5-3 0"/>
              <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
          </div>
          <div style="position:absolute;bottom:-24px;left:50%;transform:translateX(-50%);
            background:#1D4ED8;color:white;padding:3px 10px;border-radius:20px;
            font-size:10px;font-weight:900;white-space:nowrap;">Shipper</div>`,
        className: '', iconSize: [44, 44], iconAnchor: [22, 22],
      });

      const marker = L.marker([lat, lng], { icon: shipperIcon }).addTo(map);
      shipperMarkerRef.current = marker;
      leafletMapRef.current = map;

      // Fix z-index Leaflet controls
      if (mapRef.current) {
        mapRef.current.querySelectorAll<HTMLElement>('.leaflet-control-container,.leaflet-top,.leaflet-bottom')
          .forEach(el => { el.style.zIndex = '10'; });
      }

      // Detect buyer interaction
      const onInteract = () => {
        userInteractingRef.current = true;
        clearTimeout(interactTimeoutRef.current);
        interactTimeoutRef.current = setTimeout(() => { userInteractingRef.current = false; }, 5000);
      };
      map.on('dragstart', () => {
        userInteractingRef.current = true;
        clearTimeout(interactTimeoutRef.current);
        mapRef.current?.dispatchEvent(new CustomEvent('user-drag'));
      });
      map.on('zoomstart', onInteract);
    });
  }, []);

  // ---- UPDATE MARKER ----
  const updateMarker = useCallback((lat: number, lng: number) => {
    if (shipperMarkerRef.current) {
      shipperMarkerRef.current.setLatLng([lat, lng]);
    } else {
      initMap(lat, lng);
    }
  }, [initMap]);

  // ---- PAN THEO SHIPPER khi followShipper = true ----
  useEffect(() => {
    if (followShipper && location && leafletMapRef.current) {
      leafletMapRef.current.panTo([location.lat, location.lng], { animate: true, duration: 0.8 });
    }
  }, [location, followShipper]);

  // ---- TẮT FOLLOW KHI BUYER KÉO MAP ----
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const handler = () => setFollowShipper(false);
    el.addEventListener('user-drag', handler);
    return () => el.removeEventListener('user-drag', handler);
  }, [loadingInitial]);

  // ---- VẼ 2 ĐOẠN ĐƯỜNG ----
  const drawRoutes = useCallback(async (
    shipperLat: number, shipperLng: number,
    shopLat: number, shopLng: number,
    destLat: number, destLng: number
  ) => {
    if (!shipperActiveRef.current) return;

    import('leaflet').then(async (L) => {
      const map = leafletMapRef.current;
      if (!map) return;

      // Xoá đường cũ
      if (routeLayer1Ref.current) { try { map.removeLayer(routeLayer1Ref.current); } catch {} routeLayer1Ref.current = null; }
      if (routeLayer2Ref.current) { try { map.removeLayer(routeLayer2Ref.current); } catch {} routeLayer2Ref.current = null; }

      // ✅ Marker shop (điểm lấy hàng - màu cam)
      if (!map._shopMarker) {
        const shopIcon = L.divIcon({
          html: `
            <div style="width:40px;height:40px;background:#F97316;border:3px solid white;border-radius:10px;
              display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(249,115,22,0.5);">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div style="position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);
              background:#EA580C;color:white;padding:2px 8px;border-radius:12px;
              font-size:9px;font-weight:900;white-space:nowrap;">Lấy hàng</div>`,
          className: '', iconSize: [40, 40], iconAnchor: [20, 20],
        });
        map._shopMarker = L.marker([shopLat, shopLng], { icon: shopIcon }).addTo(map);
      }

      // ✅ Marker nhà buyer (màu xanh lá)
      if (!map._destMarker) {
        const destIcon = L.divIcon({
          html: `
            <div style="width:40px;height:40px;background:#22C55E;border:3px solid white;border-radius:50%;
              display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(34,197,94,0.5);">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div style="position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);
              background:#16A34A;color:white;padding:2px 8px;border-radius:12px;
              font-size:9px;font-weight:900;white-space:nowrap;">Giao hàng</div>`,
          className: '', iconSize: [40, 40], iconAnchor: [20, 20],
        });
        map._destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(map);
      }

      try {
        // ✅ Đường 1: Shipper → Shop (màu cam)
        const url1 = `https://router.project-osrm.org/route/v1/driving/${shipperLng},${shipperLat};${shopLng},${shopLat}?overview=full&geometries=geojson`;
        const res1 = await fetch(url1);
        const data1 = await res1.json();
        if (data1.routes?.length) {
          const coords1 = data1.routes[0].geometry.coordinates.map(([lng, lat]: number[]) => [lat, lng]);
          routeLayer1Ref.current = L.polyline(coords1, { color: '#F97316', weight: 5, opacity: 0.8 }).addTo(map);
        }

        // ✅ Đường 2: Shop → Nhà buyer (màu xanh)
        const url2 = `https://router.project-osrm.org/route/v1/driving/${shopLng},${shopLat};${destLng},${destLat}?overview=full&geometries=geojson`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();
        if (data2.routes?.length) {
          const coords2 = data2.routes[0].geometry.coordinates.map(([lng, lat]: number[]) => [lat, lng]);
          routeLayer2Ref.current = L.polyline(coords2, { color: '#3B82F6', weight: 5, opacity: 0.8 }).addTo(map);
        }

        // Fit map thấy cả 3 điểm, chỉ khi buyer không đang tương tác
        if (!userInteractingRef.current) {
          map.fitBounds(
            L.latLngBounds([[shipperLat, shipperLng], [shopLat, shopLng], [destLat, destLng]]),
            { padding: [50, 50], animate: true }
          );
        }
      } catch (e) {
        console.warn('[Route] OSRM error:', e);
      }
    });
  }, []);

  // ---- CLEANUP KHI SHIPPER TẮT GPS ----
  const clearMapLayers = useCallback(() => {
    const map = leafletMapRef.current;
    if (!map) return;
    if (routeLayer1Ref.current) { try { map.removeLayer(routeLayer1Ref.current); } catch {} routeLayer1Ref.current = null; }
    if (routeLayer2Ref.current) { try { map.removeLayer(routeLayer2Ref.current); } catch {} routeLayer2Ref.current = null; }
    if (map._shopMarker) { try { map.removeLayer(map._shopMarker); } catch {} map._shopMarker = null; }
    if (map._destMarker) { try { map.removeLayer(map._destMarker); } catch {} map._destMarker = null; }
    if (shipperMarkerRef.current) { try { shipperMarkerRef.current.setOpacity(0); } catch {} }
  }, []);

  // ---- INTERVAL CHECK SHIPPER ACTIVE ----
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdateRef.current === null) return;
      const seconds = (Date.now() - lastUpdateRef.current) / 1000;
      const isActive = seconds < 30;
      shipperActiveRef.current = isActive;
      setShipperActive(prev => {
        if (prev && !isActive) clearMapLayers();
        return isActive;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [clearMapLayers]);

  // ---- LEAFLET CSS ----
  useEffect(() => {
    if (document.querySelector('link[href*="leaflet.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }, []);

  // ---- FETCH INITIAL LOCATION (REST) ----
  useEffect(() => {
    if (!orderId) return;
    const fetchLocation = async () => {
      try {
        setLoadingInitial(true);
        const res = await shipperService.getShipperLocation(orderId);
        if (res.result) {
          const loc = res.result;
          const locState: LocationState = {
            lat: loc.latitude,
            lng: loc.longitude,
            updatedAt: loc.updatedAt,
            shipperName: loc.shipperName,
            shopLat: loc.shopLatitude,
            shopLng: loc.shopLongitude,
            destLat: loc.destLatitude,
            destLng: loc.destLongitude,
          };
          setLocation(locState);
          setShipperActive(true);
          shipperActiveRef.current = true;
          lastUpdateRef.current = new Date(loc.updatedAt).getTime();
          initMap(loc.latitude, loc.longitude);
          // Vẽ 2 đường ngay khi load
          if (loc.shopLatitude && loc.shopLongitude && loc.destLatitude && loc.destLongitude) {
            setTimeout(() => drawRoutes(
              loc.latitude, loc.longitude,
              loc.shopLatitude!, loc.shopLongitude!,
              loc.destLatitude!, loc.destLongitude!
            ), 600);
          }
        }
      } catch {
        initMap(10.7769, 106.7009);
        setError('Shipper chưa bắt đầu di chuyển');
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchLocation();
  }, [orderId, initMap, drawRoutes]);

  // ---- WEBSOCKET ----
  useEffect(() => {
    if (!orderId) return;
    const token = localStorage.getItem(TOKEN_KEY);
    const baseUrl = API_BASE_URL.endsWith('/api/v1') ? API_BASE_URL.slice(0, -7) : API_BASE_URL;

    const client = new Client({
      webSocketFactory: () => new (SockJS as any)(`${baseUrl}/api/v1/ws`),
      reconnectDelay: 5000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: () => {
        setWsStatus('connected');
        setError(null);
        client.subscribe(`/topic/order/${orderId}/location`, (msg) => {
          try {
            const data: ShipperLocationResponse = JSON.parse(msg.body);
            lastUpdateRef.current = Date.now();
            shipperActiveRef.current = true;
            setShipperActive(true);
            if (shipperMarkerRef.current) shipperMarkerRef.current.setOpacity(1);

            const newLoc: LocationState = {
              lat: data.latitude,
              lng: data.longitude,
              updatedAt: data.updatedAt,
              shipperName: data.shipperName,
              shopLat: data.shopLatitude,
              shopLng: data.shopLongitude,
              destLat: data.destLatitude,
              destLng: data.destLongitude,
            };
            setLocation(newLoc);
            updateMarker(data.latitude, data.longitude);

            // Vẽ lại 2 đường khi shipper di chuyển
            if (data.shopLatitude && data.shopLongitude && data.destLatitude && data.destLongitude) {
              drawRoutes(
                data.latitude, data.longitude,
                data.shopLatitude, data.shopLongitude,
                data.destLatitude, data.destLongitude
              );
            }
          } catch (e) { console.error('[WS] Parse error:', e); }
        });
      },
      onDisconnect: () => setWsStatus('disconnected'),
      onStompError: () => setWsStatus('disconnected'),
    });

    client.activate();
    stompClientRef.current = client;
    return () => { client.deactivate(); };
  }, [orderId, updateMarker, drawRoutes]);

  // ---- CLEANUP MAP ----
  useEffect(() => {
    return () => {
      clearTimeout(interactTimeoutRef.current);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        shipperMarkerRef.current = null;
        routeLayer1Ref.current = null;
        routeLayer2Ref.current = null;
      }
    };
  }, []);

  const formatTime = (d: string) => {
    try { return new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); }
    catch { return '--:--'; }
  };

  // ===================== RENDER =====================
  return (
    <div className="flex-1 bg-background animate-in fade-in duration-500 pb-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-40 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={onBack} className="size-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Chi tiết hành trình</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              Đơn hàng: {displayCode} • Dự kiến nhận: 16:00 hôm nay
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT: Timeline + Shipper Info */}
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
                    }`}><step.icon className="size-6" /></div>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-black uppercase tracking-tight ${step.done ? 'text-gray-900' : step.active ? 'text-blue-600' : 'text-gray-300'}`}>{step.label}</p>
                      <p className="text-[11px] font-bold text-gray-400 mt-1">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend bản đồ */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Chú thích bản đồ</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-1 rounded-full bg-orange-500" />
                <span className="text-xs font-bold text-gray-600">Shipper → Lấy hàng tại shop</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-1 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-gray-600">Shop → Giao tới nhà bạn</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-4 bg-orange-500 rounded" />
                <span className="text-xs font-bold text-gray-600">Điểm lấy hàng (shop)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-4 bg-green-500 rounded-full" />
                <span className="text-xs font-bold text-gray-600">Điểm giao hàng (nhà bạn)</span>
              </div>
            </div>

            {/* Shipper Info */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Thông tin Shipper</h4>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  wsStatus === 'connected' ? 'bg-green-50 text-green-600' :
                  wsStatus === 'connecting' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'
                }`}>
                  {wsStatus === 'connected' ? <><Wifi className="size-3" /> Live</> :
                   wsStatus === 'connecting' ? <><RefreshCw className="size-3 animate-spin" /> Kết nối...</> :
                   <><WifiOff className="size-3" /> Mất kết nối</>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src="https://picsum.photos/seed/shipper_val/100/100" className="size-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                  <div>
                    <p className="text-sm font-black text-gray-900">{location?.shipperName || 'Đang tải...'}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">⭐ 4.9 • Biển số: 59-X1 123.45</p>
                    {location && (
                      <p className="text-[10px] text-green-500 font-bold mt-1 flex items-center gap-1">
                        <Navigation className="size-3" /> Cập nhật lúc {formatTime(location.updatedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="size-11 bg-green-50 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Phone className="size-5" /></button>
                  <button className="size-11 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"><MessageSquare className="size-5" /></button>
                </div>
              </div>

              {location && (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Vị trí hiện tại</p>
                  <p className="text-xs font-mono text-gray-600">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 rounded-2xl p-4 border border-yellow-100">
                  <AlertCircle className="size-4 shrink-0" />
                  <p className="text-xs font-bold">{error}</p>
                </div>
              )}

              {location && !shipperActive && lastUpdateRef.current && (
                <div className="flex items-center gap-2 bg-gray-50 text-gray-500 rounded-2xl p-4 border border-gray-200">
                  <WifiOff className="size-4 shrink-0" />
                  <p className="text-xs font-bold">Shipper đã tắt GPS — vị trí hiển thị lần cuối</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Map */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div
              className="relative rounded-[40px] shadow-lg border border-gray-100 bg-gray-100"
              style={{ height: '480px', overflow: 'hidden', isolation: 'isolate' }}
            >
              {loadingInitial && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 gap-4">
                  <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Đang tải bản đồ...</p>
                </div>
              )}

              <div ref={mapRef} className="w-full h-full" />

              {wsStatus === 'connected' && (
                <div className="absolute top-5 left-5 z-[10] flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-lg">
                  <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Đang theo dõi live</span>
                </div>
              )}

              {location && (
                <button
                  onClick={() => {
                    setFollowShipper(prev => {
                      const next = !prev;
                      if (next && leafletMapRef.current) {
                        leafletMapRef.current.panTo([location.lat, location.lng], { animate: true });
                      }
                      return next;
                    });
                  }}
                  className={`absolute bottom-5 right-5 z-[10] backdrop-blur px-5 py-3 rounded-2xl flex items-center gap-2 text-xs font-black shadow-xl transition-all uppercase tracking-widest border
                    ${followShipper ? 'bg-primary text-white border-primary shadow-primary/30' : 'bg-white/95 text-primary border-white/20 hover:bg-white'}`}
                >
                  <Navigation className="size-4" />
                  {followShipper ? 'Đang theo dõi' : 'Theo dõi shipper'}
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tóm tắt đơn hàng</h4>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">3 món • Tổng: 169.100đ</span>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[{seed:'t1',name:'Cải Bệ Xanh',desc:'1kg x 25k'},{seed:'t2',name:'Cà Chua Bi',desc:'500g x 45k'},{seed:'t3',name:'Khoai Lang Mật',desc:'2kg x 32k'}].map((item) => (
                  <div key={item.seed} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${item.seed}/60/60`} className="size-11 rounded-xl object-cover" />
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