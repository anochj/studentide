import type { Content } from "@tiptap/react";
import { useEffect, useState } from "react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";

type MarkdownEditorProps = {
	content?: string;
	onContentChange?: (content: Content) => void;
};

export function MarkdownEditor({
	content,
	onContentChange,
}: MarkdownEditorProps) {
	const [value, setValue] = useState<Content>(content || "");

	useEffect(() => {
		setValue((current) => (content && !current ? content : current));
	}, [content]);

	function handleChange(nextValue: Content) {
		setValue(nextValue);
		onContentChange?.(nextValue);
	}

	return (
		<MinimalTiptapEditor
			value={value}
			onChange={handleChange}
			className="w-full h-full flex flex-col"
			editorContentClassName="p-5 flex-1 overflow-y-auto "
			output="markdown"
			placeholder="Supports standard markdown formatting, as well as code blocks with syntax highlighting. Perfect for writing detailed project descriptions and instructions!"
			autofocus={true}
			editable={true}
			editorClassName="focus:outline-hidden flex-1 h-full min-h-32"
			// TODO: Add cdn uploading for images
			// https://gemini.google.com/app/31b848e8e758100a
		/>
	);
}
