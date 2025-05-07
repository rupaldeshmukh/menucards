import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles

function SimpleEditor() {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: '600px', margin: 'auto' }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        placeholder="Write something awesome..."
      />
      {/* <div style={{ marginTop: '20px' }}>
        <div dangerouslySetInnerHTML={{ __html: value }} />
      </div> */}
    </div>
  );
}

export default SimpleEditor;
