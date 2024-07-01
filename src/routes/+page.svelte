<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
    import db from "../db.svelte";

	let email = $state("");
	let password = $state("");

	let emailError = $state(false)
	let passwordError = $state(false)

	let emailErrorMessage = $state("")
	let passwordErrorMessage = $state("")

	
	function noErros(email: string, password: string) {
		let noErros = true
		if (!email || email.length <= 6 && email.length > 0 || !validateEmail(email)) {
			emailError = true
			noErros = false
		} 
		if (!password || password.length <= 6) {
			passwordError = true
			noErros = false
		}

		return noErros
	}
	
	function validateEmail(email: string) {
		const valid_emails = ["@icloud.com", "@gmail.com", "@yahoo.com", "@outlook.com", "@protonmail.com"];
		return valid_emails.some(valid_address => email.includes(valid_address));
	}

	function handleErrors() {

		if (!noErros(email, password)) {
			if (!email && !password) {
				emailErrorMessage = "Please enter your email"
				passwordErrorMessage = "Please enter your password"
			} 
			if (!email) {
				emailErrorMessage = "Please enter your email" 
			} 
			if (!password) {
				passwordErrorMessage = "Please enter your password"
			} 
	
			if (password.length <= 6 && password.length > 0) {
				passwordErrorMessage = "Password must be greater than 6 characters"
			}
			if (!validateEmail(email)) {
				emailErrorMessage = "Please enter a valid email"
			}
			return false
		}

		return true
	}


    function handleSignIn() {
		if (handleErrors()) {
			return db.signIn(email, password)
		} else {
			return
		}

    }

    function handleSignUp() {
		if (handleErrors()) {
			return db.signUp(email, password)
		} else {
			return
		}
    }

</script>



<main class="w-screen h-screen flex flex-row ">

	<section class="bg-slate-800 w-5/12 h-full flex items-center justify-center">
		<h1 class="text-white text-3xl">Welcome to Svelte Notes</h1>
	</section>

	<section class="h-full flex items-center justify-center w-7/12 ">

		<form action="" class="flex flex-col gap-2 w-1/2" onsubmit={handleSignIn}>
			<Input bind:value={email} placeholder="Email... " class="w-full"></Input>
			{#if emailError}
				<p class="text-red-500 text-sm text-1">{emailErrorMessage}</p>
			{/if}
			<Input bind:value={password} placeholder="Password... "></Input>
			{#if passwordError}
				<p class="text-red-500 text-sm text-1">{passwordErrorMessage}</p>
			{/if}
			<div class="flex flex-row gap-2 ">
				<Button onclick={handleSignUp} class="">Sign up</Button>
				<Button onclick={handleSignIn} class="">Log in</Button>
			</div>
		</form>

	</section>

</main>

<style>
</style>