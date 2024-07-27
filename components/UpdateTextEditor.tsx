import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

interface EditorProps {
  onChange: (content: string) => void;
  value: string;
}

const TextEditor = ({ onChange, value }: EditorProps) => {
  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="text-editor h-[30vh] ">
      <ReactQuill
        className="h-full w-full overflow-y-scroll"
        value={value}
        onChange={handleEditorChange}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link", "image", "video"],
            ["clean"],
          ],
        }}
        formats={[
          "header",
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
          "image",
          "video",
        ]}
      />
    </div>
  );
};

export default TextEditor;
