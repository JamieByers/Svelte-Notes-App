import type { NoteType, TagType } from './types';

export function getAllNotes() {
	let allNotes = JSON.parse(localStorage.getItem('notes')!) || [];

	return {
		allNotes,
		get notes() {
			return allNotes;
		}
	};
}

function getNotes() {
	return JSON.parse(localStorage.getItem('notes')!) || [];
}
function setNotes(newNotes: NoteType[]) {
	return localStorage.setItem('notes', JSON.stringify(newNotes));
}
function removeNote(note: NoteType) {
	const notes: NoteType[] = getNotes();
	const newNotes: NoteType[] = notes.filter((n: NoteType) => n.id !== note.id);
	setNotes(newNotes);
    return newNotes
}



function getTags() {
	return JSON.parse(localStorage.getItem('tags')!) || [];
}
function setTags(newTags: TagType[]) {
	localStorage.setItem('tags', JSON.stringify(newTags));
}
function removeTag(tag: TagType) {
	const tags = getTags();
	const newTags = tags.filter((t: TagType) => t.name !== tag.name);
	setTags(newTags);
}

function handleTagNoteRemove(tag: TagType, note: NoteType): TagType[] {
	let notes = getNotes();
	let noteIndex = notes.findIndex((n: any) => n.id === note.id);

	if (noteIndex !== -1) {
		notes[noteIndex].activeTags = notes[noteIndex].activeTags.filter(
			(t: TagType) => t.name !== tag.name
		);
		setNotes(notes);

		return notes[noteIndex].activeTags;
	}

	return [];
}

export { getNotes, setNotes, removeNote, getTags, setTags, removeTag, handleTagNoteRemove };
