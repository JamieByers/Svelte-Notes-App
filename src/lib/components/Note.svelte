<script lang="ts">
	import type { NoteType } from 'src/types';
	import ActiveTag from './ActiveTag.svelte';
	import type { TagType, NoteInputProps } from 'src/types';
	import db from '../../db.svelte';

	let { note, handleDeleteNote, activeTagRemovalCallback }: NoteInputProps = $props();


	function activeTagRemoveCallback(tag: TagType) {
		activeTagRemovalCallback(note, tag);
	}
</script>

<!-- <a href="/notes/{id}" class="w-2/4"> -->

<section class="h-12 w-full border-b-4 border-slate-900 border-opacity-10 pt-1">
	<div class="flex h-10 w-full flex-row items-center justify-between p-2">
		<h1 class="text-slate-1500 border-b-2 font-sans font-medium">{note.title}</h1>

		<div class="flex flex-row items-center">
			{#each note.activeTags as tag}
				<ActiveTag
					name={tag.name}
					color={tag.color}
					handleClick={() => activeTagRemoveCallback(tag)}
				/>
			{/each}
		</div>
	</div>
</section>

<!-- </a> -->
