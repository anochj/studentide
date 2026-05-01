import type { Content } from "@tiptap/react";
import { useEffect, useState } from "react";
import { MinimalTiptapEditor } from "./ui/minimal-tiptap";

type MarkdownEditorProps = {
	content?: string;
	onContentChange?: (content: Content) => void;
};

export function MarkdownEditor({
	content,
	onContentChange,
}: MarkdownEditorProps) {
	const [value, setValue] = useState<Content>(content|| "");

	useEffect(() => {
		if (onContentChange) onContentChange(value);
	}, [value, onContentChange]);

	useEffect(() => {
		setValue((current) => (content && !current ? content : current));
	}, [content]);

	return (
		<MinimalTiptapEditor
			value={value}
			onChange={setValue}
			className="w-full h-full flex flex-col"
			editorContentClassName="p-5 flex-1 overflow-y-auto"
			output="markdown"
			placeholder="Enter the project outline. This will be visible to students and can include instructions, resources, and any other relevant information."
			autofocus={true}
			editable={true}
			editorClassName="focus:outline-hidden flex-1 h-full"
			// TODO: Add cdn uploading for images
			// https://gemini.google.com/app/31b848e8e758100a
		/>
	);
}
