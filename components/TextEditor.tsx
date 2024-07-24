"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  ColorStyleButton,
  CreateLinkButton,
  FileCaptionButton,
  FileReplaceButton,
  FormattingToolbar,
  FormattingToolbarController,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
} from "@blocknote/react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";

interface EditorProps {
  onChange: (content: string) => void;
  initialContent?: string;
}

export default function TextEditor({ onChange, initialContent }: EditorProps) {
  // Creates a new editor instance.
  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  // Function to convert content to HTML
  const contentToHtml = (document: any) => {
    let html = "";
    let currentListType = "";

    document.forEach((block: any) => {
      let blockHtml = "";

      block.content.forEach((item: any) => {
        let itemHtml = item.text || "";

        // Apply styles
        if (item.styles) {
          if (item.styles.bold) itemHtml = `<strong>${itemHtml}</strong>`;
          if (item.styles.italic) itemHtml = `<em>${itemHtml}</em>`;
          if (item.styles.underline) itemHtml = `<u>${itemHtml}</u>`;
          if (item.styles.strike) itemHtml = `<s>${itemHtml}</s>`;
          if (item.styles.code) itemHtml = `<code>${itemHtml}</code>`;
          if (item.styles.color)
            itemHtml = `<span style="color: ${item.styles.color}">${itemHtml}</span>`;
          if (item.styles.backgroundColor)
            itemHtml = `<span style="background-color: ${item.styles.backgroundColor}">${itemHtml}</span>`;
        }

        // Handle links
        if (item.type === "link" && item.attrs && item.attrs.href) {
          itemHtml = `<a href="${item.attrs.href}" target="${
            item.attrs.target || "_self"
          }">${itemHtml}</a>`;
        }

        blockHtml += itemHtml;
      });

      // Determine block tag with optional text alignment style
      const textAlignStyle =
        block.props && block.props.textAlignment
          ? ` style="text-align: ${block.props.textAlignment}"`
          : "";
      if (block.type === "heading") {
        blockHtml = `<h${block.props.level}${textAlignStyle}>${blockHtml}</h${block.props.level}>`;
      } else if (block.type === "paragraph") {
        blockHtml = `<p${textAlignStyle}>${blockHtml}</p>`;
      } else if (block.type === "list-item") {
        if (block.props.listType !== currentListType) {
          if (currentListType) {
            html += currentListType === "ordered" ? "</ol>" : "</ul>";
          }
          currentListType = block.props.listType;
          html += currentListType === "ordered" ? "<ol>" : "<ul>";
        }
        blockHtml = `<li${textAlignStyle}>${blockHtml}</li>`;
      }

      html += blockHtml;
    });

    if (currentListType) {
      html += currentListType === "ordered" ? "</ol>" : "</ul>";
    }

    return html;
  };

  // Handle editor content changes
  const handleEditorChange = () => {
    const contentHtml = contentToHtml(editor.document);
    console.log("Extracted content:", contentHtml);
    onChange(contentHtml);
  };

  return (
    <div className="h-fit mt-10 w-[80vw]">
      <BlockNoteView
        theme={"dark"}
        editor={editor}
        onChange={handleEditorChange}
        formattingToolbar={false}>
        <FormattingToolbarController
          formattingToolbar={() => (
            <FormattingToolbar>
              <BlockTypeSelect key={"blockTypeSelect"} />
              <FileCaptionButton key={"fileCaptionButton"} />
              <FileReplaceButton key={"replaceFileButton"} />
              <BasicTextStyleButton
                basicTextStyle={"bold"}
                key={"boldStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"italic"}
                key={"italicStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"underline"}
                key={"underlineStyleButton"}
              />
              <BasicTextStyleButton
                basicTextStyle={"strike"}
                key={"strikeStyleButton"}
              />
              <BasicTextStyleButton
                key={"codeStyleButton"}
                basicTextStyle={"code"}
              />
              <TextAlignButton
                textAlignment={"left"}
                key={"textAlignLeftButton"}
              />
              <TextAlignButton
                textAlignment={"center"}
                key={"textAlignCenterButton"}
              />
              <TextAlignButton
                textAlignment={"right"}
                key={"textAlignRightButton"}
              />
              <ColorStyleButton key={"colorStyleButton"} />
              <NestBlockButton key={"nestBlockButton"} />
              <UnnestBlockButton key={"unnestBlockButton"} />
              <CreateLinkButton key={"createLinkButton"} />
            </FormattingToolbar>
          )}
        />
      </BlockNoteView>
    </div>
  );
}
