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
