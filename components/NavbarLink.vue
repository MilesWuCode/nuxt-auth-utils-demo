<template>
  <fieldset>
    <legend>Navbar</legend>

    <div style="display: flex; flex-direction: column">
      <NuxtLink to="/">Index</NuxtLink>
      <NuxtLink to="/login">Login</NuxtLink>
      <NuxtLink to="/public">Public</NuxtLink>
      <NuxtLink to="/only-user-1">Only User 1</NuxtLink>
      <NuxtLink to="/only-user-2">Only User 2</NuxtLink>
      <NuxtLink to="/only-guest">Only Guest</NuxtLink>
      <LogoutButton />
    </div>
  </fieldset>
</template>
