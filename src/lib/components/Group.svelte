<script lang="ts">
	import { onMount } from "svelte";
	import type { NoteType, TagType } from "../../types.ts";
    import Note from "./Note.svelte";
    import db from "../../db.svelte"

    interface GroupProps {
        tag: TagType
    }

    let { tag }: GroupProps = $props()

    let notes: NoteType[] = $state([])
    let displayNotes: NoteType[] = $state([])
    let notes_with_tag: NoteType[] = $state([])

    onMount(async () => {
        notes = await db.notes.all() || []
        displayNotes = notes
        notes_with_tag = notes.filter(n => n.activeTags.some(t => t.name === tag.name))
    })

    $effect(() => {
        notes_with_tag = notes.filter(n => n.activeTags.some(t => t.name === tag.name))
    })

    function handleDeleteNote(note: NoteType) {
        db.notes.remove(note)
        displayNotes = displayNotes.filter(n => n.id !== note.id)
    }

    function capitalize(title: string) {
        return title.charAt(0).toUpperCase() + title.slice(1)
    }

</script>


{#if notes_with_tag.length > 0 }
    <section class="w-full min-h-20 max-h-80 overflow-y-auto p-4 ">
        
        <h1 class="text-2xl text-lm border-b-4 border-slate-900 border-opacity-75 w-2/3">{capitalize(tag.name)}</h1>
        
        {#each notes_with_tag as note}
            <Note note={note} activeTags={note.activeTags} handleDeleteNote={() => handleDeleteNote(note)} />
        {/each}
        
    </section>
{/if}