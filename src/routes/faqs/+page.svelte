<script lang="ts">
	import { Card } from "flowbite-svelte";

	const faqs = [
		{
			question: 'Durability?',
			answer:
				'Yes, guaranteed quality. Our metal bedframes are made from premium materials and built to last for years with proper use.'
		},
		{
			question: 'Weight Capacity?',
			answer: 'Supports up to 300kg of evenly distributed weight, ensuring safety and reliability.'
		},
		{
			question: 'Dimension?',
			answer:
				'Varies depending on the unit (single bedframe, double deck, or custom sizes upon request).'
		},
		{
			question: 'Weight Capacity?',
			answer: 'Supports up to 300kg of evenly distributed weight, ensuring safety and reliability.'
		},
		{
			question: 'How long the working days?',
			answer:
				'Usually takes 4 working days, depending on the number of sets and design requirements.'
		},
		{
			question: 'Lead time?',
			answer:
				'For bulk orders, production lead time is 1 week to ensure quality and timely delivery.'
		}
	];
</script>

<section class="h-full py-8 pt-32">
	<div class="relative z-10 mx-auto max-w-6xl px-6">
		<h1 class="mb-16 text-center text-5xl font-bold text-gray-900">FAQs</h1>

		<div class="grid grid-cols-1 gap-0 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each faqs as faq, index}
				<Card class="max-w-[250px] p-6 mx-auto mb-8 md:my-0">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						{faq.question}
					</h5>
					<p class="leading-tight font-normal text-gray-700 dark:text-gray-400">
						{faq.answer}
					</p>
				</Card>
			{/each}
		</div>
	</div>
</section>
