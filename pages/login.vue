<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});

const route = useRoute();

const redirectedFrom =
  route.redirectedFrom?.fullPath ||
  route.query.redirectedFrom?.toString() ||
  "/";

const { fetch } = useUserSession();

const email = ref("miles@email.com");
const password = ref("password123");

const onClick = async () => {
  await $fetch("/api/login", {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
    },
  })
    .then(async () => {
      await fetch();

      await navigateTo(redirectedFrom);
    })
    .catch((err) => {
      console.log(err);

      console.log(err.data?.message || err.message);
    });
};
</script>

<template>
  <div>
    Page: login

    <br />

    <a href="/auth/google">Google</a>

    <AppleSignInButton :use-popup="false" :redirected-from="redirectedFrom"
      >Apple SingIn
    </AppleSignInButton>

    <AppleSignInButton :use-popup="true" :redirected-from="redirectedFrom"
      >Apple SingIn with Popup
    </AppleSignInButton>

    <br />

    <div>
      Email:<input v-model="email" type="text" name="email" /><br />
      Password:<input v-model="password" type="password" name="password" />
      <button type="button" @click="onClick">Login</button>
    </div>
  </div>
</template>
