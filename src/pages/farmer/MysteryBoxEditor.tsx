import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Minus,
  Check,
  Trash2,
  Sparkles,
  Gift,
  ImagePlus,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { productService, mysteryBoxService, authService, ProductResponse, MysteryBoxResponse, ProductMysteryResponse, ProductMysteryRequest } from '../../services/index';

interface SelectedProduct {
  productId: number;
  productName: string;
  quantity: number;
  imageUrl?: string;
  unit?: string;
  stockQuantity: number;
}

const MysteryBoxEditor: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { boxId } = useParams<{ boxId: string }>();
  const isEditMode = !!boxId;

  const [availableProducts, setAvailableProducts] = useState<ProductResponse[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [boxType, setBoxType] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [price, setPrice] = useState('');
  const [boxImage, setBoxImage] = useState<File | null>(null);
  const [boxImagePreview, setBoxImagePreview] = useState<string>('');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userRes = await authService.getMyInfo();
        let productsList: ProductResponse[] = [];

        if (userRes.result && userRes.result.id) {
          const res = await productService.getByShopId(Number(userRes.result.id));
          if (res.result) {
            productsList = res.result;
            setAvailableProducts(productsList);
          }
        }

        // Load existing mystery box data if editing (after products are loaded)
        if (isEditMode && boxId) {
          try {
            const boxRes = await mysteryBoxService.getById(Number(boxId));
            if (boxRes.result) {
              const box = boxRes.result;
              setBoxType(box.boxType);
              setDescription(box.description || '');
              setNote(box.note || '');
              setPrice(box.price.toString());
              setBoxImagePreview(box.imageUrl || '');
              const active = box.isActive !== false && box.isActive !== 0;
              setIsActive(active);

              // Load selected products from mystery box
              if (box.products && box.products.length > 0) {
                // We need to match the products with available products to get full info
                const selectedProds: SelectedProduct[] = [];
                
                for (const boxProduct of box.products) {
                  // Find the full product info from available products
                  const fullProduct = productsList.find(p => p.id === boxProduct.productId);
                  if (fullProduct) {
                    selectedProds.push({
                      productId: boxProduct.productId,
                      productName: boxProduct.productName,
                      quantity: boxProduct.quantity,
                      imageUrl: fullProduct.imageUrl,
                      unit: fullProduct.unit,
                      stockQuantity: fullProduct.stockQuantity
                    });
                  } else {
                    // If product not found in available products, still add it with limited info
                    selectedProds.push({
                      productId: boxProduct.productId,
                      productName: boxProduct.productName,
                      quantity: boxProduct.quantity,
                      imageUrl: undefined,
                      unit: undefined,
                      stockQuantity: 0
                    });
                  }
                }
                
                setSelectedProducts(selectedProds);
                console.log('Loaded selected products:', selectedProds);
              }
            }
          } catch (boxErr) {
            console.error('Failed to load mystery box details:', boxErr);
            setError('Không thể tải thông tin túi mù. Vui lòng thử lại.');
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [boxId, isEditMode]);
  const addProduct = (product: ProductResponse) => {
    if (selectedProducts.find(p => p.productId === product.id)) return;
    
    setSelectedProducts(prev => [...prev, {
      productId: product.id,
      productName: product.productName,
      quantity: 1,
      imageUrl: product.imageUrl,
      unit: product.unit,
      stockQuantity: product.stockQuantity
    }]);
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setSelectedProducts(prev => 
      prev.map(p => p.productId === productId ? { ...p, quantity } : p)
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBoxImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setBoxImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!boxType.trim()) {
      setError('Vui lòng nhập tên hộp mù.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Vui lòng nhập giá hợp lệ.');
      return;
    }
    if (selectedProducts.length === 0) {
      setError('Vui lòng chọn ít nhất một sản phẩm.');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const products: ProductMysteryRequest[] = selectedProducts.map(p => ({
        productId: p.productId,
        quantity: p.quantity
      }));

      if (isEditMode && boxId) {
        await mysteryBoxService.updateMysteryBox(Number(boxId), {
          boxType,
          price: Number(price),
          description,
          note,
          products,
          active: isActive
        }, boxImage || undefined);
      } else {
        await mysteryBoxService.createMysteryBox({
          boxType,
          price: Number(price),
          description,
          note,
          products
        }, boxImage || undefined);
      }

      onBack();
    } catch (err: any) {
      setError(err?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-sm transition-colors"
            >
              <ArrowLeft className="size-4" />
              Quay lại
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-black text-gray-900">
              {isEditMode ? 'Chỉnh Sửa Hộp Mù' : 'Tạo Hộp Mù Mới'}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="size-4" />
                {isEditMode ? 'Cập nhật' : 'Tạo hộp mù'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                  <Gift className="size-5" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Thông tin hộp mù</h3>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-bold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Tên hộp mù *
                  </label>
                  <input
                    type="text"
                    value={boxType}
                    onChange={(e) => setBoxType(e.target.value)}
                    placeholder="VD: Hộp mù rau củ tươi sạch"
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Giá bán (VND) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="59000"
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Mô tả
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả về hộp mù này..."
                    rows={4}
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú thêm..."
                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                  />
                </div>

                {isEditMode && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className={`size-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                        {isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">Trạng thái hiển thị</p>
                        <p className="text-xs text-gray-400 font-medium">
                          {isActive ? 'Đang hiển thị cho khách hàng' : 'Đang ẩn khỏi khách hàng'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActive(prev => !prev)}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 size-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Ảnh hộp mù
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="size-20 rounded-2xl overflow-hidden bg-purple-100 flex items-center justify-center shadow-sm">
                      {boxImagePreview ? (
                        <img src={boxImagePreview} className="w-full h-full object-cover" />
                      ) : (
                        <Sparkles className="size-8 text-purple-400" />
                      )}
                    </div>
                    <label className="cursor-pointer px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm rounded-xl transition-colors flex items-center gap-2">
                      <ImagePlus className="size-4" />
                      {boxImagePreview ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Product Selection */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                  <Plus className="size-5" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Chọn sản phẩm</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {availableProducts.map((product) => {
                  const isSelected = selectedProducts.find(p => p.productId === product.id);
                  return (
                    <div
                      key={product.id}
                      className={`relative group cursor-pointer ${isSelected ? 'opacity-50' : ''}`}
                      onClick={() => !isSelected && addProduct(product)}
                    >
                      <div className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${
                        isSelected ? 'border-gray-200' : 'border-transparent group-hover:border-primary'
                      }`}>
                        <img 
                          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/200/200`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className={`absolute inset-0 transition-all ${
                          isSelected ? 'bg-gray-500/20' : 'bg-black/10 group-hover:bg-transparent'
                        }`} />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white rounded-full p-2 shadow-lg">
                              <Check className="size-4 text-green-600" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-xs font-black text-gray-800 uppercase truncate">{product.productName}</p>
                        <p className="text-[10px] text-gray-500 font-bold">Tồn: {product.stockQuantity} {product.unit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Selected Products */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="size-10 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Sản phẩm đã chọn</h3>
              </div>
              {selectedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="size-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Chưa chọn sản phẩm nào</p>
                  <p className="text-gray-400 text-sm mt-1">Chọn sản phẩm từ danh sách bên trái</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((product) => (
                    <div key={product.productId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <img 
                        src={product.imageUrl || `https://picsum.photos/seed/${product.productId}/60/60`}
                        className="size-12 rounded-xl object-cover shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-black text-gray-800 line-clamp-1">{product.productName}</p>
                        <p className="text-xs text-gray-500 font-bold">Tồn: {product.stockQuantity} {product.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.productId, product.quantity - 1)}
                          className="size-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 shadow-sm"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-black text-gray-800">{product.quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.productId, product.quantity + 1)}
                          className="size-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 shadow-sm"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeProduct(product.productId)}
                        className="size-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MysteryBoxEditor;