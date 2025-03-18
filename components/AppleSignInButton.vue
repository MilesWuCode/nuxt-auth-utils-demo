<script setup lang="ts">
// https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple

const { onLoaded } = useScript(
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
);

declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          state: string;
          nonce: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
  }
}

const { usePopup = false, redirectedFrom = "/" } = defineProps<{
  usePopup?: boolean;
  redirectedFrom?: string;
}>();

const runtimeConfig = useRuntimeConfig();
const state = randomString(10);
const nonce = randomString(10);
const show = ref(false);
const { fetch } = useUserSession();
const stateCookie = useCookie("state", { maxAge: 3600 });
const nonceCookie = useCookie("nonce", { maxAge: 3600 });
const redirectedFromCookie = useCookie("redirectedFrom", { maxAge: 3600 });

onLoaded(() => {
  // 載入後初始化
  // 若同時有redirect 或 popup 需要放在按鈕事件裡
  // window.AppleID.auth.init({
  //   clientId: runtimeConfig.appleClientId,
  //   scope: "name email",
  //   redirectURI: runtimeConfig.appleClientSecret,
  //   state: state,
  //   nonce: nonce,
  //   usePopup: usePopup,
  // });

  show.value = true;
});

function randomString(len: number = 128) {
  return [...Array(len)].map(() => Math.random().toString(36)[2]).join("");
}

const onClick = async () => {
  // 寫入cookie
  stateCookie.value = state;
  nonceCookie.value = nonce;
  redirectedFromCookie.value = redirectedFrom;

  try {
    // 載入後初始化
    // 若同時有redirect 或 popup 需要放在按鈕事件裡
    window.AppleID.auth.init({
      clientId: runtimeConfig.public.appleClientId,
      scope: "name email",
      redirectURI: runtimeConfig.public.appleRedirectUrl,
      state: state,
      nonce: nonce,
      usePopup: usePopup,
    });

    const data = await window.AppleID.auth.signIn();

    await $fetch("/api/auth/apple", {
      method: "POST",
      body: {
        idToken: data.authorization.id_token,
      },
    })
      .then(async () => {
        await fetch();

        await navigateTo(redirectedFrom);
      })
      .catch((err) => {
        console.log(err.data?.message || err.message);
      });
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <button v-if="show" @click="onClick"><slot /></button>
</template>
