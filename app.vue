<script setup>
import {ref} from 'vue';
const links = ref([{
label: 'Projects',
icon: 'i-heroicons-home',
to: '/projects'
},
{
label: 'Developments',
icon: 'i-heroicons-chart-bar',
to: '/developments'
},
{
label: 'Contributions',
icon: 'i-heroicons-command-line',
to: '/contributions'
},
{
label: 'Volunteers',
icon: 'i-heroicons-light-bulb',
to: '/volunteers'
},
{
label: 'Blog',
to: '/blog'
},
{
label: 'About',
to: '/about'
},
{
label: 'get in touch',
icon: 'i-heroicons-question-mark-circle',
to: '/contact'
}]);
</script>
<template>
<UContainer>
<header>
<nuxt-link to="/">Susant Swain</nuxt-link>
<UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
<Darkbtn />
</header>
<main id="content">
<RouterView />
</main>
<footer>
<p>&copy; Copyright 2021-{{new Date().getFullYear()}} Susant Swain; All rights reserved</p>
</footer>
<NuxtRouteAnnouncer />
</UContainer>
</template>
