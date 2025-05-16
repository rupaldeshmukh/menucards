// src/Component/LexicalEditorWithToolbar.js
import React, { useState, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $generateHtmlFromNodes,
} from "@lexical/html";

// Import at top
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from "lexical";


import {
  TableNode,
  TableCellNode,
  TableRowNode,
} from "@lexical/table";

import { $createParagraphNode } from "lexical";


// Editor config with table nodes
const editorConfig = {
  namespace: "MyEditor",
  onError: (error) => {
    console.error(error);
  },
  nodes: [TableNode, TableCellNode, TableRowNode],
};

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setBold] = useState(false);
  const [isItalic, setItalic] = useState(false);
  const [isUnderline, setUnderline] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");

  const changeBlockType = (blockType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, blockType);
    };


  // Update toolbar buttons state based on selection
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setBold(false);
          setItalic(false);
          setUnderline(false);
          setBlockType("paragraph");
          return;
        }
        setBold(selection.hasFormat("bold"));
        setItalic(selection.hasFormat("italic"));
        setUnderline(selection.hasFormat("underline"));

        const anchor = selection.anchor.getNode();
        const parent = anchor.getKey ? anchor.getParent() : null;
        if (parent) {
          const type = parent.getType();
          setBlockType(type);
        } else {
          setBlockType("paragraph");
        }
      });
    });
  }, [editor]);

  // Handlers to toggle formats
  const toggleFormat = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };


  return (
    <div className="toolbar mb-2 space-x-2 border-b border-gray-300 p-2 bg-gray-50 rounded">
      <button
        onClick={() => toggleFormat("bold")}
        className={isBold ? "font-bold text-blue-600" : ""}
        type="button"
        aria-label="Bold"
      >
        <b>B</b>
      </button>
      <button
        onClick={() => toggleFormat("italic")}
        className={isItalic ? "italic text-blue-600" : ""}
        type="button"
        aria-label="Italic"
      >
        <i>I</i>
      </button>
      <button
        onClick={() => toggleFormat("underline")}
        className={isUnderline ? "underline text-blue-600" : ""}
        type="button"
        aria-label="Underline"
      >
        <u>U</u>
      </button>

      {/* Block types */}
      <select
        value={blockType}
        onChange={(e) => changeBlockType(e.target.value)}
        aria-label="Block type"
        className="border rounded p-1"
      >
        <option value="paragraph">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
      </select>
    </div>
  );
}

// Paste image as base64 HTML
function ImagePasteHandler() {
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

            const reader = new FileReader();
            reader.onload = () => {
              const dataUrl = reader.result;
              editor.update(() => {
                const htmlString = `<img src="${dataUrl}" alt="pasted-image" style="max-width:100%;"/>`;
                editor.dispatchCommand(
                  // @ts-ignore
                  "INSERT_HTML_COMMAND",
                  htmlString
                );
              });
            };
            reader.readAsDataURL(file);

            return true;
          }
        }

        return false;
      },
      0
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

const style = `
  .editor-container table,
  .editor-container th,
  .editor-container td {
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

export default function LexicalEditorWithToolbar() {
  const [htmlOutput, setHtmlOutput] = useState("");

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
          <ImagePasteHandler />
          <HTMLExporter setHtml={setHtmlOutput} />
        </LexicalComposer>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">HTML Output with Borders:</h3>
          <pre
            className="bg-gray-100 p-4 rounded whitespace-pre-wrap max-h-[300px] overflow-auto"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {htmlOutput}
          </pre>
        </div>
      </div>
    </>
  );
}
