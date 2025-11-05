<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import Footer from '../../components/Footer.svelte';
</script>

<section id="about" class="mx-auto my-20 h-auto w-auto px-8 py-16 text-center md:px-24 lg:w-5/6">
	<Heading class="mb-8 text-4xl">About Us</Heading>
	<div class="space-y-8 text-gray-800">
		<p class="text-justify leading-relaxed">
			At DnK Furnitures, we believe a good day starts with a good night's sleep. That's why we are
			dedicated to designing and providing durable, stylish, and space-saving bed frames that fit
			perfectly into every lifestyle and home.
		</p>

		<div>
			<h2 class="mb-3 text-xl font-bold text-gray-900">Our Story</h2>
			<p class="text-justify leading-relaxed">
				Our journey began with a simple idea: make quality sleep accessible to everyone, no matter
				the space. We noticed how families, students, and young professionals often struggle with
				limited living areas — so we set out to create smart bed solutions that maximize comfort
				without sacrificing style.
			</p>
			<p class="mt-3 text-justify leading-relaxed">
				From classic single and double bed frames to innovative double deck and loft beds, our
				products are built to last, crafted with safety and practicality in mind.
			</p>
		</div>

		<div>
			<h2 class="mb-3 text-xl font-bold text-gray-900">Our Mission</h2>
			<p class="text-justify leading-relaxed">
				To transform small rooms into comfortable, functional spaces with beds that combine
				strength, style, and smart design. Whether you need extra sleeping space for the kids, a
				bunk bed for siblings, or a loft bed that frees up your floor for study and play, we've got
				you covered.
			</p>
		</div>
	</div>
	<Heading class="mb-8 mt-12 text-4xl">Contact Us</Heading>
	<div class="mx-auto flex max-w-5xl grid-cols-1 flex-col gap-20 lg:grid-cols-2">
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

<Footer />
