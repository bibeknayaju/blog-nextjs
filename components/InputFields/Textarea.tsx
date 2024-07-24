"use client";

import React from "react";

function Textarea({
  placeholder,
  className,
  name,
  rows,
  cols,
}: {
  placeholder: string;
  className: string;
  name: string;
  rows: number;
  cols: number;
}) {
  return (
    <div>
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded-md"
        rows={rows}
        cols={cols}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Textarea;
