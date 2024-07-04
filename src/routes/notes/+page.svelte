<script lang="ts">
	import Group from './../../lib/components/Group.svelte';
	import UntaggedGroup from '$lib/components/UntaggedGroup.svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import type { NoteType, TagType } from 'src/types';
	import db from '../../db.svelte';
	import * as Dialog from '../../lib/components/ui/dialog';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import Note from "../../lib/components/Note.svelte"

	let modalSearch = $state("")
	let filter = $state('');
	let displayNotes: NoteType[] = $state([]);
	let notes: NoteType[] = $state([]);
	let notes_with_no_tags: NoteType[] = $derived(notes.filter((n) => n.activeTags.length === 0));
	let modalSearchNotes: NoteType[] = $state([])
	let allTags: TagType[] = $state([]);


	onMount(async () => {
		notes = (await db.notes.all()) || [];
		allTags = (await db.tags.all()) || [];
		if (notes) {
			displayNotes = [...notes];
		}
	});

	function updateDisplayNotes() {
		const filterTerm = filter.trim().toLowerCase();

		if (filterTerm === '') {
			displayNotes = [...notes];
		} else {
			displayNotes = notes.filter((note) => {
				return (
					note.activeTags.some((tag) => tag.name.toLowerCase().includes(filterTerm)) ||
					Object.values(note).some((value) => {
						if (typeof value === 'string') {
							return value.toLowerCase().includes(filterTerm);
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

	function handleModalSearch() {
		let modalSearchTerm = modalSearch.toLowerCase()
		if (modalSearchTerm === "") {
			modalSearchNotes = []
		} else {
			modalSearchNotes = notes.filter((note) => {
				return (
					note.activeTags.some((tag) => tag.name.toLowerCase().includes(modalSearchTerm)) ||
					Object.values(note).some((value) => {
						if (typeof value === 'string') {
							return value.toLowerCase().includes(modalSearchTerm);
						}
					})
				);
			});
		}
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

		<Dialog.Root>
			<Dialog.Trigger>
				<Button class="h-10 w-10"><FontAwesomeIcon class="h-4 w-4" icon={faSearch} /></Button>
			</Dialog.Trigger>

			<Dialog.Content>
				<Input
					placeholder="Search..."
					class="w-full"
					bind:value={modalSearch}
					on:input={handleModalSearch}
				/>

				{#each modalSearchNotes as modalSearchNote}
					<Note note={modalSearchNote}/>
				{/each}


			</Dialog.Content>
		</Dialog.Root>

		<div class="relative w-full">
			<Input
				placeholder="Filter..."
				class="w-full"
				bind:value={filter}
				on:input={updateDisplayNotes}
			/>
		</div>
	</div>

	<div class="grid w-screen grid-cols-2 gap-4 overflow-y-auto">
		{#each allTags as tag}
			<Group {notes} {tag} {handleActiveTagRemoval} />
		{/each}
	</div>

	<UntaggedGroup {notes_with_no_tags} {handleActiveTagRemoval} />
</main>
