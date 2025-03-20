<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});

const route = useRoute();

const redirectedFrom =
  route.redirectedFrom?.fullPath ||
  route.query.redirectedFrom?.toString() ||
  "/";

// cookie存返回頁路徑
const redirectedFromCookie = useCookie("redirectedFrom", { maxAge: 3600 });
redirectedFromCookie.value = redirectedFrom;

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
    <h3>Page: login</h3>

    <hr />

    <fieldset class="login">
      <legend>Login:</legend>
      <a href="/auth/apple">Apple</a>
      <a href="/auth/facebook">Facebook</a>
      <a href="/auth/google">Google</a>
    </fieldset>

    <fieldset class="form">
      <legend>Form:</legend>
      <div>
        <span>Email</span>
        <input v-model="email" type="text" name="email" />
      </div>
      <div>
        <span>Password</span>
        <input v-model="password" type="password" name="password" />
      </div>
      <button type="button" @click="onClick">Login</button>
    </fieldset>
  </div>
</template>

<style lang="css" scoped>
.login {
  width: 200px;
  a {
    display: block;
  }
}

.form {
  width: fit-content;
  span {
    display: inline-block;
    width: 100px;
  }
}
</style>
