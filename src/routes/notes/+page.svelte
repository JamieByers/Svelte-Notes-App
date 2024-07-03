<script lang="ts">
	import Group from './../../lib/components/Group.svelte';
	import UntaggedGroup from '$lib/components/UntaggedGroup.svelte';
	import { supabase } from './../../supabaseClient';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import Note from '$lib/components/Note.svelte';
	import type { NoteType, TagType } from 'src/types';
	import db from '../../db.svelte';

	let search = $state('');
	let displayNotes: NoteType[] = $state([]);
	let notes: NoteType[] = $state([]);
	let notes_with_no_tags: NoteType[] = $derived(notes.filter((n) => n.activeTags.length === 0));
	let allTags: TagType[] = $state([]);

	onMount(async () => {
		notes = (await db.notes.all()) || [];
		allTags = (await db.tags.all()) || [];
		if (notes) {
			displayNotes = [...notes];
		}
	});

	function updateDisplayNotes() {
		const searchTerm = search.trim().toLowerCase();

		if (searchTerm === '') {
			displayNotes = [...notes];
		} else {
			displayNotes = notes.filter((note) => {
				return (
					note.activeTags.some((tag) => tag.name.toLowerCase().includes(searchTerm)) ||
					Object.values(note).some((value) => {
						if (typeof value === 'string') {
							return value.toLowerCase().includes(searchTerm);
						}
					})
				);
			});
		}
	}

	function handleDeleteNote(note: NoteType) {
		db.notes.remove(note);
		displayNotes = displayNotes.filter((n) => n.id !== note.id);
	}

	function handleClear() {
		notes = [];
		displayNotes = [];
		db.notes.clear();
	}

	function handleSignOut() {
		db.signOut();
	}

	function handleActiveTagRemoval(note: NoteType, activeTag: TagType) {
		db.notes.removeActiveTag(note, activeTag);
		note.activeTags = note.activeTags.filter((t) => t.name !== activeTag.name);
	}
</script>

<main class="m-2 flex flex-col gap-4">
	{#if !db.user}
		{goto('/')}
	{/if}

	<div class="flex gap-2">
		<Button onclick={handleSignOut}>Sign Out</Button>
		<a href="/new">
			<Button>Add Note</Button>
		</a>
		<Button onclick={handleClear}>Clear Notes</Button>
		<Input
			placeholder="Search..."
			class="w-full"
			bind:value={search}
			on:input={updateDisplayNotes}
		/>
	</div>

	<div class="grid w-screen grid-cols-2 gap-4 overflow-y-auto">
		{#each allTags as tag}
			<Group {notes} {tag} {handleActiveTagRemoval} />
		{/each}
	</div>

	<UntaggedGroup {notes_with_no_tags} {handleActiveTagRemoval} />
</main>
