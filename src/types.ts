export type NoteType = {
	title: string;
	text: string;
	date: string;
	id: string;
	activeTags: { name: string; color: string }[];
};

export type TagType = {
	name: string;
	color: string;
};

export interface NoteInputProps {
	note: NoteType;
	handleDeleteNote?: () => void;
	activeTagRemovalCallback?: (note: NoteType, activeTag: TagType) => void;
}

export interface GroupProps {
	notes: NoteType[]
	tag: TagType;
	handleActiveTagRemoval: (note: NoteType, activeTag: TagType) => void
}
export interface UntaggedGroupProps {
	notes_with_no_tags: NoteType[];
	handleActiveTagRemoval: (note: NoteType, activeTag: TagType) => void;
}