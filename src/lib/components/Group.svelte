<script lang="ts">
	import type { NoteType, TagType, GroupProps } from '../../types';
	import Note from './Note.svelte';

	let { notes, tag, handleActiveTagRemoval }: GroupProps = $props();

	let notes_with_tag: NoteType[] = $derived(notes.filter((n) => n.activeTags.some((t) => t.name === tag.name)));


	function capitalize(title: string) {
		return title.charAt(0).toUpperCase() + title.slice(1);
	}

	function activeTagRemovalCallback(note: NoteType, activeTag: TagType) {
        handleActiveTagRemoval(note, activeTag)
    }
</script>

{#if notes_with_tag.length > 0}
	<section class="max-h-80 min-h-20 w-full overflow-y-auto p-4">
		<h1 class="text-lm w-2/3 border-b-4 border-slate-900 border-opacity-75 text-2xl">
			{capitalize(tag.name)}
		</h1>

		{#each notes_with_tag as note}
			<Note
				{note}
				activeTagRemovalCallback={activeTagRemovalCallback}
			/>
		{/each}
	</section>
{/if}
