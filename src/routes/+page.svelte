<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input"
    import { onMount } from "svelte"
    import Note from "$lib/components/Note.svelte"

    type NoteType = {
        title: string;
        text: string;
        date: string;
        id: string;
        activeTags: { name: string; color: string; }[];
    };

    let search = $state("")
    let displayNotes: NoteType[] = $state([])


    function handleClear() {
        localStorage.setItem("notes", JSON.stringify(""))
        // localStorage.clear()
        notes = []
        displayNotes = []
    }

    let notes: NoteType[] = $state([])
    onMount(() => {
        notes = JSON.parse(localStorage.getItem("notes")!) || []
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
        let current_notes = JSON.parse(localStorage.getItem("notes")!) || []
        let new_notes = current_notes.filter((n: NoteType) => n.id !== note.id)
        localStorage.setItem("notes", JSON.stringify(new_notes))
        displayNotes = new_notes
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

