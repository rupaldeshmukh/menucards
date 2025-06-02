import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';

const HtmlEditorsDemo = () => {
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [quillContent, setQuillContent] = useState('');
  const [isChecked, setIsChecked] = useState(false); // Example external input

  useEffect(() => {
    if (!quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: 'Paste Excel content or type here...',
        modules: {
          toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }]],
        },
      });

      const quill = quillInstance.current;

      // Track editor content live
      quill.on('text-change', () => {
        setQuillContent(quill.root.innerHTML);
      });

      // Add Excel paste support
      quill.root.addEventListener('paste', (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('text');

        if (pastedText.includes('\t')) {
          e.preventDefault();

          const rows = pastedText.trim().split('\n').filter(row => row.trim());
          const htmlRows = rows.map(row => {
            const cells = row.split('\t').map(cell =>
              `<td style="border: 1px solid #000; padding: 4px;">${cell}</td>`
            ).join('');
            return `<tr>${cells}</tr>`;
          }).join('');
          const htmlTable = `<table style="border-collapse: collapse; border: 1px solid #000;">${htmlRows}</table>`;

          const range = quill.getSelection(true);
          quill.clipboard.dangerouslyPasteHTML(range.index, htmlTable);
        }
      });
    }
  }, []);

  return (
    <div className="container mt-4">
      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="exampleCheckbox"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="exampleCheckbox">
          Example checkbox (preserved)
        </label>
      </div>

      <div className="mb-4">
        <h5>Quill Editor</h5>
        <div ref={quillRef} style={{ height: 200, backgroundColor: '#fff' }} />
      </div>

      <div className="mt-4">
        <h6>Live HTML Output:</h6>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f8f9fa', padding: 10 }}>
          {quillContent}
        </pre>
      </div>
    </div>
  );
};

export default HtmlEditorsDemo;
