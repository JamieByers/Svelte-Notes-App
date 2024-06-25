<script lang="ts">
    import ActiveTag from "./ActiveTag.svelte";

    interface Tag {
        name: string;
        color: string;
    }

    interface InputProps {
        title: string
        text: string
        date: string
        id: string
        activeTags: Tag[]
        handleDeleteNote: () => void
    }

    let {title="", text="", date="", id="", activeTags=[] as Tag[], handleDeleteNote}: InputProps = $props()

    function handleTagPermaRemove(tag: Tag) {
        let notes = JSON.parse(localStorage.getItem("notes")!);
        let noteIndex = notes.findIndex((n: any) => n.id === id);

        notes[noteIndex].activeTags = notes[noteIndex].activeTags.filter((t: Tag) => t.name !== tag.name);

        localStorage.setItem("notes", JSON.stringify(notes));
        
        activeTags = notes[noteIndex].activeTags 
    }


</script>

<!-- <a href="/notes/{id}" class="w-2/4"> -->

    <section class="w-full min-h-20 rounded-xl border-4 border-slate-900 p-2 text-slate-1500">

        <div class="bg-slate-500 w-full min-h-20 rounded bg-opacity-50 p-2">
            <div class="flex w-full items-center justify-between mb-2.5 border-b-4 border-slate-700">
                <h2 class=""><b>{title}</b></h2>
                <button class=" m-1 w-8 h-8 text-2xl flex justify-center items-center p-auto" onclick={handleDeleteNote}><b>x</b></button>
            </div>

            <ul class="flex flex-col gap-1.5">
                <li>{text.slice(0,50)}...</li>
                <div class="flex flex-row justify-between">
                    <li>Created At: {date}</li>
                    <li>ID: {id}</li>
                </div>

                Tags:
                {#each activeTags as tag}
                    <ActiveTag name={tag.name} color={tag.color} handleClick={()=> handleTagPermaRemove(tag)}/>
                {/each}
                
            </ul>
        </div>

    </section>

<!-- </a> -->