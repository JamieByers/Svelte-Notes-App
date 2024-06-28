<script>
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
    import db from "../db.svelte";

	let email = '';
	let password = '';

    function handleSignIn() {
        db.signIn(email, password)
    }

    function handleSignUp() {
        db.signUp(email, password)
    }

</script>


<main>
	<div class="flex h-screen w-screen items-center justify-center">

		<form action="" class="flex flex-col gap-2">
			<Input bind:value={email} placeholder="Email... "></Input>
			<Input bind:value={password} placeholder="Password... "></Input>
			<Button onclick={handleSignUp}>Sign up</Button>
			<Button onclick={handleSignIn}>Log in</Button>
		</form>
	</div>
</main>
