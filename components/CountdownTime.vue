<script setup lang="ts">
const time = ref(60)

let timer: NodeJS.Timeout

watch(time, (n) => {
  if (n === 0) {
    clearInterval(timer)
  }
})

const startCountdownTime = () => {
  time.value = 60
  timer = setInterval(() => {
    time.value--
  }, 1000)
}
</script>

<template>
  <div>
    <span>{{ time }}</span>
    <button @click="startCountdownTime">Reset</button>
  </div>
</template>
