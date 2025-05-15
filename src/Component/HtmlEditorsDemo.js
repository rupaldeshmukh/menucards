import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const HtmlEditorsDemo = () => {
  const quillRef = useRef(null);
  const [quillContent, setQuillContent] = useState('');

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      placeholder: 'Paste Excel content here...',
    });

    quill.on('text-change', () => {
      setQuillContent(quill.root.innerHTML);
    });

  }, []);

  const handleSubmit = () => {
    console.log('➡ Quill Output:\n', quillContent);
    alert("Check console to see each editor's HTML output.");
  };

  return (
    <div className="container mt-4">
      <h3>📋 Excel Paste Test Across Editors</h3>

      <div className="mb-4">
        <h5>4. Quill</h5>
        <div ref={quillRef} style={{ height: 200 }} />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit & Check Console
      </button>
    </div>
  );
};

export default HtmlEditorsDemo;


// npm install jquery summernote xlsx quill @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic @tinymce/tinymce-react
