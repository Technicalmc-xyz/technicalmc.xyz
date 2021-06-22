import {
    HeadingToolbar,
    ToolbarLink,
    ToolbarMark,
    MARK_BOLD,
    MARK_ITALIC,
    MARK_UNDERLINE,
    ToolbarElement,
    ToolbarList,
    // ToolbarCodeBlock,
    MARK_STRIKETHROUGH,
    MARK_CODE,
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
} from "@udecode/slate-plugins";
import { options } from "./EditorConfig";
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
export const ArticleEditorToolbar = () => (
    <HeadingToolbar
        // className="flex flex-wrap ticky top-0 z-20 bg-gray-50" 
        styles={{
            root: {
                flexWrap: "wrap",
                position: "sticky",
                top: "4.50rem",
                background: "white",
                zIndex: 9,
                width: "full",
                // border: "1px red solid"

            },
        }}
    >
        {/* Elements */}
        <ToolbarElement
            type={options.h1.type}
            icon={<MdLooksOne size={"2em"} />}
        />
        <ToolbarElement type={options.h2.type} icon={<MdLooksTwo />} />
        <ToolbarElement type={options.h3.type} icon={<MdLooks3 />} />
        {/* Marks */}
        <ToolbarMark type={MARK_BOLD} icon={<MdFormatBold size="40" />} />
        <ToolbarMark type={MARK_ITALIC} icon={<MdFormatItalic />} />
        <ToolbarMark type={MARK_UNDERLINE} icon={<MdFormatUnderlined />} />
        <ToolbarMark
            type={MARK_STRIKETHROUGH}
            icon={<MdFormatStrikethrough />}
        />
        <ToolbarElement
            type={options.blockquote.type}
            icon={<BsBlockquoteLeft />}
        />
        <ToolbarCodeBlock
            type={options.code_block.type}
            icon={<BiCodeBlock />}
        />
        <ToolbarMark type={MARK_CODE} icon={<MdCode />} />
        <ToolbarList
            typeList={options.ul.type}
            icon={<MdFormatListBulleted />}
        />
        <ToolbarList
            typeList={options.ol.type}
            icon={<MdFormatListNumbered />}
        />
        <ToolbarMark
            type={MARK_SUPERSCRIPT}
            clear={MARK_SUPERSCRIPT}
            icon={<FaSuperscript />}
        />
        <ToolbarMark
            type={MARK_SUBSCRIPT}
            clear={MARK_SUBSCRIPT}
            icon={<FaSubscript />}
        />
        {/* ALIGNMENT TOOLBAR OPTIONS */}
        <ToolbarAlign
            type={options.align_left.type}
            icon={<MdFormatAlignLeft />}
        />
        <ToolbarAlign
            type={options.align_center.type}
            icon={<MdFormatAlignCenter />}
        />
        <ToolbarAlign
            type={options.align_right.type}
            icon={<MdFormatAlignRight />}
        />
        <ToolbarAlign
            type={options.align_justify.type}
            icon={<MdFormatAlignJustify />}
        />
        <ToolbarLink icon={<AiOutlineLink />} />
        <ToolbarImage icon={<MdImage />} />
        <ToolbarTable icon={<MdBorderAll />} transform={insertTable} />
        <ToolbarTable icon={<MdBorderClear />} transform={deleteTable} />
        <ToolbarTable icon={<MdBorderBottom />} transform={addRow} />
        <ToolbarTable icon={<MdBorderTop />} transform={deleteRow} />
        <ToolbarTable icon={<MdBorderLeft />} transform={addColumn} />
        <ToolbarTable icon={<MdBorderRight />} transform={deleteColumn} />
    </HeadingToolbar>
);
