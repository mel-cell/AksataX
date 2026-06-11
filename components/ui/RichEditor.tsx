"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false },
);

import "ckeditor5/ckeditor5.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
};



export default function RichEditor({ value, onChange }: Props) {
  const [ready, setReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [EditorClass, setEditorClass] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    import("ckeditor5").then((ck) => {
      const {
        ClassicEditor,
        Essentials,
        Bold,
        Italic,
        Heading,
        List,
        Link,
        Paragraph,
        Image,
        ImageToolbar,
        ImageUpload,
        ImageTextAlternative,
        BlockQuote,
        Undo,
        Base64UploadAdapter,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } = ck as any;

      setEditorClass(() => ClassicEditor);
      setPlugins([
        Essentials,
        Bold,
        Italic,
        Heading,
        List,
        Link,
        Paragraph,
        Image,
        ImageToolbar,
        ImageUpload,
        ImageTextAlternative,
        BlockQuote,
        Undo,
        Base64UploadAdapter,
      ]);
      setReady(true);
    });
  }, []);

  const config = useMemo(
    () => ({
      licenseKey: "GPL",
      plugins,
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "|",
        "blockQuote",
        "uploadImage",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "undo",
        "redo",
      ],
      image: {
        toolbar: ["imageTextAlternative"],
      },
    }),
    [plugins],
  );

  if (!ready || !CKEditor) {
    return (
      <div className="border border-border rounded-lg flex items-center justify-center h-[250px] text-muted-foreground text-sm">
        Memuat editor...
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ck-body {
          z-index: 9999 !important;
        }
        .ck.ck-dropdown__panel {
          z-index: 9999 !important;
        }
        .ck.ck-toolbar {
          padding: 2px 4px !important;
        }
        .ck.ck-toolbar .ck-button {
          min-height: 26px !important;
          min-width: 26px !important;
          padding: 2px !important;
          font-size: 12px !important;
        }
        .ck.ck-toolbar .ck-button .ck-button__label {
          font-size: 11px !important;
        }
        .ck.ck-toolbar .ck-dropdown .ck-dropdown__button {
          min-height: 26px !important;
          padding: 2px 6px !important;
        }
        .ck.ck-toolbar .ck-toolbar__separator {
          margin: 0 2px !important;
        }
        .ck.ck-editor__editable {
          font-size: 14px !important;
        }
      `}</style>
      <div className="border border-border rounded-lg relative [&_.ck-editor__editable]:min-h-[250px] [&_.ck-editor__editable]:px-4 [&_.ck-content]:text-sm [&_.ck-content]:text-card-foreground [&_.ck-toolbar]:border-b [&_.ck-toolbar]:border-border [&_.ck-toolbar]:bg-sidebar-accent">
        <CKEditor
          editor={EditorClass}
          config={config}
          data={value}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(_event: any, editor: any) => {
            onChange(editor.getData());
          }}
        />
      </div>
    </>
  );
}
