import {
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    createSlatePluginsOptions,
} from "@udecode/slate-plugins";



export const options = createSlatePluginsOptions({
    [ELEMENT_H1]: {
        hotkey: ["mod+opt+1", "mod+shift+1"],
    },
    [ELEMENT_H2]: {
        hotkey: ["mod+opt+2", "mod+shift+2"],
    },
    [ELEMENT_H3]: {
        hotkey: ["mod+opt+3", "mod+shift+3"],
    },
});

export const editableProps = {
    placeholder: "Start writing here...",
}