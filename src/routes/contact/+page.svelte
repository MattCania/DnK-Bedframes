<script>
	import { Heading } from 'flowbite-svelte';
	import Footer from '../../components/Footer.svelte';
</script>

<section id="contacts" class="mx-auto my-20 h-auto w-auto px-8 py-16 text-center md:px-24 lg:w-5/6">
	<Heading class="mb-8 text-4xl">Contact Us</Heading>
	<div class="mx-auto grid max-w-5xl grid-cols-1 gap-20 lg:grid-cols-2">
		<div>
			<h2 class="mb-6 text-lg font-bold tracking-wide text-gray-900 uppercase">Online Inquiry</h2>
			<div class="space-y-4">
				<input
					type="text"
					name="name"
					placeholder="Name"
					class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
				<input
					type="tel"
					name="phone"
					placeholder="Phone Number"
					class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
				<textarea
					name="message"
					placeholder="Message"
					rows={5}
					class="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				></textarea>
				<button
					class="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-colors duration-200 hover:bg-blue-700"
				>
					Submit
				</button>
			</div>
		</div>

		<div class="space-y-8">
			<div>
				<h2 class="mb-6 text-2xl font-bold text-gray-900">Contact Details</h2>
				<div class="space-y-4 text-gray-700">
					<p>dnkfurnitures@gmail.com</p>
					<p>+6391234567890</p>
				</div>
			</div>

			<div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Warehouse</h3>
				<p class="leading-relaxed text-gray-700">Bagong Silang Phase X Matarik Road</p>
			</div>

			<div>
				<h3 class="mb-3 text-xl font-bold text-gray-900">Caloocan City</h3>
				<p class="leading-relaxed text-gray-700">Phase 3 Bagong Silang Caloocan City</p>
			</div>
		</div>
	</div>
</section>
<Footer/>