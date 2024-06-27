<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input"
    import { onMount } from "svelte"
    import Note from "$lib/components/Note.svelte"
    import type { NoteType } from "src/types";
    import { setNotes, getNotes, removeNote } from "../../NotesUtils.svelte";


    let search = $state("")
    let displayNotes: NoteType[] = $state([])

    function handleClear() {
        setNotes([])
        notes = []
        displayNotes = []
    }

    let notes: NoteType[] = $state([])
    onMount(() => {
        notes = getNotes()
        displayNotes = [...notes]
    })

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
        displayNotes = removeNote(note)
    }

</script>


<main class="m-2 flex flex-col gap-4">
    
    <div class="flex gap-2">
        <a href="/new">
            <Button>Add Note</Button>
        </a>
        <Button onclick={handleClear}>Clear Notes</Button>
        <Button onclick={() => console.log(notes)}>Log</Button>
        <Input placeholder="Search..." class="w-full" bind:value={search} on:input={updateDisplayNotes}/>
    </div>
    
    {#each displayNotes as note}
        <Note title={note.title} text={note.text} date={note.date} id={note.id} activeTags={note.activeTags} handleDeleteNote={() => handleDeleteNote(note)} />
    {/each}
    
</main>

