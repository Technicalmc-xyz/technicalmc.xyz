import React, { useMemo, useState, FC } from "react";
import {
    ELEMENT_IMAGE,
    SlatePlugins,
    createReactPlugin,
    createHistoryPlugin,
    createParagraphPlugin,
    createBlockquotePlugin,
    createCodeBlockPlugin,
    createHeadingPlugin,
    createBoldPlugin,
    createItalicPlugin,
    createUnderlinePlugin,
    createStrikethroughPlugin,
    createCodePlugin,
    createTodoListPlugin,
    createImagePlugin,
    createLinkPlugin,
    createListPlugin,
    createTablePlugin,
    createMediaEmbedPlugin,
    createAlignPlugin,
    createHighlightPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createKbdPlugin,
    createNodeIdPlugin,
    createAutoformatPlugin,
    createResetNodePlugin,
    createSoftBreakPlugin,
    createExitBreakPlugin,
    createTrailingBlockPlugin,
    ELEMENT_PARAGRAPH,
    createSelectOnBackspacePlugin,
    createDeserializeHTMLPlugin,
    SlatePlugin,
    SPEditor,
    createSlatePluginsComponents,
    withProps,
    ELEMENT_OL,
    ELEMENT_UL,
    ELEMENT_H1,
    ELEMENT_H2,
} from "@udecode/slate-plugins";
import { editableProps, options } from "./EditorConfig";
import { ToolbarButtons } from "./ArticleToolbar";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import {
    optionsResetBlockTypePlugin,
    optionsSoftBreakPlugin,
    optionsExitBreakPlugin,
} from "./pluginOptions";
import { optionsAutoformat } from "./autoformatRules";
import { CustomUnorderedList, CustomOrderedList } from "./components/Listitems";
import { Heading1, Heading2 } from "./components/Headings";
import { DocumentOutline } from "./components/DocumentOutline";
import { createEditor } from "slate";

export interface ArticleEditorProps {
    readonly: boolean;
    placeholder?: string;
    initValue?: any[] | undefined;
}
type TEditor = SPEditor & ReactEditor & HistoryEditor;

const components = createSlatePluginsComponents({
    [ELEMENT_H1]: withProps(Heading1, {}),
    [ELEMENT_H2]: withProps(Heading2, {}),
    [ELEMENT_UL]: withProps(CustomUnorderedList, {}),
    [ELEMENT_OL]: withProps(CustomOrderedList, {}),
});

const ArticleEditor: FC<ArticleEditorProps> = ({
    readonly,
    initValue,
}: ArticleEditorProps) => {
    const [value, setValue] = useState<any[] | undefined>(initValue);
    const pluginsMemo: SlatePlugin<TEditor>[] = useMemo(() => {
        const plugins = [
            createReactPlugin(),
            createHistoryPlugin(),
            createParagraphPlugin(),
            createBlockquotePlugin(),
            createTodoListPlugin(),
            createHeadingPlugin(),
            createImagePlugin(),
            createLinkPlugin(),
            createListPlugin(),
            createTablePlugin(),
            createMediaEmbedPlugin(),
            createCodeBlockPlugin(),
            createAlignPlugin(),
            createBoldPlugin(),
            createCodePlugin(),
            createItalicPlugin(),
            createHighlightPlugin(),
            createUnderlinePlugin(),
            createStrikethroughPlugin(),
            createSubscriptPlugin(),
            createSuperscriptPlugin(),
            createKbdPlugin(),
            createNodeIdPlugin(),
            createAutoformatPlugin(optionsAutoformat),
            createResetNodePlugin(optionsResetBlockTypePlugin),
            createSoftBreakPlugin(optionsSoftBreakPlugin),
            createExitBreakPlugin(optionsExitBreakPlugin),
            createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
            createSelectOnBackspacePlugin({ allow: ELEMENT_IMAGE }),
        ];

        plugins.push(createDeserializeHTMLPlugin({ plugins }));

        return plugins;
    }, [options]);
    let editor = createEditor();
    return (
        <SlatePlugins
            editableProps={{ ...editableProps, readOnly: readonly }}
            options={options}
            initialValue={value}
            plugins={pluginsMemo}
            components={components}
            editor={editor as TEditor}
            onChange={(newValue) => {
                setValue(newValue);
                localStorage.setItem("content", JSON.stringify(value));
            }}
        >
            {readonly ? (
                <DocumentOutline editor={editor} />
            ) : (
                <ToolbarButtons />
            )}
        </SlatePlugins>
    );
};
export default ArticleEditor;
