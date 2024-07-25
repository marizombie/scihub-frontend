<template>
  <div class="container-create" @click="initAutosave()">
    <v-text-field
      single-line
      label="Title"
      v-model="articleData.title"
      variant="solo"
      hide-details
      class="pb-4 title-input"
    />
    <div
      id="editorjs"
      :class="['pa-4', theme.global.current.value.dark ? 'dark-theme' : '']"
    ></div>
    <div class="mt-2 buttons-container">
      <v-btn variant="text" @click="openGuidelines()"> Guidelines </v-btn>
      <v-btn class="ml-auto" variant="text" @click="onDraftSave()">
        Save as Draft
      </v-btn>
      <v-btn color="primary" class="ml-3" @click="showMetaPreview()">
        Publish
      </v-btn>
    </div>
  </div>
  <v-dialog
    v-model="showMetaDialog"
    :fullscreen="true"
    transition="dialog-bottom-transition"
    class="comments-dialog"
    scrollable
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="showMetaDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="meta-content">
        <div class="meta-block">
          <h3>Article preview</h3>
          <v-img
            class="my-2"
            :alt="firstImage.alt"
            :width="300"
            rounded
            :heigh="225"
            :src="firstImage.url"
            aspect-ratio="4/3"
          >
          </v-img>
          <v-text-field
            label="Title"
            v-model.sync="title.value.value"
            variant="underlined"
            class="pb-4"
            counter="100"
            :persistent-counter="true"
            :error-messages="title.errorMessage.value"
          />
          <v-text-field
            label="Description"
            v-model="description.value.value"
            variant="underlined"
            class="pb-4"
            counter="200"
            :persistent-counter="true"
            :error-messages="description.errorMessage.value"
          />
        </div>
        <div :class="['meta-block', display.mdAndUp ? 'ml-4' : '']">
          <span>
            Add or change tags so readers will know what your story is about
          </span>
          <v-combobox
            :clear-on-select="true"
            v-model="chosedTags.value.value"
            class="mt-3 mb-3"
            label="Choose tag(s)"
            :items="tagsArray"
            multiple
            hide-no-data
            @update:search="onSearchChange"
            item-title="name"
            item-value="slug"
            chips
            closable-chips
            variant="outlined"
            :delimiters="[',']"
            :error-messages="chosedTags.errorMessage.value"
            hide-details
          >
          </v-combobox>
          <v-checkbox
            v-model="articleData.containsAI"
            label="Contains AI generated content"
            density="compact"
            hide-details
          ></v-checkbox>
          <div class="d-flex align-center">
            <v-checkbox
              v-model="articleData.containsAffiliate"
              label="Contains affiliate content"
              density="compact"
              hide-details
            ></v-checkbox>
            <v-tooltip
              text="Affiliate links, promotions, your youtube or instagram channel"
            >
              <template v-slot:activator="{ props }">
                <v-btn icon v-bind="props" size="x-small" variant="plain">
                  <v-icon class="plain-custom-style">
                    mdi-information-outline
                  </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>

          <div class="publish-action-buttons mt-3">
            <v-btn variant="text" @click="onDraftSave()"> Save as Draft </v-btn>
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
import { useDisplay, useTheme } from 'vuetify';

import AceCodeEditorJS, { type AceCodeConfig } from 'ace-code-editorjs';
import ace from 'ace-builds';
import 'ace-builds/esm-resolver';

import modeHTMLWorker from 'ace-builds/src-noconflict/worker-html?url';
import modeJSWorker from 'ace-builds/src-noconflict/worker-javascript?url';
import modeCSSWorker from 'ace-builds/src-noconflict/worker-css?url';
import modePHPWorker from 'ace-builds/src-noconflict/worker-php?url';
import modeXMLWorker from 'ace-builds/src-noconflict/worker-xml?url';
import modeYamlWorker from 'ace-builds/src-noconflict/worker-yaml?url';
import modeJsonWorker from 'ace-builds/src-noconflict/worker-json?url';
import { useNotificationStore, useUserStore } from '~/store';
import type { Article, TagItem } from '~/types';
import * as yup from 'yup';

let editor: any;

onMounted(async () => {
  const EditorJS = (await import('@editorjs/editorjs')).default;
  const Header = (await import('@editorjs/header')).default;
  const List = (await import('@editorjs/list')).default;
  const Quote = (await import('@editorjs/quote')).default;
  const ImageTool = (await import('@editorjs/image')).default;
  const Table = (await import('@editorjs/table')).default;
  const LinkTool = (await import('@editorjs/link')).default;
  const Embed = (await import('@editorjs/embed')).default;
  const Undo = (await import('editorjs-undo')).default;
  editor = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: Header,
      list: List,
      quote: Quote,
      image: {
        class: ImageTool,
        config: {
          additionalRequestData: {
            draft_slug: articleData.value.draftSlug
          },
          // endpoints: {
          //   byFile: `${config.public.baseURL}api/upload/postimage/` // Your backend file uploader endpoint
          //   // byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
          // },
          uploader: {
            async uploadByFile(file: File) {
              if (file.size > 3000000) {
                const notifyStore = useNotificationStore();
                await notifyStore.setNotification({
                  type: 'error',
                  message:
                    'Please consider uploading image with size less than 3MB'
                });
                editor.blocks.delete();
                return {
                  success: 0,
                  file: null
                };
              }
              const formData = new FormData();
              formData.append('image', file);
              formData.append('draft_slug', articleData.value.draftSlug);
              const { data, error } = await useAPIFetch<GetPostOrDraftResponse>(
                `${config.public.baseURL}api/upload/postimage/`,
                {
                  method: 'POST',
                  body: formData
                }
              );
              if (error.value?.data) {
                const notifyStore = useNotificationStore();
                await notifyStore.setNotification({
                  type: 'error',
                  message: error.value.data.detail
                });
              }
              if (data.value) {
                return data.value;
              }
            }
          }
        }
      },
      // checklist: {
      //   class: Checklist,
      //   inlineToolbar: true,
      // },
      embed: Embed,
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: `${config.public.baseURL}api/fetch-url/`
        }
      },
      // warning: Warning,
      table: Table,
      code: {
        class: AceCodeEditorJS,
        config: aceConfig
      }
    },
    onReady: () => {
      new Undo({ editor });
    }
  });

  editor.isReady
    .then(async () => {
      const holder = document.getElementById('editorjs');
      if (holder) {
        holder.addEventListener('click', eventHandlerAceCode, true);
      }
      if (route.query.postSlug) {
        const { data: postData } = await useAPIFetch<GetPostOrDraftResponse>(
          `api/posts/${route.query.postSlug}/edit/`,
          {
            method: 'get'
          }
        );
        if (postData.value) {
          editor.render(postData.value.success.content);
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
        const { data: postData } = await useAPIFetch<GetPostOrDraftResponse>(
          `api/drafts/${route.query.draftSlug}/edit/`,
          {
            method: 'get'
          }
        );
        if (postData.value) {
          editor.render(postData.value.success.content);
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
    .catch((reason: any) => {
      console.log(`Editor.js initialization failed because of ${reason}`);
    });
});

interface DraftResponse {
  success: string;
  slug: string;
}

interface PublishResponse {
  post: {
    slug: string;
    title: string;
  };
}

interface GetPostOrDraftResponse {
  success: {
    content: any;
    description: string;
    title: string;
    slug?: string;
  };
}

definePageMeta({
  middleware: ['auth']
});

ace.config.setModuleUrl('ace/mode/html_worker', modeHTMLWorker);
ace.config.setModuleUrl('ace/mode/javascript_worker', modeJSWorker);
ace.config.setModuleUrl('ace/mode/css_worker', modeCSSWorker);
ace.config.setModuleUrl('ace/mode/php_worker', modePHPWorker);
ace.config.setModuleUrl('ace/mode/xml_worker', modeXMLWorker);
ace.config.setModuleUrl('ace/mode/yaml_worker', modeYamlWorker);
ace.config.setModuleUrl('ace/mode/json_worker', modeJsonWorker);

const aceConfig: AceCodeConfig = {
  languages: {
    plain: {
      label: 'Plain Text',
      mode: 'ace/mode/plain_text'
    },
    html: {
      label: 'HTML',
      mode: 'ace/mode/html'
    },
    javascript: {
      label: 'JavaScript',
      mode: 'ace/mode/javascript'
    },
    css: {
      label: 'CSS',
      mode: 'ace/mode/css'
    },
    php: {
      label: 'PHP',
      mode: 'ace/mode/php'
    },
    jsx: {
      label: 'JSX',
      mode: 'ace/mode/jsx'
    },
    tsx: {
      label: 'TSX',
      mode: 'ace/mode/tsx'
    },
    typescript: {
      label: 'TypeScript',
      mode: 'ace/mode/typescript'
    },
    sql: {
      label: 'SQL',
      mode: 'ace/mode/sql'
    },
    cpp: {
      label: 'C++',
      mode: 'ace/mode/c_cpp'
    },
    csharp: {
      label: 'C#',
      mode: 'ace/mode/csharp'
    },
    dart: {
      label: 'Dart',
      mode: 'ace/mode/dart'
    },
    dockerfile: {
      label: 'Docker',
      mode: 'ace/mode/dockerfile'
    },
    fsharp: {
      label: 'F#',
      mode: 'ace/mode/fsharp'
    },
    golang: {
      label: 'Golang',
      mode: 'ace/mode/golang'
    },
    graphql: {
      label: 'GraphQL',
      mode: 'ace/mode/graphqlschema'
    },
    haskell: {
      label: 'Haskell',
      mode: 'ace/mode/haskell'
    },
    java: {
      label: 'Java',
      mode: 'ace/mode/java'
    },
    json: {
      label: 'Json',
      mode: 'ace/mode/json'
    },
    kotlin: {
      label: 'Kotlin',
      mode: 'ace/mode/kotlin'
    },
    makefile: {
      label: 'Makefile',
      mode: 'ace/mode/makefile'
    },
    mysql: {
      label: 'MySQL',
      mode: 'ace/mode/mysql'
    },
    nginx: {
      label: 'NginX',
      mode: 'ace/mode/nginx'
    },
    objectivec: {
      label: 'Objective C',
      mode: 'ace/mode/objectivec'
    },
    pascal: {
      label: 'Pascal',
      mode: 'ace/mode/pascal'
    },
    perl: {
      label: 'Perl',
      mode: 'ace/mode/perl'
    },
    pgsql: {
      label: 'Postgres',
      mode: 'ace/mode/pgsql'
    },
    laravel: {
      label: 'PHP (Laravel)',
      mode: 'ace/mode/php_laravel_blade'
    },
    prisma: {
      label: 'Prisma',
      mode: 'ace/mode/prisma'
    },
    python: {
      label: 'Python',
      mode: 'ace/mode/python'
    },
    r: {
      label: 'R',
      mode: 'ace/mode/r'
    },
    ruby: {
      label: 'Ruby',
      mode: 'ace/mode/ruby'
    },
    rust: {
      label: 'Rust',
      mode: 'ace/mode/rust'
    },
    swift: {
      label: 'Swift',
      mode: 'ace/mode/swift'
    },
    terraform: {
      label: 'Terraform',
      mode: 'ace/mode/terraform'
    },
    xml: {
      label: 'XML',
      mode: 'ace/mode/xml'
    },
    yaml: {
      label: 'YAML',
      mode: 'ace/mode/yaml'
    }
  },
  options: {
    fontSize: 16,
    minLines: 4,
    theme: 'ace/theme/monokai',
    enableAutoIndent: true,
    useSoftTabs: true,
    customScrollbar: true
  }
};

const route = useRoute();
const articleData = ref({
  title: '',
  description: '',
  tags: [],
  draftSlug: '',
  containsAI: false,
  containsAffiliate: false
});
const display = ref(useDisplay() || null);

const config = useRuntimeConfig();

function eventHandlerAceCode(val: any) {
  let target = val.target as HTMLElement;
  if (
    target &&
    (target.innerText === 'Ace Code' ||
      target.closest('.ce-popover-item')?.dataset.itemName === 'code')
  ) {
    val.stopPropagation();
    editor.save().then((data: any) => {
      if (data.blocks.filter((el: any) => el.type === 'code').length >= 1) {
        let codeBlocks = data.blocks.filter((el: any) => el.type === 'code');
        let lastblock = codeBlocks[codeBlocks.length - 1];
        editor.blocks.insert('code', {
          code: '',
          language: lastblock.data.language
        });
      } else {
        editor.blocks.insert('code', {
          code: '',
          language: 'plain'
        });
      }
      const toolbars = document.getElementsByClassName('ce-toolbar');
      toolbars[0].classList.remove('ce-toolbar--opened');
    });
  }
}

onUnmounted(() => {
  const holder = document.getElementById('editorjs');
  if (holder) {
    holder.removeEventListener('click', eventHandlerAceCode, true);
  }
});

const showMetaDialog = ref(false);
const tagsArray: Ref<Article[]> = ref([]);
const firstImage = ref({
  url: '',
  alt: ''
});

function showMetaPreview() {
  editor.save().then(async (outputData: any) => {
    const imageData = outputData.blocks.find(
      (item: any) => item.type === 'image' && item.data.file?.url
    );
    if (!imageData) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: 'error',
        message: 'Please upload an image to make your post visually appealing'
      });
    } else {
      firstImage.value.url = imageData.data.file.url;
      firstImage.value.alt = imageData.data.caption;
      title.value.value = articleData.value.title;
      showMetaDialog.value = true;
    }
  });
}

async function onSearchChange(val: string) {
  const { data: tagPosts } = await useAPIFetch<Article[]>(
    `/api/tags/?search=${val}&limit=20`
  );
  if (tagPosts.value) {
    tagsArray.value = tagPosts.value;
  }
}

const theme = useTheme();
const timer = ref();

async function initAutosave() {
  if (!timer.value) {
    await saveAsDraft();
    timer.value = setInterval(() => {
      saveAsDraft();
    }, 60000);
  }
}

const router = useRouter();

watch(
  () => router.currentRoute.value,
  () => {
    if (!route.query.postSlug && !route.query.draftSlug) {
      editor.isReady
        .then(async () => {
          await saveAsDraft(false);
        })
        .then(async () => {
          await editor.clear();
          await clearInterval(timer.value);
          articleData.value = {
            title: '',
            description: '',
            tags: [],
            containsAI: false,
            containsAffiliate: false,
            draftSlug: ''
          };
          timer.value = null;
        });
    }
  }
);

onUnmounted(() => {
  clearInterval(timer.value);
  timer.value = null;
});

interface PublishInfo {
  title: string;
  description: string;
  chosedTags: (TagItem | string)[];
}

let publishData: Ref<PublishInfo> = ref({
  title: '',
  description: '',
  chosedTags: []
});

const validationSchema = markRaw(
  yup
    .object({
      title: yup.string().required().min(3).max(100).label('Title'),
      description: yup.string().required().min(3).max(200).label('Description'),
      chosedTags: yup
        .array()
        .of(
          yup.lazy((val) =>
            typeof val === 'string'
              ? yup.string()
              : yup.object({
                  id: yup.number(),
                  followers_count: yup.number(),
                  name: yup.string(),
                  slug: yup.string()
                })
          )
        )
        .required()
        .min(1, 'Please, choose at least one tag or create new one.')
        .label('Tag(s)')
    })
    .required()
);

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
  initialValues: publishData.value
});

const title = useField('title', validationSchema);
const description = useField('description', validationSchema);
const chosedTags = useField('chosedTags', validationSchema);

const save = handleSubmit(async (values: any) => {
  editor
    .save()
    .then(async (outputData: any) => {
      const bodyData = {
        is_draft: 'false',
        title: values.title,
        description: values.description,
        content: outputData,
        contains_ai_generated: articleData.value.containsAI,
        contains_affiliate: articleData.value.containsAffiliate,
        tags: values.chosedTags.map((item: TagItem | string) => {
          if (typeof item === 'string') {
            return item;
          }
          return item.name;
        })
      };
      const { data: postData } = await useAPIFetch<PublishResponse>(
        `api/drafts/${articleData.value.draftSlug}/publish/`,
        {
          method: 'post',
          body: articleData.value.draftSlug
            ? Object.assign(bodyData, { draft: articleData.value.draftSlug })
            : bodyData
        }
      );
      if (postData.value) {
        navigateTo(`/posts/${postData.value.post.slug}/`);
      }
    })
    .catch((error: any) => {
      console.log('Saving failed: ', error);
    });
});

async function saveAsDraft(setDraftSlug: boolean = true) {
  await editor
    .save()
    .then(async (outputData: any) => {
      let bodyData = {
        title: articleData.value.title,
        description: description.value.value,
        content: outputData,
        contains_ai_generated: articleData.value.containsAI,
        contains_affiliate: articleData.value.containsAffiliate,
        tags: (chosedTags.value.value as (TagItem | string)[]).map(
          (item: TagItem | string) => {
            if (typeof item === 'string') {
              return item;
            }
            return item.name;
          }
        )
      };
      if (articleData.value.draftSlug) {
        bodyData = Object.assign(bodyData, {
          slug: articleData.value.draftSlug
        });
      }
      const { data: draftData } = await useAPIFetch<DraftResponse>(
        `api/autosave/`,
        {
          method: 'post',
          body: articleData.value.draftSlug
            ? Object.assign(bodyData, { slug: articleData.value.draftSlug })
            : bodyData
        }
      );
      if (draftData.value && setDraftSlug) {
        articleData.value.draftSlug = draftData.value.slug;
        editor.configuration.tools.image.config.additionalRequestData.draft_slug =
          articleData.value.draftSlug;
        await navigateTo({ query: { draftSlug: articleData.value.draftSlug } });
      }
    })
    .catch((error: any) => {
      console.log('Saving failed: ', error);
    });
}

async function onDraftSave() {
  await saveAsDraft();
  await navigateTo(`/?tab=drafts`);
}

function openGuidelines() {
  window.open('/guidelines/', '_blank');
}
</script>

<style lang="less" scoped>
@import '../../assets/breakpoints.less';
#editorjs {
  width: 100%;
  max-width: 1200px;
  box-shadow:
    0px 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 3px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));

  :deep(.ace_gutter) {
    z-index: 0;
  }
  min-height: 60vh;

  font-size: 20px;

  :deep(.ce-block__content) {
    width: calc(100% - 150px);
    max-width: unset;
  }

  :deep(.ce-toolbar__content) {
    width: 100%;
    max-width: calc(100% - 150px);
  }
}

.container-create {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}

.buttons-container {
  display: flex;
}

.meta-content {
  display: flex;
  flex-direction: column;
  @media (min-width: @md-min) {
    flex-direction: row;
    width: 100%;
    max-width: 1200px;
    justify-content: center;
    align-self: center;
    height: 100vh;
    align-items: center;
  }
}

.publish-action-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.meta-block {
  width: 100%;
  padding: 16px;
  @media (min-width: @md-min) {
    max-width: 400px;
  }
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

.plain-custom-style {
  opacity: 1;
  text-transform: unset;
}

.guideLink {
  font-size: 18px;
  text-decoration: none;
  color: unset;
}
</style>
