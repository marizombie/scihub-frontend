<template>
  <v-card class="pa-12">
    <v-card-title>Profile</v-card-title>
    <v-row :class="!$vuetify.breakpoint.mdAndUp ? 'flex-column' : ''">
      <v-col>
        <v-avatar
          color="grey"
          :width="!$vuetify.breakpoint.mdAndUp ? '100%' : '60%'"
          height="unset"
        >
          <v-img src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"></v-img>
        </v-avatar>
        <v-file-input
          class="file-input"
          label="Change Image"
          clearable
          accept="jpeg, png, bmp"
          v-model="profileImage"
          @change="setFile($event)"
        ></v-file-input>
      </v-col>
      <v-col>
        <v-text-field
          label="Name"
          v-model="profile.first_name"
          outlined
          hide-details
          class="pb-4"
        />
        <v-text-field
          label="Last name"
          v-model="profile.last_name"
          outlined
          hide-details
          class="pb-4"
        />
        <v-text-field
          label="Email"
          v-model="profile.email"
          outlined
          hide-details
        />
      </v-col>
    </v-row>
    
    <div class="mt-6">
      
      <v-textarea
        label="About"
        v-model="profile.about"
        outlined
        counter="250"
      />
      <div class="subtitle">Following</div>
      <v-chip-group>
        <v-chip
          v-for="tag in tags"
          :key="tag"
          close
        >
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </div>
    <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="profileSend"
          >
            Save
          </v-btn>
        </v-card-actions>
  </v-card>
    
</template>

<script>
export default {
  name: 'IndexPage',
  data () {
    return {
      profileImage: null,
      profile: {
        first_name: "",
        last_name: "",
        email: "",
        about: ""
      },
      tags: ["ml", "technologies", "biology", "mathematics"]
    }
  },
  methods: {
    setFile(file) {
      this.profileImage = file;
    },
    profileSend() {

    }
  },
  async beforeMount() {
    const data = await this.$axios.$get("/api/profile/");
    console.log(data)
    this.profile = data.user;
    // this.articles = data.results;
  }
}
</script>

<style lang="less" scoped>
@import '../assets/breakpoints.less';
.file-input {
  @media (min-width: @sm-min) {
    width: 55%;
  }
  // width: 164px;
}
.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>