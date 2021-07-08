import {
    ELEMENT_CODE_BLOCK,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_TD,
    KEYS_HEADING,
    ELEMENT_TODO_LI,
    ELEMENT_PARAGRAPH,
    isBlockAboveEmpty,
    isSelectionAtBlockStart,
} from "@udecode/slate-plugins";

export const optionsSoftBreakPlugin = {
    rules: [
        { hotkey: "shift+enter" },
        {
            hotkey: "enter",
            query: {
                allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
            },
        },
    ],
};

export const optionsExitBreakPlugin = {
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
                allow: KEYS_HEADING,
            },
        },
    ],
};
export const resetBlockTypesCommonRule = {
    types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
    defaultType: ELEMENT_PARAGRAPH,
};

export const optionsResetBlockTypePlugin = {
    rules: [
        {
            ...resetBlockTypesCommonRule,
            hotkey: "Enter",
            predicate: isBlockAboveEmpty,
        },
        {
            ...resetBlockTypesCommonRule,
            hotkey: "Backspace",
            predicate: isSelectionAtBlockStart,
        },
    ],
};
