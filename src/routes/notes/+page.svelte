<script lang="ts">
	import { supabase } from './../../supabaseClient';
	import { goto } from '$app/navigation';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input"
    import { onMount } from "svelte"
    import Note from "$lib/components/Note.svelte"
    import type { NoteType } from "src/types";
    import db from "../../db.svelte"


    let search = $state("")
    let displayNotes: NoteType[] = $state([])
    let notes: NoteType[] = $state([])

	onMount(async () => {
        notes = await db.notes.all() || []
        if (notes) {
            displayNotes = [...notes]
        }
	});


    function updateDisplayNotes() {
        const searchTerm = search.trim().toLowerCase();

        if (searchTerm === "") {
            displayNotes = [...notes];
        } else {
            displayNotes = notes.filter(note => {

                return note.activeTags.some(tag =>
                    tag.name.toLowerCase().includes(searchTerm)
                ) ||
                Object.values(note).some(value => {
                    if (typeof value === "string") {
                        return value.toLowerCase().includes(searchTerm);
                    }
                });
            });
        }
    }

    function handleDeleteNote(note: NoteType) {
        db.notes.remove(note)
        displayNotes = displayNotes.filter(n => n.id !== note.id)
    }

    function handleClear() {
        notes = []
        displayNotes = []
        db.notes.clear()
    }

    function handleSignOut() {
        db.signOut()
    }

</script>


<main class="m-2 flex flex-col gap-4">

    {#if !db.user}
        {goto("/")}
    {/if}

    <div class="flex gap-2">
        <Button onclick={handleSignOut}>Sign Out</Button>
        <a href="/new">
            <Button>Add Note</Button>
        </a>
        <Button onclick={handleClear}>Clear Notes</Button>
        <Input placeholder="Search..." class="w-full" bind:value={search} on:input={updateDisplayNotes}/>
    </div>

        
    {#each displayNotes as note}
        <Note title={note.title} text={note.text} date={note.date} id={note.id} activeTags={note.activeTags} handleDeleteNote={() => handleDeleteNote(note)} />
    {/each}

    
</main>

