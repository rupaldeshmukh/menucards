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
        }
      }
    });

    // Load initial HTML
    $editor.summernote('code', initialDescription);

    // Listen for blur (save HTML instead of plain text)
    $editor.on('summernote.blur', () => {
      const html = $editor.summernote('code');
      setFormData((prev) => ({ ...prev, description: html }));
    });

    // Listen for paste (to manually extract HTML if present)
    $editor.on('paste', (e) => {
      const clipboardData = e.originalEvent.clipboardData;
      if (clipboardData && clipboardData.types.includes('text/html')) {
        e.preventDefault(); // prevent default paste

        const htmlData = clipboardData.getData('text/html');
        $editor.summernote('pasteHTML', htmlData);
      }
    });

    return () => {
      $editor.summernote('destroy');
    };
  }, [initialDescription]);

  return (
    <div style={{ margin: '20px' }}>
      <h4>Rich Text Editor</h4>
      <div ref={editorRef} />
      {/* For testing: */}
      {/* <pre>{formData.description}</pre> */}
    </div>
  );
};

export default EditorWithExcelUpload;


// import React, { useEffect, useRef } from 'react';
// import $ from 'jquery';
// import 'summernote/dist/summernote-lite.css';
// import 'summernote/dist/summernote-lite.js';
// import { useRecoilState } from 'recoil';
// import { formDataAtom } from './atoms'; // adjust path to your atom

// const EditorWithExcelUpload = () => {
//   const editorRef = useRef(null);
//   const [formData, setFormData] = useRecoilState(formDataAtom);

//   useEffect(() => {
//     const $editor = $(editorRef.current);

//     $editor.summernote({
//       height: 300,
//       callbacks: {
//         onImageUpload: (files) => {
//           if (!files?.length) return;

//           const reader = new FileReader();
//           reader.onload = (e) => {
//             $editor.summernote('insertImage', e.target.result, ($image) => {
//               $image.css('max-width', '100%');
//             });
//           };
//           reader.readAsDataURL(files[0]);
//         }
//       }
//     });

//     // Load content from Recoil on mount
//     $editor.summernote('code', formData.featureDescription || '');

//     // Save updated HTML to Recoil on blur
//     $editor.on('summernote.blur', () => {
//       const html = $editor.summernote('code');
//       setFormData((prev) => ({
//         ...prev,
//         featureDescription: html
//       }));
//     });

//     // Handle Excel paste
//     $editor.on('paste', (e) => {
//       const clipboardData = e.originalEvent.clipboardData;
//       if (clipboardData?.types.includes('text/html')) {
//         e.preventDefault();
//         const htmlData = clipboardData.getData('text/html');
//         $editor.summernote('pasteHTML', htmlData);
//       }
//     });

//     return () => {
//       $editor.summernote('destroy');
//     };
//   }, []);

//   return (
//     <div style={{ margin: '20px' }}>
//       <h4>Rich Text Editor</h4>
//       <div ref={editorRef} />
//     </div>
//   );
// };

// export default EditorWithExcelUpload;

