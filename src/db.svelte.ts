import { createClient, type User } from '@supabase/supabase-js';
import { goto } from '$app/navigation';
import type { NoteType, TagType } from './types';

export const supabase = createClient(
	'https://vvtibvjudvdwarssjjsl.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2dGlidmp1ZHZkd2Fyc3NqanNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzNTQ4MzcsImV4cCI6MjAzNDkzMDgzN30.-oAczYGRHHPIi6HQ3fF6WoxZOAtmz7IEFpOZDoDvG7E'
);

let user: any = $state();

supabase.auth.getSession().then(({ data }) => {
	user = data.session?.user;
});

supabase.auth.onAuthStateChange((event, session) => {
	if (event == 'SIGNED_IN' && session) {
		user = session.user;
	} else if (event == 'SIGNED_OUT') {
		user = null;
	}
});

export default {
	get user() {
		return user;
	},
	async signIn(email: string, password: string) {
		console.log('SIGNING IN');
		let signin = await supabase.auth.signInWithPassword({ email, password });
		goto('http://localhost:5173/notes');
		console.log(signin);
	},
	signUp(email: string, password: string) {
		goto('http://localhost:5173/notes');
		return supabase.auth.signUp({ email, password });
	},
	signOut() {
		return supabase.auth.signOut();
	},
	notes: {
		async all() {
			if (user) {
				const { data, error } = await supabase.from('notes').select('*');
				console.log('NOTES FROM SERVER', data, 'ERROR ', error);
				return data;
			}
		},
		async add(note: NoteType) {
			const { error } = await supabase.from('notes').insert({
				user_id: user.id,
				id: note.id,
				title: note.title,
				text: note.text,
				date: note.date,
				activeTags: note.activeTags
			});
			console.log('ADDING NOTE TO DATABASE: ', note);
			console.log(error);
		},
		async remove(note: NoteType) {
			const { response } = await supabase.from('notes').delete().eq('id', note.id);
			console.log('REMOVING NOTE FROM DATABASE: ', note);
			console.log(response);
		},
		async save(note: NoteType) {
			const { error } = await supabase
				.from('notes')
				.update({
					title: note.title,
					text: note.text,
					activeTags: note.activeTags
				})
				.eq('id', note.id);
			console.log('UPDATING NOTE IN DATABASE: ', note);
			console.log(error);
		},
		async note(note: NoteType) {
			const { data, error } = await supabase.from('notes').select('id', note.id);
			console.log(error);
			return {
				data
			};
		},
		async getActiveTags(note: NoteType) {
			return await supabase.from("notes").select("activeTags", note.id)
		},
		async addActiveTag(note: NoteType, tag: TagType) {
			const { data, error } = await supabase.from('notes').select('activeTags', note.id);
			console.log(error);
			let notesWithNewTag = data;
			console.log('Noteswithnewtag', notesWithNewTag);
			// notesWithNewTag = [...notesWithNewTag, tag];
			// await supabase.from('notes').update({ activeTags: notesWithNewTag }).eq('id', note.id);
			// console.log("ADDED ", tag, "TO", note)
		},
		async removeActiveTag(note: NoteType, tag: TagType) {
			const { data, error } = await supabase.from('notes').select('activeTags', note.id);
			console.log(error);
			const activeTags = data;
			let activeTagsWithoutTag = activeTags.filter((t: TagType) => t.name !== tag.name);
			await supabase.from('notes').update({ activeTags: activeTagsWithoutTag }).eq('id', note.id);
			console.log('REMOVED ', tag, 'FROM', note);
		},
		async clearActiveTags(note: NoteType) {
			const { error } = await supabase.from('notes').update({ activeTags: [] }).eq("id", note.id);
			console.log(error)
		},
		async clear() {
			await supabase.from("notes").delete().eq("user_id", user.id)
		}
	},
	tags: {
		async all() {
			if (user) {
				const { data, error } = await supabase.from('tags').select('*');
				console.log('ALL TAGS FETCHED FROM SERVER: ', data);
				return data;
			}
		},
		async addToAll(tag: TagType) {
			const { error } = await supabase.from('tags').insert({ name: tag.name, color: tag.color });
			console.log(error);
			console.log('ADDED TAG TO ALL TAGS: ', tag);
		},
		async clearAllTags() {
			const { error } = await supabase.from('tags').delete().eq("user_id", user.id);
			console.log(error);
		}
	}
};
