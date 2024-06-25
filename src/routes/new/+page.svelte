<script lang="ts">
	import ActiveTag from './../../lib/components/ActiveTag.svelte';
    import { Input } from "$lib/components/ui/input"
    import * as Select from "$lib/components/ui/select"
    import { Button } from "$lib/components/ui/button"
    import { Textarea } from "$lib/components/ui/textarea"
    import { v4 as uuid } from 'uuid';
    import { onMount } from "svelte"
    import Tag from "$lib/components/Tag.svelte"

    type NoteType = {
        title: string;
        text: string;
        date: string;
        id: string;
        activeTags: { name: string; color: string; }[];
    };

    type TagType = {
        name: string;
        color: string;
    }

    // ADD NEW NOTE SYSTEM
    let activeTags: TagType[] = $state([])
    let title: string = $state("")
    let text: string = $state("")
    const id: string = uuid().slice(0, 10)
    let d = new Date()
    let date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    let note = $derived({title, text, date, id, activeTags})
    let notes: NoteType[] = $state([])

    onMount(() => {
        notes = JSON.parse(localStorage.getItem("notes")!) || [];
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
        }
    });

    
    // TAGGING SYSTEM
    
    let tagInput = $state("")
    let allTags: TagType[] = $state([])
    let tagsFocused = $state(false)
    
    onMount(() => {
        allTags = JSON.parse(localStorage.getItem("tags")!) || []
    })
    
    $effect(() => {
        allTags = JSON.parse(localStorage.getItem("tags")!) || []
    })

    let colors = [  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500',]
  
    function tagAlreadyActive(selectedTag = tagInput) {
        for (let tag of activeTags) {
            if (tag.name === selectedTag) {
                return true;
            }
        }
        return false;
    }

    function createTag(tagName: string = tagInput) {
        let newTag = {name: "", color: ""}
        newTag.name = tagName
        let randomIndex = Math.floor(Math.random() * colors.length);
        newTag.color = colors[randomIndex]
        
        activeTags.push(newTag)

        allTags = [...allTags, newTag]
        localStorage.setItem("tags", JSON.stringify(allTags))

    }


  function handleTagSubmit() {

    if (tagInput && !tagAlreadyActive()) {
        let tagFound = false
        allTags.forEach(tag => {
            if (tag.name === tagInput) {
                activeTags.push(tag)
                tagFound = true
              }
          })
          
          if (!tagFound) {
            createTag(tagInput)
          }

          tagInput = ""

    }
    }

    function handleTagClick(tag: TagType) {
        if (!tagAlreadyActive(tag.name)) {
            activeTags.push(tag)
            console.log(tagAlreadyActive(tag.name))
        }
    }

    function handleRemoveTag(tag: TagType) {
        activeTags = activeTags.filter(t => t.name !== tag.name)
    }

    function handleTagClear() {
        localStorage.setItem("tags", JSON.stringify(""))
        allTags = []
        activeTags = []
    }

    function handleRandomTag() {
        createTag(uuid().slice(0,6))
    }

    $effect(() => {
        console.log('notes', notes)
    })

</script>

<div class="flex items-center gap-2">
    <Input placeholder="Add Note Title" bind:value={title} class="w-1/2"></Input>

    <form class="relative min-w-1/4" onsubmit={handleTagSubmit}>
        <Input class="w-30" placeholder="Add a Tag" on:focus={() => tagsFocused = true} on:blur={() => tagsFocused = false} bind:value={tagInput}></Input>
        <input type="submit" hidden>
        {#if tagsFocused && allTags}

            <div class="absolute w-full rounded-md min-h-20 max-h-60 overflow-auto flex flex-col border border-input bg-background p-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1 gap-1.5">

                {#each allTags as alltag}
                    <Tag name={alltag.name} color={alltag.color} handleClick={() => handleTagClick(alltag)}/>
                {/each}

            </div>

        {/if}
    </form>

    <Button class="bg-transparent text-black border-4 border-slate-800 hover:text-white" onclick={handleTagClear}>Clear Tags</Button>
    <Button class="bg-transparent text-black border-4 border-slate-800 hover:text-white" onclick={handleRandomTag}>Random Tag</Button>
    <Button class="bg-transparent text-black border-4 border-slate-800 hover:text-white" onclick={() => activeTags = allTags}>Apply All</Button>

    
</div>

<div class="w-full flex flex-row gap-2 p-1 overflow-auto max-h-24 flex-wrap ">
    {#each activeTags as tag}
       <ActiveTag name={tag.name} color={tag.color} handleClick={() => handleRemoveTag(tag)}/>
    {/each}
</div>

<br>
<Textarea placeholder="Add description" bind:value={text} class="h-screen "></Textarea>
<br>

<div class="left-0 bottom-0 absolute m-2 flex gap-2">
    <a href="/" class=""><Button>Go Back</Button></a>
</div>


