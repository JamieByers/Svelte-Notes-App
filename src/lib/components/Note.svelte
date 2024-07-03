<script lang="ts">
	import type { NoteType } from 'src/types';
	import ActiveTag from './ActiveTag.svelte';
    import type { TagType, InputProps } from 'src/types';
	import db from "../../db.svelte"

	let {
		note,
		activeTags,
		handleDeleteNote
	}: InputProps = $props();

	// let activeTags = $state(note.activeTags);

	function handleTagPermaRemove(tag: TagType) {
		db.notes.removeActiveTag(note, tag)
		note.activeTags = note.activeTags.filter(t => t.name !== tag.name)
	}
</script>

<!-- <a href="/notes/{id}" class="w-2/4"> -->

<section class="w-full h-12 pt-1 border-b-4 border-slate-900 border-opacity-10 ">
	<div class="w-full h-10  p-2 flex flex-row justify-between items-center">
		<h1 class="font-sans font-medium text-slate-1500 border-b-2 ">{note.title}</h1>
	
		<div class="flex flex-row items-center ">
			{#each note.activeTags as tag}
				<ActiveTag
					name={tag.name}
					color={tag.color}
					handleClick={() => handleTagPermaRemove(tag)}
				/>
			{/each}
		</div>
	
	</div>

</section>


<!-- </a> -->
