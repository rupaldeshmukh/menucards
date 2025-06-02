import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function QuillHtmlEditor() {
  const quillRef = useRef(null);

  const handlePaste = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('Text');

    // Detect Excel-style table (tab-separated)
    if (pastedText.includes('\t')) {
      e.preventDefault();

      const rows = pastedText.split('\n').filter(row => row.trim() !== '');
      const htmlRows = rows.map(row => {
        const cells = row.split('\t').map(cell => 
          `<td style="border: 1px solid #000; padding: 4px;">${cell}</td>`
        ).join('');
        return `<tr>${cells}</tr>`;
      }).join('');

      const htmlTable = `<table style="border-collapse: collapse; border: 1px solid #000;">${htmlRows}</table>`;

      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(range?.index || 0, htmlTable);
    }
  };

  console.log()

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        onPaste={handlePaste}
        placeholder="Paste Excel data here..."
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ]
        }}
      />
    </div>
  );
}
