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
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.log('ERROR SIGNING IN', error);
			return;
		}
		localStorage.setItem('supabaseToken', user.access_token);
		goto('/notes');
	},
	async signUp(email: string, password: string) {
		goto('/notes');
		const { error } = await supabase.auth.signUp({ email, password });
		if (error) {
			console.log('ERROR SIGNING UP', error);
			return;
		}
	},
	async signOut() {
		localStorage.removeItem('supabaseToken');
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.log('ERROR SIGNING OUT', error);
			return;
		}
	},
	notes: {
		async all() {
			if (user) {
				const { data, error } = await supabase.from('notes').select('*') || [];
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
			if (error) {
				console.log('ERROR ADDING NOTE', error);
			}
		},
		async remove(note: NoteType) {
			await supabase.from('notes').delete().eq('id', note.id);
			console.log('REMOVING NOTE FROM DATABASE: ', note);
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
				if (error) {
					console.log('ERROR SAVING NOTE', error);
				}
		},
		async note(note_id: string) {
			const { data, error } = await supabase.from('notes').select().eq('id', note_id);
			if (error) {
				console.log('ERROR FETCHING NOTE', error);
			}
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
			const activeTags = data.activeTags;
			const activeTagsWithNewTag = [...activeTags, tag];

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
					
					const activeTagsWithoutTag = activeTags.filter((t: TagType) => t.name !== tag.name);
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
			if (error) {
				console.log('ERROR CLEARING ACTIVE TAGS', error);
			}
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
			if (error) {
				console.log('ERROR CLEARING ALL TAGS', error);
			}
		}
	}
};
