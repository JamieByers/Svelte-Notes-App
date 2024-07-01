<script lang="ts">
	import { onMount } from "svelte";
	import type { NoteType, TagType } from "../../types.ts";
    import Note from "./Note.svelte";
    import db from "../../db.svelte"

    let { tag }: {tag: TagType} = $props()

    let notes: NoteType[] = $state([])
    let displayNotes: NoteType[] = $state([])

    onMount(async () => {
        notes = await db.notes.all() || []
        displayNotes = notes
        notes = notes.filter(n => n.activeTags.some(t => t.name === tag.name))
    })

    function handleDeleteNote(note: NoteType) {
        db.notes.remove(note)
        displayNotes = displayNotes.filter(n => n.id !== note.id)
    }


</script>


{#if notes.length > 0 }
    <section class="w-full min-h-20 max-h-80 overflow-y-auto p-4 ">
        
        <h1 class="text-2xl text-lm border-b-4 border-slate-900 border-opacity-75 w-2/3">{tag.name}</h1>
        
        {#each notes as note}
        <Note note={note} handleDeleteNote={() => handleDeleteNote(note)} />
            {/each}
        
    </section>
{/if}