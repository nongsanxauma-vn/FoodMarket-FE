import React, { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { blogService } from '../services';
import { globalShowAlert } from '../contexts/PopupContext';

import './MyCKEditor.css';

interface MyCKEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MyCKEditor: React.FC<MyCKEditorProps> = ({ value, onChange, placeholder = "Viết nội dung tại đây..." }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      globalShowAlert('Vui lòng chọn một tệp ảnh', 'Lỗi', 'error');
      return;
    }

    try {
      // use the centralized service which already attaches auth headers and base URL
      const formData = new FormData();
      formData.append('upload', file);

      console.log('Uploading image via blogService:', file.name);

      const response = await blogService.uploadImage(file);
      console.log('Upload response data:', response);

      // backend returns plain map { "url": "..." }
      const imageUrl = response.result?.url || (response as any).url;
      console.log('Extracted image URL:', imageUrl);
      if (!imageUrl) {
        console.error('Response structure:', JSON.stringify(response));
        throw new Error('Server did not return image URL');
      }

      if (editor && imageUrl) {
        console.log('Inserting image into editor:', imageUrl);
        editor.chain().focus().setImage({ src: imageUrl }).run();
        globalShowAlert('Ảnh tải lên thành công!', 'Thành công', 'success');
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      
      let errorMsg = 'Không thể tải ảnh lên';
      
      if (error.message.includes('Failed to fetch')) {
        errorMsg = '⚠️ Lỗi kết nối: Backend server không chạy. Vui lòng kiểm tra server lại.';
      } else if (error.message.includes('timeout')) {
        errorMsg = 'Yêu cầu tải ảnh quá thời gian, vui lòng thử lại.';
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      globalShowAlert(errorMsg, 'Lỗi', 'error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
        break;
      }
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleDOMEvents: {
        paste: (view, event) => {
          const items = (event as ClipboardEvent).clipboardData?.items;
          if (!items) return false;

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith('image/')) {
              event.preventDefault();
              const blob = item.getAsFile();
              if (blob) {
                handleImageUpload(blob);
              }
              return true;
            }
          }
          return false;
        },
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="tiptap-editor-wrapper">
      <div className="tiptap-toolbar">
        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'active' : ''}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'active' : ''}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={editor.isActive('underline') ? 'active' : ''}
            title="Underline (Ctrl+U)"
          >
            <u>U</u>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'active' : ''}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'active' : ''}
            title="Bullet List"
          >
            • List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'active' : ''}
            title="Ordered List"
          >
            1. List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'active' : ''}
            title="Blockquote"
          >
            " "
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'active' : ''}
            title="Code Block"
          >
            &lt;/&gt;
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
            title="Align Left"
          >
            ↞
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
            title="Align Center"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
            title="Align Right"
          >
            ↢
          </button>
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload ảnh (hoặc Ctrl+V để dán ảnh)"
            className="image-upload-btn"
          >
            🖼️ Ảnh
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              // Reset input
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
          />
        </div>

        <div className="toolbar-group">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            title="Undo"
          >
            ↶
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            title="Redo"
          >
            ↷
          </button>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="tiptap-editor"
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('drag-over');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('drag-over');
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MyCKEditor;