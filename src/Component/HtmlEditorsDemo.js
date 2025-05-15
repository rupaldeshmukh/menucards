import React, { useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import { Editor as TinyMCE } from '@tinymce/tinymce-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const HtmlEditorsDemo = () => {
  const summernoteRef = useRef(null);
  const quillRef = useRef(null);
  const [tinyContent, setTinyContent] = useState('');
  const [ckeditorContent, setCkeditorContent] = useState('');
  const [quillContent, setQuillContent] = useState('');

  useEffect(() => {
    $(summernoteRef.current).summernote({
      height: 200,
      toolbar: [['style', ['bold', 'italic', 'underline']], ['insert', ['picture', 'link', 'video']]],
      callbacks: {
        onImageUpload: (files) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            $(summernoteRef.current).summernote('insertImage', e.target.result);
          };
          reader.readAsDataURL(files[0]);
        }
      }
    });

    const quill = new Quill(quillRef.current, {
      theme: 'snow',
      placeholder: 'Paste Excel content here...',
    });

    quill.on('text-change', () => {
      setQuillContent(quill.root.innerHTML);
    });

    return () => {
      $(summernoteRef.current).summernote('destroy');
    };
  }, []);

  const handleSubmit = () => {
    const summernoteData = $(summernoteRef.current).summernote('code');
    console.log('➡ Summernote Output:\n', summernoteData);
    console.log('➡ TinyMCE Output:\n', tinyContent);
    console.log('➡ CKEditor Output:\n', ckeditorContent);
    console.log('➡ Quill Output:\n', quillContent);
    alert("Check console to see each editor's HTML output.");
  };

  return (
    <div className="container mt-4">
      <h3>📋 Excel Paste Test Across Editors</h3>

      <div className="mb-4">
        <h5>1. Summernote</h5>
        <div ref={summernoteRef} />
      </div>

      <div className="mb-4">
        <h5>2. TinyMCE (Best for Excel Table)</h5>
        <TinyMCE
          apiKey="no-api-key"
          init={{
            height: 200,
            menubar: false,
            plugins: 'paste table',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | table',
            paste_data_images: false
          }}
          onEditorChange={(content) => setTinyContent(content)}
        />
      </div>

      <div className="mb-4">
        <h5>3. CKEditor 5 (Free build)</h5>
        <CKEditor
          editor={ClassicEditor}
          data="<p>Paste here</p>"
          onChange={(event, editor) => setCkeditorContent(editor.getData())}
        />
      </div>

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
