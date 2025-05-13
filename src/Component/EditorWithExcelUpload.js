import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';

const EditorWithExcelUpload = ({ initialDescription = '' }) => {
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({
    description: initialDescription || ''
  });

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
        },
        onChange: (contents) => {
          setFormData((prev) => ({
            ...prev,
            description: contents
          }));
        }
      }
    });

    // Set initial content if any
    $editor.summernote('code', formData.description);

    return () => {
      $editor.summernote('destroy');
    };
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <h4>Rich Text Editor</h4>
      <div ref={editorRef} />
      {/* For debugging or future use */}
      {/* <div dangerouslySetInnerHTML={{ __html: formData.description }} /> */}
    </div>
  );
};

export default EditorWithExcelUpload;
