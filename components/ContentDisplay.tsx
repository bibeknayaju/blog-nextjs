import React from "react";
import DOMPurify from "isomorphic-dompurify";

interface ContentDisplayProps {
  content: string;
}

const ContentDisplay = ({ content }: ContentDisplayProps) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className="content-display max-w-[60rem] mx-auto"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default ContentDisplay;
