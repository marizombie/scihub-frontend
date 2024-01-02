<template>
  <div id="editorjs"></div>
  <!-- <v-btn @click="save()">
    Save
  </v-btn> -->
</template>

<script setup lang="ts">
import EditorJS from '@editorjs/editorjs';
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
import Table from '@editorjs/table'

import AceCodeEditorJS, { AceCodeConfig } from "ace-code-editorjs";
import ace from "ace-builds";
import "ace-builds/esm-resolver";

import modeHTMLWorker from "ace-builds/src-noconflict/worker-html?url";
import modeJSWorker from "ace-builds/src-noconflict/worker-javascript?url";
import modeCSSWorker from "ace-builds/src-noconflict/worker-css?url";
import modePHPWorker from "ace-builds/src-noconflict/worker-php?url";
import modeXMLWorker from "ace-builds/src-noconflict/worker-xml?url";
import modeYamlWorker from "ace-builds/src-noconflict/worker-yaml?url";
import modeJsonWorker from "ace-builds/src-noconflict/worker-json?url";

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

const config = useRuntimeConfig();
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
        endpoints: {
          byFile: `${config.public.baseURL}upload/postimage/`, // Your backend file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
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
        endpoint: `${config.public.baseURL}/fetchUrl`, // Your backend endpoint for url data fetching,
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

// function save() {
//   editor.save().then((outputData) => {
//     console.log('Article data: ')
//     console.log(outputData)
//   }).catch((error) => {
//     console.log('Saving failed: ', error)
//   });
// }

</script>

<style lang="less" scoped>
#editorjs {
  width: 100%;
  max-width: 800px;
  box-shadow: 0px 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 3px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}
</style>
