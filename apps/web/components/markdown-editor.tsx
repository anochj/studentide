import { useEffect, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "./ui/minimal-tiptap";

export function MarkdownEditor() {
	const [value, setValue] = useState<Content>("");
    useEffect(() => {
        console.log("Markdown content:", value);
    }, [value]);

	return (
		<MinimalTiptapEditor
			value={value}
			onChange={setValue}
			className="w-full"
			editorContentClassName="p-5"
			output="html"
			placeholder="Enter your description..."
			autofocus={true}
			editable={true}
			editorClassName="focus:outline-hidden"
		/>
	);
}
