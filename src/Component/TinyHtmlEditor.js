import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyHtmlEditor = () => {
    const editorRef = useRef(null);

    const logHTML = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    return (
        <div>
            <Editor
                apiKey="fikfsc7rtoe3v8zuchivnfgfmg3giul912xp5h260ij1fhm3" // empty for local dev; use real API key for production
                onInit={(evt, editor) => (editorRef.current = editor)}
                // value={content}
                init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                        'table paste code',
                        'advlist autolink lists link image charmap preview anchor',
                        'searchreplace visualblocks fullscreen',
                        'insertdatetime media table code help wordcount',
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | code',
                    placeholder: 'Start typing your content here...',
                }}
            />
            <button onClick={logHTML}>Get HTML</button>
        </div>
    );
};

export default TinyHtmlEditor;
// npm install @tinymce/tinymce-react
