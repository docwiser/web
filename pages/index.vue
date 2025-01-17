<script setup>
const projects = ref([{
title: 'Scopes: a realtime AI-powered assistant',
description: 'Scopes AI is the real-time assistant build to helps in navigation, get direction, find opsticals, etc',
link: 'https://scopes.susantswain.com'
},
{
title: 'Soundscape: a music-streaming application with world-class accessibility support',
description: 'Soundscape is a real-time music streaming app developed with accessible composition interface',
link: 'https://raw.githubusercontent.com/docwiser/bundles/main/app-arm64-v8a.apk'
},
{
title: 'Vido',
img: 'https://www.techassistantforblind.com/photos/verified.jpg',
description: 'video is the ai-powered video recognition model to describe and annalize videos with perfect layout detection in a single session',
link: 'https://vido.susantswain.com'
}]);
</script>
<template>
<Head>
<Title>Susant Swain: Software ingineer | Student | entrepreneur</Title>
</Head>
<UCard>
<template #header>
<h1 class="h-14">Welcome to my site</h1>
</template>
<p>Specializing in crafting inclusive digital experiences for the visually impaired community, I combine innovative technologies with empathetic design to create user-friendly websites and applications. Explore my projects, insights, and commitment to making the web accessible to all.</p>
<template #footer>
<nuxt-link to="/projects">view Projects</nuxt-link>
<nuxt-link to="/contributions">Explore Contributions to open-source community</nuxt-link>
<nuxt-link to="/volunteers">Support the cause</nuxt-link>
</template>
</UCard>
<UCarousel v-slot="{item}" :items="projects" arrows>
<UCard>
<template #header>
<img v-if="item.img" :src="item.img" alt="Carousel-alt" />
<h2 class="h-7">{{item.title}}</h2>
</template>
<UContainer><p>{{item.description}}</p></UContainer>
<template #footer>
<nuxt-link :to="item.link" v-if="item.link">Explore</nuxt-link>
</template>
</UCard>
</UCarousel>

</template>