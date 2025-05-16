import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Table from "@editorjs/table";

const EditorComponent = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        tools: {
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
        },
        onReady: () => {
          console.log("Editor.js is ready");
        },
        onChange: async () => {
          const content = await editorRef.current.save();
          console.log("Editor data:", content);
        },
      });
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Editor.js with Table</h2>
      <div id="editorjs" className="border p-4 bg-white rounded shadow-sm" />
    </div>
  );
};

export default EditorComponent;
