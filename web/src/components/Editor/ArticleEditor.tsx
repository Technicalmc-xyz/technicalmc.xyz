import React, { useMemo, useState } from "react";
import { withHistory } from "slate-history";
import { createEditor, Node } from "slate";
import { Slate, withReact } from "slate-react";
import {
    ParagraphPlugin,
    BoldPlugin,
    EditablePlugins,
    ItalicPlugin,
    UnderlinePlugin,
    LinkPlugin,
    pipe,
    SlateDocument,
    withLink,
    CodeBlockPlugin,
    AlignPlugin,
    HeadingPlugin,
    SubscriptPlugin,
    SuperscriptPlugin,
    withCodeBlock,
    ImagePlugin,
    withImageUpload,
    withSelectOnBackspace,
    ELEMENT_IMAGE,
    withDeserializeHTML,
    BlockquotePlugin,
    ListPlugin,
    withList,
    TodoListPlugin,
    SoftBreakPlugin,
    ExitBreakPlugin,
    TablePlugin,
    withTable,
    ELEMENT_TABLE,
    StrikethroughPlugin,
    withAutoformat,
} from "@udecode/slate-plugins";
import { FC } from "react";
import { options, headingTypes, autoformatRules } from "./EditorConfig";
import { ArticleEditorToolbar } from "./ArticleToolbar";


const plugins = [
    ParagraphPlugin(options),
    BoldPlugin(options),
    ItalicPlugin(options),
    UnderlinePlugin(options),
    LinkPlugin(options),
    HeadingPlugin(options),
    AlignPlugin(options),
    SubscriptPlugin(options),
    SuperscriptPlugin(options),
    CodeBlockPlugin(options),
    ImagePlugin(options),
    BlockquotePlugin(options),
    ListPlugin(options),
    TodoListPlugin(options),
    TablePlugin(options),
    StrikethroughPlugin(options),
    SoftBreakPlugin({
        rules: [
            { hotkey: "shift+enter" },
            {
                hotkey: "enter",
                query: {
                    allow: [
                        options.code_block.type,
                        options.blockquote.type,
                        options.td.type,
                    ],
                },
            },
        ],
    }),
    ExitBreakPlugin({
        rules: [
            {
                hotkey: "mod+enter",
            },
            {
                hotkey: "mod+shift+enter",
                before: true,
            },
            {
                hotkey: "enter",
                query: {
                    start: true,
                    end: true,
                    allow: headingTypes,
                },
            },
        ],
    }),
];
const withPlugins = [
    withReact,
    withHistory,
    withLink(),
    withCodeBlock(options),
    withImageUpload(),
    withList(options),
    withTable(),
    withDeserializeHTML({ plugins }),
    withSelectOnBackspace({ allow: [ELEMENT_IMAGE, ELEMENT_TABLE] }),
    withAutoformat({ rules: autoformatRules }),
] as const;

export interface ArticleEditorProps {
    readonly: boolean;
    initValue: SlateDocument;
    placeholder?: string;
}

const ArticleEditor: FC<ArticleEditorProps> = ({
    readonly,
    initValue,
    placeholder,
}: ArticleEditorProps) => {
    const [value, setValue] = useState<Node[]>(initValue);
    const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);
    return (
        <Slate
            editor={editor}
            value={value}
            onChange={(newValue) => {
                setValue(newValue as SlateDocument);
                localStorage.setItem("content", JSON.stringify(value));
            }}
        >
            {readonly ? null : <ArticleEditorToolbar />}
            <EditablePlugins
                plugins={plugins}
                readOnly={readonly}
                placeholder={placeholder}
            />
        </Slate>
    );
};
export default ArticleEditor;
