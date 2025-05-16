import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  COMMAND_PRIORITY_EDITOR,
} from "lexical";
import {
  TableNode,
  TableCellNode,
  TableRowNode,
} from "@lexical/table";

const editorConfig = {
  namespace: "MyEditor",
  onError: (error) => console.error(error),
  nodes: [TableNode, TableCellNode, TableRowNode],
};

// Replace this with your real image upload logic
async function uploadImageToServer(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("https://api.imgbb.com/1/upload?key=YOUR_API_KEY", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.data.url; // return uploaded image URL
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderline, setUnderline] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setBold(selection.hasFormat("bold"));
          setItalic(selection.hasFormat("italic"));
          setUnderline(selection.hasFormat("underline"));
          const anchor = selection.anchor.getNode();
          const parent = anchor.getParent();
          setBlockType(parent?.getType?.() || "paragraph");
        }
      });
    });
  }, [editor]);

  return (
    <div className="toolbar mb-2 space-x-2 border-b border-gray-300 p-2 bg-gray-50 rounded">
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} className={isBold ? "font-bold text-blue-600" : ""}><b>B</b></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} className={isItalic ? "italic text-blue-600" : ""}><i>I</i></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} className={isUnderline ? "underline text-blue-600" : ""}><u>U</u></button>
      <select
        value={blockType}
        onChange={(e) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, e.target.value)}
        className="border rounded p-1"
      >
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
      </select>
    </div>
  );
}

function ImageUploadPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregister = editor.registerCommand(
      "paste",
      (event) => {
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const items = clipboard.items;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith("image/")) {
            event.preventDefault();
            const file = item.getAsFile();

            uploadImageToServer(file).then((imageUrl) => {
              editor.update(() => {
                const html = `<img src="${imageUrl}" alt="pasted-img" style="max-width:100%;" />`;
                editor.dispatchCommand("INSERT_HTML_COMMAND", html);
              });
            });

            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return unregister;
  }, [editor]);

  return null;
}

function HTMLExporter({ setHtml }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor);
        setHtml(html);
      });
    });
  }, [editor, setHtml]);

  return null;
}

export default function LexicalEditor() {
  const [htmlOutput, setHtmlOutput] = useState("");

  const style = `
    .editor-container table, .editor-container th, .editor-container td {
      border: 1px solid black;
      border-collapse: collapse;
      padding: 6px;
    }
    .toolbar button {
      cursor: pointer;
      border: 1px solid transparent;
      background: transparent;
      padding: 4px 8px;
      border-radius: 3px;
    }
    .toolbar button:hover {
      background: #e5e7eb;
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="p-4 max-w-3xl mx-auto editor-container border rounded bg-white">
        <LexicalComposer initialConfig={editorConfig}>
          <Toolbar />
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="border border-gray-300 p-2 min-h-[200px]"
                spellCheck={true}
              />
            }
            placeholder={<div className="text-gray-400">Paste Excel tables or images here...</div>}
            ErrorBoundary={({ error }) => <div>Error: {error.message}</div>}
          />
          <HistoryPlugin />
          <ImageUploadPlugin />
          <HTMLExporter setHtml={setHtmlOutput} />
        </LexicalComposer>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">HTML Output:</h3>
          <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap max-h-[300px] overflow-auto">
            {htmlOutput}
          </pre>
        </div>
      </div>
    </>
  );
}

// npm install lexical @lexical/react @lexical/rich-text @lexical/history @lexical/html @lexical/table
