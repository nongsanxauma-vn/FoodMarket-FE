import React, { useState } from 'react';
import { X, Camera, AlertCircle, Loader2, Send } from 'lucide-react';
import { returnService } from '../services/return.service';
import { OrderItemResponse } from '../services/order.service';
import { globalShowAlert } from '../contexts/PopupContext';

interface ReturnRequestModalProps {
    item: OrderItemResponse;
    onClose: () => void;
    onSuccess: () => void;
}

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({ item, onClose, onSuccess }) => {
    const [reason, setReason] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!reason.trim()) {
            globalShowAlert('Vui lòng nhập lý do trả hàng', 'Nhắc nhở', 'warning');
            return;
        }
        if (!file) {
            globalShowAlert('Vui lòng tải lên bằng chứng (hình ảnh/video)', 'Nhắc nhở', 'warning');
            return;
        }

        try {
            setSubmitting(true);
            
            const res = await returnService.create({
                orderDetailId: item.orderDetailId!,
                reason: reason.trim()
            }, file);

            if (res.result) {
                globalShowAlert('Yêu cầu trả hàng đã được gửi thành công!', 'Thành công', 'success');
                onSuccess();
            }
        } catch (err: any) {
            console.error('Submit return failed:', err);
            globalShowAlert(err.data?.message || 'Không thể gửi yêu cầu trả hàng. Vui lòng thử lại.', 'Lỗi', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white relative z-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Yêu cầu trả hàng</h3>
                        <p className="text-gray-400 font-bold text-xs mt-1">Sản phẩm: {item.productName}</p>
                    </div>
                    <button onClick={onClose} className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all">
                        <X className="size-6" />
                    </button>
                </div>

                <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Reason */}
                    <div className="space-y-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <AlertCircle className="size-3" /> Lý do trả hàng
                        </label>
                        <textarea 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Mô tả chi tiết vấn đề bạn gặp phải (ví dụ: sản phẩm bị hỏng, sai mẫu mã...)"
                            className="w-full h-32 p-6 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-medium outline-none focus:border-primary focus:bg-white transition-all resize-none"
                        />
                    </div>

                    {/* Evidence */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <Camera className="size-3" /> Bằng chứng hình ảnh/video
                        </label>
                        <div className="grid grid-cols-4 gap-4">
                            <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                <Camera className="size-6 text-gray-300 group-hover:text-primary transition-colors" />
                                <span className="text-[8px] font-black text-gray-300 mt-1 uppercase group-hover:text-primary">Tải lên</span>
                                <input type="file" multiple className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                            </label>
                            {file && (
                                <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group shadow-sm">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => setFile(null)}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="size-5 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium italic">
                            * Vui lòng cung cấp hình ảnh rõ nét của sản phẩm và nhãn mác để được xử lý nhanh nhất.
                        </p>
                    </div>
                    
                    {/* Policy Info */}
                    <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex gap-4">
                        <div className="size-8 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                            <AlertCircle className="size-5" />
                        </div>
                        <div className="text-[11px] leading-relaxed text-orange-800">
                            <p className="font-black mb-1">CHÍNH SÁCH HOÀN TIỀN</p>
                            <p className="font-medium">Số tiền sẽ được hoàn vào ví của bạn sau khi Shop hoặc Admin phê duyệt thành công. Quá trình xử lý thường mất từ 1-3 ngày làm việc.</p>
                        </div>
                    </div>
                </div>

                <div className="px-10 py-8 bg-gray-50 border-t border-gray-100">
                    <button 
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="size-5 animate-spin" /> : <>GỬI YÊU CẦU TRẢ HÀNG <Send className="size-4" /></>}
                    </button>
                    <button 
                         onClick={onClose}
                         className="w-full mt-3 py-3 text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-900 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnRequestModal;
