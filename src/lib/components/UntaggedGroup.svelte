<script lang="ts">
	import { onMount } from 'svelte';
	import type { NoteType, TagType, UntaggedGroupProps } from '../../types.ts';
	import db from '../../db.svelte';
	import Note from '../components/Note.svelte';

	let { notes_with_no_tags, handleActiveTagRemoval }: UntaggedGroupProps = $props();


    function handleDeleteNote(note: NoteType) {
		db.notes.remove(note);
		notes_with_no_tags = notes_with_no_tags.filter((n: NoteType) => n.id !== note.id);
	}

	function capitalize(title: string) {
		return title.charAt(0).toUpperCase() + title.slice(1);
	}

	function activeTagRemovalCallback(note: NoteType, activeTag: TagType) {
        handleActiveTagRemoval(note, activeTag)
    }
</script>

{#if notes_with_no_tags.length > 0}
	<section class="max-h-80 min-h-20 w-full overflow-y-auto p-4">
		<h1 class="text-lm w-2/3 border-b-4 border-slate-900 border-opacity-75 text-2xl">
			Notes with no tag
		</h1>

		{#each notes_with_no_tags as note}
			<Note {note} handleDeleteNote={() => handleDeleteNote(note)} {activeTagRemovalCallback} />
		{/each}
	</section>
{/if}
