<template>
	<img
		:src="basePath + 'polydocs.svg'"
		:class="$style.img"
		alt="polydocs.io"
	/>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	computed: {
		basePath(): string {
			return this.$store.getters.getBaseUrl;
		},
	},
});
</script>

<style lang="scss" module>
.img {
	height: 32px;
}
</style>
