import { supabase } from './supabaseClient';
import { goto } from '$app/navigation';
import type { NoteType, TagType } from './types';

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
		localStorage.setItem('supabaseToken', user.access_token);
		goto('http://localhost:5173/notes');
	},
	async signUp(email: string, password: string) {
		goto('http://localhost:5173/notes');
		return await supabase.auth.signUp({ email, password });
	},
	async signOut() {
		localStorage.removeItem('supabaseToken');
		return await supabase.auth.signOut();
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
		},
		async note(note: NoteType) {
			const { data, error } = await supabase.from('notes').select('id', note.id);
			return {
				data
			};
		},
		async getActiveTags(note: NoteType) {
			return await supabase.from('notes').select('activeTags').eq('id', note.id);
		},
		async addActiveTag(note: NoteType, tag: TagType) {
			const { data, error } = await supabase.from('notes').select('activeTags').eq('id', note.id).single();
			if (error) {
				console.log(error);
				return;
			}
			let activeTags = data.activeTags;
			let activeTagsWithNewTag = [...activeTags, tag];

			await supabase.from('notes').update({ activeTags: activeTagsWithNewTag }).eq('id', note.id);
			console.log('ADDED ', tag, 'TO', note);
		},
		async removeActiveTag(note: NoteType, tag: TagType) {
			try {
				const { data, error } = await supabase
					.from('notes')
					.select('activeTags')
					.eq('id', note.id)
					.single();
				
				if (error) {
					console.error('Error fetching activeTags:', error);
					return;
				}


				if (data && data.activeTags) {
					const activeTags = data.activeTags;
					
					const activeTagsWithoutTag = activeTags.filter(t => t.name !== tag.name);
					console.log("activeTagsWithoutTag:", activeTagsWithoutTag);

					await supabase
						.from('notes')
						.update({ activeTags: activeTagsWithoutTag })
						.eq('id', note.id);
			

					console.log('Removed', tag, 'from', note);
				} else {
					console.error('No activeTags found for the note.');
				}
			} catch (err) {
				console.error('Unexpected error:', err);
			}
		},

		async clearActiveTags(note: NoteType) {
			const { error } = await supabase.from('notes').update({ activeTags: [] }).eq('id', note.id);
		},
		async clear() {
			await supabase.from('notes').delete().eq('user_id', user.id);
		}
	},
	tags: {
		async all() {
			if (!user) return [];
			const { data, error } = await supabase.from('tags').select('*');
			if (error) {
				console.error('Error fetching tags:', error);
				return [];
			}
			return data;
		},
		async addToAll(tag: TagType) {
			const { error } = await supabase.from('tags').insert({ name: tag.name, color: tag.color });
			if (error) {
				console.error('Error adding tag:', error);
			}
		},
		async clearAllTags() {
			const { error } = await supabase.from('tags').delete().eq('user_id', user.id);
		}
	}
};
