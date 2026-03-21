import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export type PopupType = 'alert' | 'confirm' | 'success' | 'error' | 'warning' | 'info';

export interface PopupState {
  isOpen: boolean;
  type: PopupType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function PopupModal({ popup }: { popup: PopupState }) {
  if (!popup.isOpen) return null;

  const isConfirm = popup.type === 'confirm';

  // Keyboard support for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && popup.isOpen) {
        (popup.onCancel || popup.onConfirm)?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [popup]);

  // Biểu tượng động và màu sắc theo type
  const renderIcon = () => {
    switch (popup.type) {
      case 'success':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'confirm':
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
        );
      default: // alert, info
        return (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
        );
    }
  };

  const getConfirmButtonStyles = () => {
    if (popup.type === 'error') return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    if (popup.type === 'success') return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
    if (popup.type === 'confirm') return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
  };

  return (
    <div className="relative z-[9999]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={popup.onCancel || popup.onConfirm}
      ></div>

      {/* Modal Viewport */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          
          {/* Modal Panel */}
          <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100 animate-in zoom-in-95 duration-200">
            
            {/* Close Button (X) */}
            <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-xl bg-white text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 transition-colors focus:outline-none"
                onClick={popup.onCancel || popup.onConfirm}
              >
                <span className="sr-only">Đóng</span>
                <X className="size-5" />
              </button>
            </div>

            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start flex-col">
                {renderIcon()}
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full text-center">
                  <h3 className="text-xl font-semibold leading-6 text-gray-900" id="modal-title">
                    {popup.title}
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {popup.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
              <button
                type="button"
                className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonStyles()}`}
                onClick={popup.onConfirm}
              >
                {popup.confirmLabel || (isConfirm ? 'Xác nhận' : 'Đồng ý')}
              </button>
              {isConfirm && (
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors sm:mt-0 sm:w-auto"
                  onClick={popup.onCancel}
                >
                  {popup.cancelLabel || 'Hủy bỏ'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
