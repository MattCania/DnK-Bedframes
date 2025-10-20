<script lang="ts">
	import { onMount } from 'svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import LandingHeader from '../components/LandingHeader.svelte';
	import ProductCards from '../components/ProductCards.svelte';
	import Footer from '../components/Footer.svelte';
	import { Heading, P, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	let activeSection = 'home';

	onMount(() => {
		const sections = document.querySelectorAll('section');
		const options = { threshold: 0.6 };

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					activeSection = entry.target.id;
				}
			});
		}, options);

		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	});

	function handleScroll(e: Event, id: string) {
		e.preventDefault();
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<LandingHeader fixed={true}/>

<section id="home" class="px-8 pt-32 md:px-0">
	<div class="my-32 flex h-1/2 w-auto flex-col text-center">
		<Heading tag="h1" class="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
			Perfect for Families, Ideal for Small Spaces.
		</Heading>
		<P class="mx-auto mb-6 text-lg sm:px-16 lg:text-xl xl:px-48 dark:text-gray-400">
			Smart design, sturdy frame, and modern style — the bunk bed that saves space without
			sacrificing comfort.
		</P>
		<Button
			class="mx-auto w-fit bg-zinc-800 hover:bg-zinc-500"
			href="/home/products"
		>
			Shop Now
			<ArrowRightOutline class="ms-2 h-6 w-6" />
		</Button>
	</div>
</section>

<section id="about" class="bg-zinc-100 px-8 py-32 text-center md:px-32">
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
</section>

<section id="products" class="bg-white py-32 text-center">
	<Heading class="mb-8 text-4xl">Featured Products</Heading>
	<div class="mx-auto flex w-auto flex-col justify-center gap-8 md:flex-row">
		<ProductCards
			image="/bedframe.png"
			title="Apartment Sized Bedframe"
			price="2,000"
			description="A bedframe specifically manufactured sized for small rooms and apartments"
		/>
		<ProductCards
			image="/bedframe.png"
			title="Apartment Sized Bedframe"
			price="2,000"
			description="A bedframe specifically manufactured sized for small rooms and apartments"
		/>
		<ProductCards
			image="/bedframe.png"
			title="Apartment Sized Bedframe"
			price="2,000"
			description="A bedframe specifically manufactured sized for small rooms and apartments"
		/>
	</div>
</section>

<section id="contacts" class="bg-zinc-100 px-8 py-32 text-center md:px-0">
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

<Footer />
