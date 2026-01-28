import { supabase } from '../supabaseClient';
import imageCompression from 'browser-image-compression'; // 라이브러리 임포트

export const createImageHandler = (quillRef, folderName = 'editor') => {
  return () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        // --- 이미지 압축 및 WebP 변환 설정 ---
        const options = {
          maxSizeMB: 1,            // 최대 용량 1MB
          maxWidthOrHeight: 1280,  // 최대 가로/세로 길이
          useWebWorker: true,
          fileType: 'image/webp'   // WebP 형식으로 강제 변환
        };

        // 실제 압축 실행
        const compressedFile = await imageCompression(file, options);
        // ------------------------------------

        // 파일명 생성 (.webp 확장자로 변경)
        const safeFileName = file.name.replace(/[^\x00-\x7F]/g, "").split('.')[0];
        const fileName = `${folderName}/${Date.now()}_${safeFileName}.webp`;
        
        const BUCKET_NAME = 'daonrs';

        // 압축된 파일(compressedFile)을 업로드
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, compressedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);
        
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', publicUrl);
        quill.setSelection(range.index + 1);
        
      } catch (error) {
        console.error('이미지 압축 및 업로드 오류:', error);
        alert('이미지 처리 실패: ' + error.message);
      }
    };
  };
};

export const getEditorModules = (handler) => ({
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['image', 'link'],
      ['clean']
    ],
    handlers: {
      image: handler 
    }
  }
});