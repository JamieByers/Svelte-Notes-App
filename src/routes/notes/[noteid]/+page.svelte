<script lang="ts">
	import type { NoteType, TagType } from '../../../types.ts';
	import ActiveTag from '../../../lib/components/ActiveTag.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { v4 as uuid } from 'uuid';
	import { onMount } from 'svelte';
	import Tag from '$lib/components/Tag.svelte';

	import db from '../../../db.svelte';

	let debug = false;


	// ADD NEW NOTE SYSTEM
	let activeTags: TagType[] = $state([]);
	let title: string = $state('');
	let text: string = $state('');
	const id: string = uuid();
	let d = new Date();
	let date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
	let note = $derived({ title, text, date, id, activeTags });
	let notes: NoteType[] = $state([]);

	onMount(async () => {
		notes = await db.notes.all();
        note = notes.find(n => n.id === id)!
	});

	$effect(() => {
		if (title || text) {
			let note_to_edit_index = notes.findIndex((n) => n.id === id);
			if (note_to_edit_index >= 0) {
				notes[note_to_edit_index] = note;
				db.notes.save(note);
			} else {
				notes = [...notes, note];
				db.notes.add(note);
			}
		}
	});

	// TAGGING SYSTEM

	let tagInput = $state('');
	let allTags: TagType[] = $state([]);
	let tagsFocused = $state(false);

	onMount(async () => {
		allTags = await db.tags.all();
	});

	let colors = [
		'bg-red-500 text-red-200',
		'bg-orange-500 text-orange-200',
		'bg-amber-500 text-amber-200',
		'bg-yellow-500 text-yellow-200',
		'bg-lime-500 text-lime-200',
		'bg-green-500 text-green-200',
		'bg-emerald-500 text-emerald-200',
		'bg-teal-500 text-teal-50',
		'bg-cyan-500 text-cyan-200',
		'bg-sky-500 text-sky-200',
		'bg-blue-500 text-blue-200',
		'bg-indigo-500 text-indigo-200',
		'bg-violet-500 text-violet-200',
		'bg-purple-500 text-purple-200',
		'bg-fuchsia-500 text-fuchsia-200',
		'bg-pink-500 text-pink-200',
		'bg-rose-500 text-rose-200'
	];

	function tagAlreadyActive(selectedTag = tagInput) {
		for (let tag of activeTags) {
			if (tag.name === selectedTag) {
				return true;
			}
		}
		return false;
	}
	 
	function createTag(tagName: string = tagInput) {
		let newTag = { name: '', color: '' };
		newTag.name = tagName;
		let randomIndex = Math.floor(Math.random() * colors.length);
		newTag.color = colors[randomIndex];

		activeTags.push(newTag);
		db.notes.addActiveTag(note, newTag);
		db.tags.addToAll(newTag);
		allTags = [...allTags, newTag]
	}

	async function addActiveTag(tag: TagType) {
		await db.notes.addActiveTag(note, tag);
	}
	 
	function handleTagSubmit() {
		if (tagInput && !tagAlreadyActive()) {
			let tagFound = false;
			allTags.forEach((tag) => {
				if (tag.name === tagInput) {
					activeTags.push(tag);
					tagFound = true;
					addActiveTag(tag)
				}
			});

			if (!tagFound) {
				createTag(tagInput);
			}

			tagInput = '';
		}
	}
	
	async function handleTagClick(tag: TagType) {
		if (!tagAlreadyActive(tag.name)) {
			activeTags.push(tag);
			await db.notes.addActiveTag(note, tag);
		}
	}

	async function handleRemoveTag(tag: TagType) {
		activeTags = activeTags.filter((t) => t.name !== tag.name);
		await db.notes.removeActiveTag(note, tag);
	}

	async function handleTagClear() {
		await db.tags.clearAllTags()
		await db.notes.clearActiveTags(note)
		allTags = [];
		activeTags = [];
	}

	function handleRandomTag() {
		createTag(uuid().slice(0, 6));
	}

</script>

<main class="flex flex-col gap-2">

	<div class="flex items-center justify-between gap-2">
		<Input placeholder="Add Note Title... " bind:value={title} class="w-1/2 border-0 focus:border-0 focus:outline-none"></Input>

		<div class="flex flex-row gap-2">
			<form class="min-w-1/4 relative" onsubmit={handleTagSubmit}>
				<Input
					class="w-30 border-0 focus:border-0 focus:outline-none"
					placeholder="Add a Tag..."
					onfocus={() => tagsFocused = true}
					onblur={() => tagsFocused = false}
					bind:value={tagInput}
				></Input>
				<input type="submit" hidden />
				{#if tagsFocused && allTags}
					<div
						class="absolute mt-1 flex max-h-60 min-h-20 w-full flex-col gap-1.5 overflow-auto rounded-md border border-input bg-background p-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#each allTags as alltag}
							<Tag name={alltag.name} color={alltag.color} handleClick={() => handleTagClick(alltag)} />
						{/each}
					</div>
				{/if}
			</form>
		
			<Button
				class="border-4 border-slate-800 bg-transparent text-black hover:text-white"
				onclick={handleTagClear}>Clear Tags</Button
			>
		</div>
		
		{#if debug}
			<Button
			class="border-4 border-slate-800 bg-transparent text-black hover:text-white"
			onclick={handleRandomTag}>Random Tag</Button
			> 
			<Button
			class="border-4 border-slate-800 bg-transparent text-black hover:text-white"
			onclick={() => (activeTags = allTags)}>Apply All</Button
			>
		{/if}
	</div>

	<Textarea placeholder="Add description" bind:value={text} class="h-screen border-0 focus:border-0 focus:outline-none m-0"></Textarea>

</main>



<div class="flex flex-row items-center fixed bottom-0 left-0 m-2 gap-2">
	<div class="">
		<a href="/notes" class=""><Button>Go Back</Button></a>
	</div>

	<div class="flex max-h-24 w-full flex-row flex-wrap gap-2 overflow-auto p-1 my-2">
		{#each activeTags as tag}
			<Tag name={tag.name} color={tag.color} handleClick={() => handleRemoveTag(tag)} />
		{/each}
	</div>

	
</div>