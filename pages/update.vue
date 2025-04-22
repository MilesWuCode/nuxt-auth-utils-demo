<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { user, fetch } = useUserSession();

const name = ref(user.value?.name);

const onClick = async () => {
  await $fetch("/api/update", {
    method: "POST",
    body: {
      name: name.value,
    },
  }).then(async () => {
    await fetch();
  });
};
</script>

<template>
  <div>
    Page: update

    <input type="text" name="name" v-model="name" />

    <button @click="onClick">Save</button>
  </div>
</template>
