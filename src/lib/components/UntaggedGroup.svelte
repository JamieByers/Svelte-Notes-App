<script lang="ts">
	import { onMount } from "svelte";
	import type { NoteType } from "../../types.ts";
    import db from "../../db.svelte"
    import Note from "../components/Note.svelte"

    let notes: NoteType[] = $state([])
    let notes_with_no_tags: NoteType[] = $state([])

    onMount(async () => {
        notes = await db.notes.all() || []
        notes_with_no_tags = notes.filter((n: NoteType) => n.activeTags.length === 0)
    })

    function handleDeleteNote(note: NoteType) {
        db.notes.remove(note)
        notes_with_no_tags = notes_with_no_tags.filter(n => n.id !== note.id)
    }

    function capitalize(title: string) {
        return title.charAt(0).toUpperCase() + title.slice(1)
    }

</script>

{#if notes_with_no_tags.length > 0 }
    <section class="w-full min-h-20 max-h-80 overflow-y-auto p-4 ">
        
        <h1 class="text-2xl text-lm border-b-4 border-slate-900 border-opacity-75 w-2/3">Notes with no tag</h1>
        
        {#each notes_with_no_tags as note}
            <Note note={note} handleDeleteNote={() => handleDeleteNote(note)} />
        {/each}
        
    </section>
{/if}