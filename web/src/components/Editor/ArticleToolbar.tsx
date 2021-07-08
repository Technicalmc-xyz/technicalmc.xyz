import {
    HeadingToolbar,
    ToolbarLink,
    ToolbarMark,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_UNDERLINE,
    ToolbarElement,
    ToolbarList,
    MARK_STRIKETHROUGH,
    MARK_SUPERSCRIPT,
    MARK_SUBSCRIPT,
    ToolbarAlign,
    ToolbarImage,
    ToolbarTable,
    insertTable,
    deleteTable,
    addRow,
    deleteRow,
    addColumn,
    deleteColumn,
    ToolbarCodeBlock,
    getSlatePluginType,
    ELEMENT_H1,
    useStoreEditorRef,
    useEventEditorId,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_CODE_BLOCK,
    ELEMENT_BLOCKQUOTE,
    ELEMENT_LI,
    ELEMENT_OL,
    ELEMENT_ALIGN_RIGHT,
    ELEMENT_ALIGN_CENTER,
    ELEMENT_ALIGN_JUSTIFY,
    MARK_CODE,
    ELEMENT_UL,
} from "@udecode/slate-plugins";
import {
    MdLooksOne,
    MdLooksTwo,
    MdLooks3,
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined,
    MdFormatStrikethrough,
    MdCode,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdFormatAlignLeft,
    MdFormatAlignCenter,
    MdFormatAlignRight,
    MdFormatAlignJustify,
    MdImage,
    MdBorderAll,
    MdBorderClear,
    MdBorderBottom,
    MdBorderTop,
    MdBorderLeft,
    MdBorderRight,
} from "react-icons/md";
import { BsBlockquoteLeft } from "react-icons/bs";
import { BiCodeBlock } from "react-icons/bi";
import { FaSuperscript, FaSubscript } from "react-icons/fa";
import { AiOutlineLink } from "react-icons/ai";
export const ToolbarButtonsBasicElements = () => {
    const editor = useStoreEditorRef(useEventEditorId("focus"));

    return (
        <>
            <ToolbarElement
                type={getSlatePluginType(editor, ELEMENT_H1)}
                icon={<MdLooksOne />}
            />
            <ToolbarElement
                type={getSlatePluginType(editor, ELEMENT_H2)}
                icon={<MdLooksTwo />}
            />
            <ToolbarElement
                type={getSlatePluginType(editor, ELEMENT_H3)}
                icon={<MdLooks3 />}
            />
            <ToolbarElement
                type={getSlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
                icon={<BsBlockquoteLeft />}
            />
            <ToolbarCodeBlock
                type={getSlatePluginType(editor, ELEMENT_CODE_BLOCK)}
                icon={<BiCodeBlock />}
            />
        </>
    );
};

export const ToolbarButtonsList = () => {
    const editor = useStoreEditorRef(useEventEditorId("focus"));

    return (
        <>
            <ToolbarList
                type={getSlatePluginType(editor, ELEMENT_UL)}
                icon={<MdFormatListBulleted />}
            />
            <ToolbarList
                type={getSlatePluginType(editor, ELEMENT_OL)}
                icon={<MdFormatListNumbered />}
            />
        </>
    );
};

export const ToolbarButtonsAlign = () => {
    const editor = useStoreEditorRef(useEventEditorId("focus"));

    return (
        <>
            <ToolbarAlign icon={<MdFormatAlignLeft />} />
            <ToolbarAlign
                type={getSlatePluginType(editor, ELEMENT_ALIGN_CENTER)}
                icon={<MdFormatAlignCenter />}
            />
            <ToolbarAlign
                type={getSlatePluginType(editor, ELEMENT_ALIGN_RIGHT)}
                icon={<MdFormatAlignRight />}
            />
            <ToolbarAlign
                type={getSlatePluginType(editor, ELEMENT_ALIGN_JUSTIFY)}
                icon={<MdFormatAlignJustify />}
            />
        </>
    );
};

export const ToolbarButtonsBasicMarks = () => {
    const editor = useStoreEditorRef(useEventEditorId("focus"));

    return (
        <>
            <ToolbarMark
                type={getSlatePluginType(editor, MARK_BOLD)}
                icon={<MdFormatBold />}
            />
            <ToolbarMark
                type={getSlatePluginType(editor, MARK_ITALIC)}
                icon={<MdFormatItalic />}
            />
            <ToolbarMark
                type={getSlatePluginType(editor, MARK_UNDERLINE)}
                icon={<MdFormatUnderlined />}
            />
            <ToolbarMark
                type={getSlatePluginType(editor, MARK_STRIKETHROUGH)}
                icon={<MdFormatStrikethrough />}
            />
            <ToolbarMark
                type={getSlatePluginType(editor, MARK_CODE)}
                icon={<MdCode />}
            />
            <ToolbarMark
                type={getSlatePluginType(editor, MARK_SUPERSCRIPT)}
                clear={getSlatePluginType(editor, MARK_SUBSCRIPT)}
                icon={<FaSuperscript />}
            />
            <ToolbarMark
                type={getSlatePluginType(editor, MARK_SUBSCRIPT)}
                clear={getSlatePluginType(editor, MARK_SUPERSCRIPT)}
                icon={<FaSubscript />}
            />
        </>
    );
};

export const ToolbarButtonsTable = () => (
    <>
        <ToolbarTable icon={<MdBorderAll />} transform={insertTable} />
        <ToolbarTable icon={<MdBorderClear />} transform={deleteTable} />
        <ToolbarTable icon={<MdBorderBottom />} transform={addRow} />
        <ToolbarTable icon={<MdBorderTop />} transform={deleteRow} />
        <ToolbarTable icon={<MdBorderLeft />} transform={addColumn} />
        <ToolbarTable icon={<MdBorderRight />} transform={deleteColumn} />
    </>
);
export const ToolbarButtons = () => (
    <HeadingToolbar>
        <ToolbarButtonsBasicElements />
        <ToolbarButtonsList />
        <ToolbarButtonsBasicMarks />
        <ToolbarButtonsAlign />
        <ToolbarLink icon={<AiOutlineLink />} />
        <ToolbarImage icon={<MdImage />} />
        <ToolbarButtonsTable />
    </HeadingToolbar>
);
