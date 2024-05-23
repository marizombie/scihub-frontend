<template>
  <v-dialog v-model="dialog" max-width="500" class="dialog-window">
    <v-card title="Cookie Settings">
      <v-card-text>
        <p class="pb-4">
          Great Things Development use cookies to deliver and improve the
          visitor experience. Learn more about the cookies we use on our Cookie
          Policy page.
        </p>

        <v-list-subheader class="font-weight-black text-high-emphasis"
          >Required Cookies</v-list-subheader
        >

        <v-switch
          :value="true"
          :label="'On'"
          color="primary"
          density="compact"
          hide-details
          inline
          inset
          disabled
        ></v-switch>

        <p class="mb-4">
          These cookies are required for the site to function and cannot be
          turned off.
        </p>

        <v-list-subheader class="font-weight-black text-high-emphasis"
          >Performance Cookies</v-list-subheader
        >

        <v-switch
          v-model="performance"
          :label="performance ? 'On' : 'Off'"
          color="primary"
          density="compact"
          hide-details
          inline
          inset
        ></v-switch>

        <p class="mb-4">
          Counts website visits and clicks to understand where people most
          engage with links to make the experience better.
        </p>

        <v-list-subheader class="font-weight-black text-high-emphasis"
          >Advertising Cookies</v-list-subheader
        >

        <v-switch
          v-model="advertising"
          :label="advertising ? 'On' : 'Off'"
          color="primary"
          density="compact"
          hide-details
          inline
          inset
        ></v-switch>

        <p class="mb-16">
          Set by our advertising partners, these cookies are used to build a
          profile of your interests and show you relevant ads on other sites.
          They do not store personal information, but are based on uniquely
          identifying your browser and internet device.
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="justify-center px-6 py-3">
        <v-btn
          class="flex-grow-1 text-none"
          color="primary"
          rounded="0"
          variant="plain"
          @click="onDeclineAll()"
        >
          Decline All
        </v-btn>

        <v-btn
          class="text-white flex-grow-1 text-none"
          color="primary"
          rounded="0"
          variant="flat"
          @click="onAccept()"
        >
          Save and Accept
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card subtitle="Updated on May 13th, 2024" class="cookies">
    <v-card-title> Cookie Policy </v-card-title>
    <v-card-text>
      <h3>Introduction</h3>
      <h4 class="mt-2">Welcome to Great Things Development!</h4>
      <p>
        We use cookies to ensure that we give you the best experience on our
        website, improve performance, enhance functionality, and for advertising
        purposes. This policy provides detailed information about how we use
        cookies and how you can manage them.
      </p>
      <h3 class="my-2">What Are Cookies?</h3>
      <p>
        Cookies are small text files that are stored on your device (computer,
        tablet, or mobile) when you visit a website. They are used to remember
        your preferences, provide essential site functionalities, and collect
        analytical data to improve the user experience.
      </p>
      <h3 class="my-2">Types of Cookies We Use</h3>
      <ol>
        <li>
          Essential Cookies: These are necessary for our website to function
          properly. They enable you to move around the site and use its
          features, such as accessing secure areas.
        </li>
        <li>
          Functionality Cookies: These cookies allow our website to remember
          choices you make (such as your user name, language, or the region you
          are in) and provide enhanced, more personal features.
        </li>
        <li>
          Performance Cookies: These cookies help us understand how visitors
          interact with our website by collecting and reporting information
          anonymously. This helps us to improve the way our website works.
        </li>
        <li>
          Targeting/Advertising Cookies: These cookies are used to deliver
          adverts more relevant to you and your interests. They are also used to
          limit the number of times you see an advertisement as well as help
          measure the effectiveness of the advertising campaign.
        </li>
        <li>
          Social Media Cookies: These cookies are set by a range of social media
          services that we have added to the site which enables you to share our
          content with your friends and networks.
        </li>
        <li>
          Third-Party Cookies: We partner with third parties who may also set
          cookies on your device during your visit to our website. These cookies
          are mainly used for advertising services provided by third parties.
        </li>
      </ol>
      <h3 class="my-2">Managing and Deleting Cookies</h3>
      <p>
        If you wish to restrict or block the cookies which are set by our
        website, you can do this through
        <a href="#" @click.prevent="dialog = true">Cookie Settings</a> or your
        browser settings. The 'Help' function within your browser should tell
        you how. Alternatively, you can visit www.aboutcookies.org or
        www.allaboutcookies.org, which offer comprehensive information on how to
        do this on a wide variety of browsers. Please be aware that restricting
        cookies may impact the functionality of our website.
      </p>
      <h3 class="my-2">Consent for Cookies</h3>
      <p>
        When you first visit our website, you will be greeted with a cookie
        banner at the bottom of the page. This banner provides you with the
        choice to accept all cookies, customize your cookie settings to restrict
        some types of cookies, or decline non-essential cookies. You can also
        access this cookie policy to learn more about the cookies we use. Later
        you can change your consent in
        <a href="#" @click.prevent="dialog = true">Cookie Settings</a> or manage
        in your browser.
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useCookiesStore } from '~/store';

const dialog = ref(false);
const cookiesStore = useCookiesStore();
const advertising = ref(!!cookiesStore.currentAccepts?.advertisements);
const performance = ref(!!cookiesStore.currentAccepts?.performance);

function onDeclineAll() {
  cookiesStore.setCurrentAccepts({
    advertisements: false,
    performance: false
  });
  dialog.value = false;
}

function onAccept() {
  cookiesStore.setCurrentAccepts({
    advertisements: advertising.value,
    performance: performance.value
  });
  dialog.value = false;
}
</script>

<style lang="less" scoped>
.cookies {
  max-width: 768px;
  p {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  ol {
    padding-left: 16px;
  }
}
</style>
