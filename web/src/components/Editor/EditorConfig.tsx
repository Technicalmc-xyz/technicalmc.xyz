import { Editor } from "slate";
import {
    AutoformatRule,
    insertCodeBlock,
    toggleList,
    unwrapList,
    DEFAULTS_ALIGN,
    DEFAULTS_BLOCKQUOTE,
    DEFAULTS_BOLD,
    DEFAULTS_CODE,
    DEFAULTS_CODE_BLOCK,
    DEFAULTS_HEADING,
    DEFAULTS_HIGHLIGHT,
    DEFAULTS_IMAGE,
    DEFAULTS_ITALIC,
    DEFAULTS_KBD,
    DEFAULTS_LINK,
    DEFAULTS_LIST,
    DEFAULTS_MEDIA_EMBED,
    DEFAULTS_MENTION,
    DEFAULTS_PARAGRAPH,
    DEFAULTS_SEARCH_HIGHLIGHT,
    DEFAULTS_STRIKETHROUGH,
    DEFAULTS_SUBSUPSCRIPT,
    DEFAULTS_TABLE,
    DEFAULTS_TODO_LIST,
    DEFAULTS_UNDERLINE,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    setDefaults,
} from "@udecode/slate-plugins";

export const headingTypes = [
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
];

export const headingOptions = {
    ...DEFAULTS_HEADING,
    h1: {
        ...DEFAULTS_HEADING.h1,
        hotkey: ["mod+opt+1", "mod+shift+1"],
    },
    h2: {
        ...DEFAULTS_HEADING.h2,
        hotkey: ["mod+opt+2", "mod+shift+2"],
    },
    h3: {
        ...DEFAULTS_HEADING.h3,
        hotkey: ["mod+opt+3", "mod+shift+3"],
    },
};

export const options = {
    ...setDefaults(DEFAULTS_PARAGRAPH, {}),
    ...setDefaults(DEFAULTS_MENTION, {}),
    ...setDefaults(DEFAULTS_BLOCKQUOTE, {}),
    ...setDefaults(DEFAULTS_CODE_BLOCK, {}),
    ...setDefaults(DEFAULTS_LINK, {}),
    ...setDefaults(DEFAULTS_IMAGE, {}),
    ...setDefaults(DEFAULTS_MEDIA_EMBED, {}),
    ...setDefaults(DEFAULTS_TODO_LIST, {}),
    ...setDefaults(DEFAULTS_TABLE, {}),
    ...setDefaults(DEFAULTS_LIST, {}),
    ...setDefaults(headingOptions, {}),
    ...setDefaults(DEFAULTS_ALIGN, {}),
    ...setDefaults(DEFAULTS_BOLD, {}),
    ...setDefaults(DEFAULTS_ITALIC, {}),
    ...setDefaults(DEFAULTS_UNDERLINE, {}),
    ...setDefaults(DEFAULTS_STRIKETHROUGH, {}),
    ...setDefaults(DEFAULTS_CODE, {}),
    ...setDefaults(DEFAULTS_KBD, {}),
    ...setDefaults(DEFAULTS_SUBSUPSCRIPT, {}),
    ...setDefaults(DEFAULTS_HIGHLIGHT, {}),
    ...setDefaults(DEFAULTS_SEARCH_HIGHLIGHT, {}),
};

const preFormat = (editor: Editor) => unwrapList(editor, options);

export const autoformatRules: AutoformatRule[] = [
    {
        type: options.h1.type,
        markup: "#",
        preFormat,
    },
    {
        type: options.h2.type,
        markup: "##",
        preFormat,
    },
    {
        type: options.h3.type,
        markup: "###",
        preFormat,
    },
    {
        type: options.li.type,
        markup: ["*", "-"],
        preFormat,
        format: (editor) => {
            toggleList(editor, { ...options, typeList: options.ul.type });
        },
    },
    {
        type: options.li.type,
        markup: ["1.", "1)"],
        preFormat,
        format: (editor) => {
            toggleList(editor, { ...options, typeList: options.ol.type });
        },
    },
    {
        type: options.todo_li.type,
        markup: ["[]"],
    },
    {
        type: options.blockquote.type,
        markup: [">"],
        preFormat,
    },
    {
        type: options.bold.type,
        between: ["**", "**"],
        mode: "inline",
        insertTrigger: true,
    },
    {
        type: options.bold.type,
        between: ["__", "__"],
        mode: "inline",
        insertTrigger: true,
    },
    {
        type: options.italic.type,
        between: ["*", "*"],
        mode: "inline",
        insertTrigger: true,
    },
    {
        type: options.italic.type,
        between: ["_", "_"],
        mode: "inline",
        insertTrigger: true,
    },
    {
        type: options.code.type,
        between: ["`", "`"],
        mode: "inline",
        insertTrigger: true,
    },
    {
        type: options.strikethrough.type,
        between: ["~~", "~~"],
        mode: "inline",
        insertTrigger: true,
    },
    {
        type: options.code_block.type,
        markup: "``",
        trigger: "`",
        triggerAtBlockStart: false,
        preFormat,
        format: (editor) => {
            insertCodeBlock(editor, { select: true }, options);
        },
    },
];
