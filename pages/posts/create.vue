<template>
  <div class="container-create" @click.once="initAutosave()">
    <v-text-field single-line label="Title" v-model="articleData.title" variant="solo" hide-details
      class="pb-4 title-input" />
    <div id="editorjs" :class="['pa-4', theme.global.current.value.dark ? 'dark-theme' : '']"></div>
    <div class="mt-2 ml-auto buttons-container">
      <v-btn variant="text" @click="saveAsDraft(); redirectToDrafts();">
        Save as Draft
      </v-btn>
      <v-btn color="primary" class="ml-3" @click="showMetaPreview()">
        Publish
      </v-btn>
    </div>
  </div>
  <v-dialog v-model="showMetaDialog" :fullscreen="true" transition="'dialog-bottom-transition'" class="comments-dialog"
    scrollable>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="showMetaDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="meta-content">
        <div class="meta-block">
          <h3>Article preview</h3>
          <v-text-field label="Fill preview title" v-model.sync="title.value.value" variant="underlined"
            class="pb-4" :error-messages="title.errorMessage.value"/>
          <v-text-field label="Fill preview description" v-model="description.value.value" variant="underlined"
            class="pb-4" :error-messages="description.errorMessage.value"/>
          <span>Note: Changes here will affect how your story appears in public places like homepage, during sharing and
            in
            subscribers’ inboxes</span>
        </div>
        <div class="meta-block ml-4">
          <span>
            Add or change tags so readers will know what your story is about
          </span>
          <v-autocomplete :clear-on-select="true" v-model="articleData.tags" class="mt-3" label="Choose tag(s)"
            :items="tagsArray" multiple hide-no-data @update:search="onSearchChange" item-title="name" item-value="slug"
            chips closable-chips variant="outlined">

          </v-autocomplete>
          <div>
            <v-btn variant="text" @click="saveAsDraft(); redirectToDrafts();">
              Save as Draft
            </v-btn>
            <v-btn color="primary" class="ml-3" @click="save()">
              Publish
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import RawTool from '@editorjs/raw';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist'
import Embed from '@editorjs/embed';
import LinkTool from '@editorjs/link';
import Undo from 'editorjs-undo';
import Warning from '@editorjs/warning';
import Table from '@editorjs/table';
import { useTheme } from "vuetify";

import AceCodeEditorJS, { type AceCodeConfig } from "ace-code-editorjs";
import ace from "ace-builds";
import "ace-builds/esm-resolver";

import modeHTMLWorker from "ace-builds/src-noconflict/worker-html?url";
import modeJSWorker from "ace-builds/src-noconflict/worker-javascript?url";
import modeCSSWorker from "ace-builds/src-noconflict/worker-css?url";
import modePHPWorker from "ace-builds/src-noconflict/worker-php?url";
import modeXMLWorker from "ace-builds/src-noconflict/worker-xml?url";
import modeYamlWorker from "ace-builds/src-noconflict/worker-yaml?url";
import modeJsonWorker from "ace-builds/src-noconflict/worker-json?url";
import { useUserStore } from '~/store';
import type { Article } from '~/types';
import * as yup from "yup";

interface DraftResponse {
  success: string;
  slug: string;
}

interface PublishResponse {
  post: {
    slug: string;
    title: string;
  }
}

interface GetPostOrDraftResponse {
  success: {
    content: OutputData;
    description: string;
    title: string;
    slug?: string;
  }
}

definePageMeta({
  middleware: [
    'auth',
  ]
});

ace.config.setModuleUrl("ace/mode/html_worker", modeHTMLWorker);
ace.config.setModuleUrl("ace/mode/javascript_worker", modeJSWorker);
ace.config.setModuleUrl("ace/mode/css_worker", modeCSSWorker);
ace.config.setModuleUrl("ace/mode/php_worker", modePHPWorker);
ace.config.setModuleUrl("ace/mode/xml_worker", modeXMLWorker);
ace.config.setModuleUrl("ace/mode/yaml_worker", modeYamlWorker);
ace.config.setModuleUrl("ace/mode/json_worker", modeJsonWorker);

const aceConfig: AceCodeConfig = {
  languages: {
    plain: {
      label: "Plain Text",
      mode: "ace/mode/plain_text",
    },
    html: {
      label: "HTML",
      mode: "ace/mode/html",
    },
    javascript: {
      label: "JavaScript",
      mode: "ace/mode/javascript",
    },
    css: {
      label: "CSS",
      mode: "ace/mode/css",
    },
    php: {
      label: "PHP",
      mode: "ace/mode/php",
    },
    jsx: {
      label: "JSX",
      mode: "ace/mode/jsx",
    },
    tsx: {
      label: "TSX",
      mode: "ace/mode/tsx",
    },
    typescript: {
      label: "TypeScript",
      mode: "ace/mode/typescript",
    },
    sql: {
      label: "SQL",
      mode: "ace/mode/sql",
    },
    cpp: {
      label: "C++",
      mode: "ace/mode/c_cpp",
    },
    csharp: {
      label: "C#",
      mode: "ace/mode/csharp",
    },
    dart: {
      label: "Dart",
      mode: "ace/mode/dart",
    },
    dockerfile: {
      label: "Docker",
      mode: "ace/mode/dockerfile",
    },
    fsharp: {
      label: "F#",
      mode: "ace/mode/fsharp",
    },
    golang: {
      label: "Golang",
      mode: "ace/mode/golang",
    },
    graphql: {
      label: "GraphQL",
      mode: "ace/mode/graphqlschema",
    },
    haskell: {
      label: "Haskell",
      mode: "ace/mode/haskell",
    },
    java: {
      label: "Java",
      mode: "ace/mode/java",
    },
    json: {
      label: "Json",
      mode: "ace/mode/json",
    },
    kotlin: {
      label: "Kotlin",
      mode: "ace/mode/kotlin",
    },
    makefile: {
      label: "Makefile",
      mode: "ace/mode/makefile",
    },
    mysql: {
      label: "MySQL",
      mode: "ace/mode/mysql",
    },
    nginx: {
      label: "NginX",
      mode: "ace/mode/nginx",
    },
    objectivec: {
      label: "Objective C",
      mode: "ace/mode/objectivec",
    },
    pascal: {
      label: "Pascal",
      mode: "ace/mode/pascal",
    },
    perl: {
      label: "Perl",
      mode: "ace/mode/perl",
    },
    pgsql: {
      label: "Postgres",
      mode: "ace/mode/pgsql",
    },
    laravel: {
      label: "PHP (Laravel)",
      mode: "ace/mode/php_laravel_blade",
    },
    prisma: {
      label: "Prisma",
      mode: "ace/mode/prisma",
    },
    python: {
      label: "Python",
      mode: "ace/mode/python",
    },
    r: {
      label: "R",
      mode: "ace/mode/r",
    },
    ruby: {
      label: "Ruby",
      mode: "ace/mode/ruby",
    },
    rust: {
      label: "Rust",
      mode: "ace/mode/rust",
    },
    swift: {
      label: "Swift",
      mode: "ace/mode/swift",
    },
    terraform: {
      label: "Terraform",
      mode: "ace/mode/terraform",
    },
    xml: {
      label: "XML",
      mode: "ace/mode/xml",
    },
    yaml: {
      label: "YAML",
      mode: "ace/mode/yaml",
    },
  },
  options: {
    fontSize: 16,
    minLines: 4,
    theme: "ace/theme/monokai",
    enableAutoIndent: true,
    useSoftTabs: true,
    customScrollbar: true
  },
};

const route = useRoute();
const articleData = ref({
  title: "",
  description: "",
  tags: [],
  draftSlug: "",
})

const config = useRuntimeConfig();
const userStore = useUserStore();
const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    header: Header,
    list: List,
    raw: RawTool,
    quote: Quote,
    image: {
      class: ImageTool,
      config: {
        additionalRequestHeaders: {
          'authorization': `Bearer ${userStore.userData?.access}`,
        },
        additionalRequestData: {
          'draft_slug': articleData.value.draftSlug
        },
        endpoints: {
          byFile: `${config.public.baseURL}api/upload/postimage/`, // Your backend file uploader endpoint
          // byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
        }
      }
    },
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
    embed: Embed,
    linkTool: {
      class: LinkTool,
      config: {
        headers: {
          'authorization': `Bearer ${userStore.userData?.access}`,
        },
        endpoint: `${config.public.baseURL}api/fetch-url`, 
      }
    },
    warning: Warning,
    table: Table,
    code: {
      class: AceCodeEditorJS,
      config: aceConfig,
    },
  },
  onReady: () => {
    new Undo({ editor });
  },
})

editor.isReady
  .then(async () => {
    if (route.query.postSlug) {
      const { data: postData } = await useAPIFetch<GetPostOrDraftResponse>(`api/posts/${route.query.postSlug}/edit/`, {
        method: "get",
      });
      if (postData.value) {
        editor.render(postData.value.success.content)
        articleData.value.description = postData.value.success.description;
        articleData.value.title = postData.value.success.title;
        title.value.value = articleData.value.title;
        description.value.value = articleData.value.description;
        if (postData.value.success.slug) {
          articleData.value.draftSlug = postData.value.success.slug;
        }
      }
    }
    if (route.query.draftSlug) {
      const { data: postData } = await useAPIFetch<GetPostOrDraftResponse>(`api/drafts/${route.query.draftSlug}/edit/`, {
        method: "get",
      });
      if (postData.value) {
        editor.render(postData.value.success.content)
        articleData.value.description = postData.value.success.description;
        articleData.value.title = postData.value.success.title;
        title.value.value = articleData.value.title;
        description.value.value = articleData.value.description;
        if (postData.value.success.slug) {
          articleData.value.draftSlug = postData.value.success.slug;
        }
      }
    }
  })
  .catch((reason) => {
    console.log(`Editor.js initialization failed because of ${reason}`)
  });

const showMetaDialog = ref(false);
const tagsArray: Ref<Article[]> = ref([]);

function showMetaPreview() {
  title.value.value = articleData.value.title;
  showMetaDialog.value = true;
}

async function onSearchChange(val: string) {
  const { data: tagPosts } = await useAPIFetch<Article[]>(`/api/tags/?search=${val}&limit=20`);
  if (tagPosts.value) {
    tagsArray.value = tagPosts.value;
  }
}

const theme = useTheme();
const timer = ref();

function initAutosave() {
  saveAsDraft();
  timer.value = setInterval(() => {
    saveAsDraft();
  }, 60000);
}

onUnmounted(() => timer.value = null)

interface PublishInfo {
  title: string;
  description: string;
}

let publishData: Ref<PublishInfo> = ref({
  title: "",
  description: "",
});

const validationSchema = markRaw(
  yup
    .object({
      title: yup.string().required().min(3).label("Title"),
      description: yup
        .string()
        .required()
        .min(3)
        .label("Description"),
    })
    .required(),
);

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
  initialValues: publishData.value,
});

const title = useField("title", validationSchema);
const description = useField("description", validationSchema);

const save = handleSubmit(async (values) => {
  editor.save().then(async (outputData) => {
    const bodyData = {
      "is_draft": "false",
      "title": values.title,
      "description": values.description,
      "content": outputData,
      "tags": articleData.value.tags
    }
    const { data: postData } = await useAPIFetch<PublishResponse>(`api/drafts/${articleData.value.draftSlug}/publish/`, {
      method: "post",
      body: articleData.value.draftSlug ? Object.assign(bodyData, { "draft": articleData.value.draftSlug }) : bodyData
    });
    if (postData.value) {
      navigateTo(`/posts/${postData.value.post.slug}`)
    }
  }).catch((error) => {
    console.log('Saving failed: ', error)
  });
})

function saveAsDraft() {
  editor.save().then(async (outputData) => {
    let bodyData = {
      "title": articleData.value.title,
      "description": articleData.value.description,
      "content": outputData,
      "tags": articleData.value.tags
    }
    if (articleData.value.draftSlug) {
      bodyData = Object.assign(bodyData, {slug: articleData.value.draftSlug}) ;
    }
    const { data: draftData } = await useAPIFetch<DraftResponse>(`api/autosave/`, {
      method: "post",
      body: articleData.value.draftSlug ? Object.assign(bodyData, { "slug": articleData.value.draftSlug }) : bodyData
    });
    if (draftData.value) {
      articleData.value.draftSlug = draftData.value.slug;
      editor.configuration.tools.image.config.additionalRequestData.draft_slug = articleData.value.draftSlug;
      const router = useRouter()
      router.replace({ query: {showDraft: articleData.value.draftSlug} })
    }
  }).catch((error) => {
    console.log('Saving failed: ', error)
  });
}

function redirectToDrafts() {
  navigateTo(`/?showDraft=true`);
}

</script>

<style lang="less" scoped>
#editorjs {
  width: 100%;
  max-width: 800px;
  box-shadow: 0px 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 3px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}

.container-create {
  width: 100%;
  max-width: 800px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.buttons-container {
  max-width: 800px;
}

.meta-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-self: center;
  height: 100vh;
  align-items: center;
}

.meta-block {
  max-width: 400px;
  width: 100%;
  padding: 16px;
}

.dark-theme {
  background: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));

  :deep(.ce-toolbar__plus) {
    color: white;
  }

  :deep(.ce-toolbar__plus:hover) {
    background-color: rgb(33, 50, 41);
  }
}

.title-input {
  width: 100%;

  :deep(input) {
    font-size: xx-large;
    font-weight: bold;
  }

  :deep(.v-field-label:not(.v-field-label--floating)) {
    font-size: xx-large;
  }
}
</style>
