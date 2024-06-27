<script lang="ts">
	import ActiveTag from './ActiveTag.svelte';
    import type { TagType, InputProps } from 'src/types';
	import db from "../../db.svelte"

	let {
		title = '',
		text = '',
		date = '',
		id = '',
		activeTags = [] as TagType[],
		handleDeleteNote
	}: InputProps = $props();

    let note = {
		title: title,
		text: text,
		date: date,
		id: id,
		activeTags: activeTags,
		handleDeleteNote
	}

	function handleTagPermaRemove(tag: TagType) {
		db.notes.removeActiveTag(note, tag)
		activeTags = activeTags.filter(t => t.name !== tag.name)
	}
</script>

<!-- <a href="/notes/{id}" class="w-2/4"> -->

<section class="text-slate-1500 min-h-20 w-full rounded-xl border-4 border-slate-900 p-2">
	<div class="min-h-20 w-full rounded bg-slate-500 bg-opacity-50 p-2">
		<div class="mb-2.5 flex w-full items-center justify-between border-b-4 border-slate-700">
			<h2 class=""><b>{title}</b></h2>
			<button
				class=" p-auto m-1 flex h-8 w-8 items-center justify-center text-2xl"
				onclick={handleDeleteNote}><b>x</b></button
			>
		</div>

		<ul class="flex flex-col gap-1.5">
			<li>{text.slice(0, 50)}...</li>
			<div class="flex flex-row justify-between">
				<li>Created At: {date}</li>
				<li>ID: {id}</li>
			</div>

			Tags: 
			{#each activeTags as tag}
				<ActiveTag
					name={tag.name}
					color={tag.color}
					handleClick={() => handleTagPermaRemove(tag)}
				/>
			{/each}
		</ul>
	</div>
</section>

<!-- </a> -->
