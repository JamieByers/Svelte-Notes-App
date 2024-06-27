<script lang="ts">

	interface InputProps {
		name: string;
		color: string;
		handleClick?: () => void;
	}

	let {name, color, handleClick = () => console.log("NO FUNCTION SET FOR TAG", name)}: InputProps = $props()


</script>

<!-- <Input class="h-8 border-0 border-b-2 border-opacity-50"></Input> -->

<button class="min-w-4 h-8 border-2 border-opacity-100 rounded-3xl focus:outline-none px-2.5 py-auto {color}" onmousedown={handleClick}>{name}</button>