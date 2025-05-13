import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';

const EditorWithExcelUpload = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const $editor = $(editorRef.current);

    $editor.summernote({
      height: 300,
      callbacks: {
        onImageUpload: (files) => {
          if (!files?.length) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            $editor.summernote('insertImage', e.target.result, ($image) => {
              $image.css('max-width', '100%');
            });
          };
          reader.readAsDataURL(files[0]);
        }
      }
    });

    return () => {
      $editor.summernote('destroy');
    };
  }, []);

  return (
    <div>
      <div ref={editorRef} />
    </div>
  );
};

export default EditorWithExcelUpload;
