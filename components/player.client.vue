<script setup>
import { ref, watch, onMounted, computed} from 'vue';
import {useRoute} from 'vue-router';
import axios from 'axios';
const props = defineProps({
text: { type: String, required: false, default: 'Loading...' },
lang: { type: String, required: false, default: 'en' }
});
const route = useRoute();
const speeds = ref(['0.25', '0.5', '0.75', '1.0', '1.25', '1.5', '1.75', '2.0', '2.25', '2.5', '2.75', '3.0']);
const languages = ref({
'af': 'Afrikaans',
'sq': 'Albanian',
'ar': 'Arabic',
'hy': 'Armenian',
'ca': 'Catalan',
'zh': 'Chinese',
'zh-cn': 'Chinese (Mandarin/China)',
'zh-tw': 'Chinese (Mandarin/Taiwan)',
'zh-yue': 'Chinese (Cantonese)',
'hr': 'Croatian',
'cs': 'Czech',
'da': 'Danish',
'nl': 'Dutch',
'en': 'English',
'en-au': 'English (Australia)',
'en-uk': 'English (United Kingdom)',
'en-us': 'English (United States)',
'en-in': 'English(India)',
'eo': 'Esperanto',
'fi': 'Finnish',
'fr': 'French',
'de': 'German',
'el': 'Greek',
'ht': 'Haitian Creole',
'hi': 'Hindi',
'hu': 'Hungarian',
'is': 'Icelandic',
'id': 'Indonesian',
'it': 'Italian',
'ja': 'Japanese',
'ko': 'Korean',
'la': 'Latin',
'lv': 'Latvian',
'mk': 'Macedonian',
'no': 'Norwegian',
'pl': 'Polish',
'pt': 'Portuguese',
'pt-br': 'Portuguese (Brazil)',
'ro': 'Romanian',
'ru': 'Russian',
'sr': 'Serbian',
'sk': 'Slovak',
'es': 'Spanish',
'es-es': 'Spanish (Spain)',
'es-us': 'Spanish (United States)',
'sw': 'Swahili',
'sv': 'Swedish',
'ta': 'Tamil',
'th': 'Thai',
'tr': 'Turkish',
'vi': 'Vietnamese',
'cy': 'Welsh'
});
const playerConfig = ref({
loading: true,
speed: '1.0',
text: props.text || route.query.text || "Loading...",
lang: props.lang || route.query.lang || "en-in",
volume: 1,
playing: false,
url: null,
error: false,
errorMessage: null
});
const playerOpen = ref(false);
const audioElement = ref(new Audio());
const currentTime = ref(0);
const generateAudio = async () => {
try {
playerConfig.value.loading = true;
const request = await axios.post("https://www.techassistantforblind.com/modules/gtts.php", {
text: playerConfig.value.text,
lang: playerConfig.value.lang
}, {
headers: { "Content-Type": "application/x-www-form-urlencoded" }
});
playerConfig.value.url = request.data;
audioElement.value.src = request.data;
if (playerConfig.value.playing) {
audioElement.value.currentTime = currentTime.value;
audioElement.value.play();
}
playerConfig.value.loading = false;
playerConfig.value.error = false;
} catch (e) {
playerConfig.value.loading = false;
playerConfig.value.error = true;
playerConfig.value.errorMessage = e.message;
}
};
const setTime = (t) => {
currentTime.value = t;
}
onMounted(async () => {
playerConfig.value.text = route.query.text || props.text || "Loading...";
playerConfig.value.lang = route.query.lang || props.lang || "en-in";
await generateAudio();
audioElement.value.addEventListener("timeupdate", () => {
setTime(audioElement.value.currentTime);
});
audioElement.value.addEventListener("ended", () => {
currentTime.value = 0;
playerConfig.value.playing = false;
});
});
watch(() => playerConfig.value.text, async () => await generateAudio());
watch(() => playerConfig.value.lang, async () => await generateAudio());
watch(() => playerConfig.value.volume, (newVolume) => {
audioElement.value.volume = newVolume;
});
watch(() => playerConfig.value.speed, (newSpeed) => {
audioElement.value.playbackRate = newSpeed;
});
watch(() => props.text, (newText) => {
playerConfig.value.text = newText;
});
watch(() => props.lang, (newLang) => {
playerConfig.value.lang = newLang;
});
const playPause = () => {
if (playerConfig.value.playing) {
audioElement.value.pause();
} else {
audioElement.value.play();
}
playerConfig.value.playing = !playerConfig.value.playing;
};
const parseTime = (timeInSeconds) => {
const hours = Math.floor(timeInSeconds / 3600);
const minutes = Math.floor((timeInSeconds % 3600) / 60);
const seconds = Math.floor(timeInSeconds % 60);
let timeString = '';
if (hours > 0) timeString += `${hours} hours `;
if (minutes > 0) timeString += `${minutes} minutes `;
timeString += `${seconds} seconds`;
return timeString.trim();
};
const changeTime = (num = 0) => {
audioElement.value.currentTime = num;
};
const toggleMute = () => {
if (playerConfig.value.volume > 0) {
playerConfig.value.volume = 0;
} else {
playerConfig.value.volume = 1;
}
};
const timeDisplay = computed(() => {
const currentTimeDisplay = Math.floor(currentTime.value);
const duration = Math.floor(audioElement.value.duration);
return `${parseTime(currentTimeDisplay)} of ${parseTime(duration)}`;
});
const setCurrentTime = (event) => {
const seekTime = (event.target.value / 100) * audioElement.value.duration;
changeTime(seekTime);
};
const togglePlayer = () => {
playerOpen.value = !playerOpen.value;
}
const download = () => {
const dt = new Date();
const filename = `smartreader_${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}_${dt.getHours()}-${dt.getMinutes()}-${dt.getSeconds()}.mp3`;
const downloadElement = document.createElement("a");
downloadElement.href = playerConfig.value.url;
downloadElement.download = filename;
document.body.appendChild(downloadElement);
downloadElement.click();
downloadElement.remove();
}
</script>
<template>
<UContainer>
<UCard v-if="playerConfig.loading">
<UCardHeader>
<h2>Loading Player</h2>
</UCardHeader>
<UCardContent>Loading audio player resources...</UCardContent>
</UCard>

<UCard v-else-if="playerConfig.error">
<UCardHeader>
<h2>Error</h2>
</UCardHeader>
<UCardContent>
<p>The text can't be converted to audio at the moment.</p>
<p>{{ playerConfig.errorMessage }}</p>
</UCardContent>
<UCardFooter>
<UButton @click="generateAudio" variant="primary" label="Retry" icon="i-heroicons-refresh" />
</UCardFooter>
</UCard>

<UCard v-else>
<UCardHeader>
<UButton @click="playPause" :aria-label="playerConfig.playing ? 'Pause' : 'Play'" :icon="playerConfig.playing ? 'i-heroicons-pause' : 'i-heroicons-play'" />
<UButton @click="togglePlayer" :label="playerOpen ? 'Collapse Player' : 'Expand Player'" :icon="playerOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'" />
</UCardHeader>

<UCardContent v-if="playerOpen">
<UButton @click="changeTime(currentTime - 10)" variant="secondary" aria-label="Rewind 10seconds" icon="i-heroicons-rewind" />
<UButton @click="changeTime(currentTime + 10)" variant="secondary" aria-label="Fast Forward 10seconds" icon="i-heroicons-fast-forward" />
<UButton @click="toggleMute" :label="playerConfig.volume > 0 ? 'Mute' : 'Unmute'" :icon="playerConfig.volume > 0 ? 'i-heroicons-volume-up' : 'i-heroicons-volume-off'" />

<div class="player-info">
<p>{{ timeDisplay }}</p>
<UInput type="range" v-model="playerConfig.volume" icon="i-heroicons-volume-up" aria-label="Volume Control" />
<USelectMenu v-model="playerConfig.speed" :options="speeds" placeholder="Playback speed" />
</div>
<USelectMenu v-model="playerConfig.lang" :options="Object.keys(languages).map((item) => Object.create({code: item, name: languages[item]}))" value-attribute="code" option-attribute="name" placeholder="Change Voice" />
<UButton @click="download" variant="success" label="Download Audio" icon="i-heroicons-download" />
</UCardContent>
</UCard>
</UContainer>
</template>
