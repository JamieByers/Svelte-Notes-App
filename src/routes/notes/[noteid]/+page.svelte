<script lang="ts">
    import type { NoteType } from './../../../types.ts';
    import { Input } from "$lib/components/ui/input"
    import { Button } from "$lib/components/ui/button"
    import { Textarea } from "$lib/components/ui/textarea"
    import { v4 as uuid } from 'uuid';
    import { onMount } from "svelte"
    import { page } from "$app/stores"


    let id = $page.params.noteid

    let title: string = $state("")
    let text: string = $state("")
    let date = ''
    let note = $derived({title: "", text:"", id:"", date:"", activeTags: []})
    let notes: NoteType[] = $state([])

    onMount(() => {
        notes = JSON.parse(localStorage.getItem("notes")!) || [];
        let current_note = notes.find(n => n.id === id)!
        title = current_note.title
        text = current_note.text
        date = current_note.date
    });

    $effect(() => {
        if (title || text) {
            let note_to_edit_index = notes.findIndex(n => n.id === id);
            if (note_to_edit_index >= 0) {
                notes[note_to_edit_index] = note
            } else {
                notes = [...notes, note]
            }
            localStorage.setItem("notes", JSON.stringify(notes));
            console.log('notes', notes)
            console.log("             ")
        }
    });

</script>

<Input placeholder="Add Note Title" bind:value={title}></Input>
<br>
<Textarea placeholder="Add description" bind:value={text} class="h-screen"></Textarea>
<br>

<div class="left-0 bottom-0 absolute m-2 flex gap-2">
    <a href="/" class=""><Button>Go Back</Button></a>
</div>


