import type { Content } from "@tiptap/react";
import { useEffect, useState } from "react";
import { MinimalTiptapEditor } from "../ui/minimal-tiptap";
import { upload } from "@vercel/blob/client";

type MarkdownEditorProps = {
	content?: string;
	onContentChange?: (content: Content) => void;
};

async function uploadImageToCDN(file: File): Promise<string> {
	const newBlob = await upload(file.name, file, {
		access: "public",
		handleUploadUrl: "/api/blob-upload",
	});

	return newBlob.url;
}

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
			editorContentClassName="p-5 flex-1 overflow-y-auto min-h-32"
			output="markdown"
			placeholder="Supports standard markdown formatting, as well as code blocks with syntax highlighting. Perfect for writing detailed project descriptions and instructions!"
			autofocus={true}
			editable={true}
			editorClassName="focus:outline-hidden flex-1 h-full min-h-32"
			editorProps={{
				handlePaste: (view, event) => {
					const items = Array.from(event.clipboardData?.items || []);
					const imageItems = items.filter((item) =>
						item.type.startsWith("image"),
					);
					if (imageItems.length === 0) return false;

					event.preventDefault();

					imageItems.forEach(async (item) => {
						const file = item.getAsFile();
						if (!file) return;

						try {
							console.log("Image file ready for upload:", file);

							const url = await uploadImageToCDN(file);

							// Insert the new image node with the CDN URL
							const { schema } = view.state;
							const node = schema.nodes.image.create({ src: url });
							const transaction = view.state.tr.replaceSelectionWith(node);
							view.dispatch(transaction);
						} catch (error) {
							console.error("Upload failed", error);
						}
					});

					return true;
				},

				handleDrop: (view, event, slice, moved) => {
					if (
						!event.dataTransfer ||
						!event.dataTransfer.files ||
						event.dataTransfer.files.length === 0
					) {
						return false;
					}

					const files = Array.from(event.dataTransfer.files);
					const imageFiles = files.filter((file) =>
						file.type.startsWith("image"),
					);

					if (imageFiles.length === 0) return false;

					event.preventDefault();

					const coordinates = view.posAtCoords({
						left: event.clientX,
						top: event.clientY,
					});
					if (!coordinates) return false;

					imageFiles.forEach(async (file) => {
						try {
							const url = await uploadImageToCDN(file);

							const { schema } = view.state;
							const node = schema.nodes.image.create({ src: url });
							const transaction = view.state.tr.insert(coordinates.pos, node);
							view.dispatch(transaction);
						} catch (error) {
							console.error("Upload failed", error);
						}
					});

					return true;
				},
			}}
		/>
	);
}
