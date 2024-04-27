<template>
  <div class="readonlyBlock">
    <div class="my-4" v-for="(item, index) in HTML" :key="index">
      <div v-html="item"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import LinkTool from '@editorjs/link';
import Table from '@editorjs/table';
import edjsHTML from 'editorjs-html';
// import 'highlight.js/styles/stackoverflow-light.css';
import 'highlight.js/styles/stackoverflow-dark.css';
import hljs from 'highlight.js';

hljs.highlightAll();

const props = defineProps({
  blockData: {
    type: Object as PropType<OutputData>,
    required: true,
    default: () => {}
  }
});

function TableParser(block: any) {
  let string = '';
  for (const rowItem in block.data.content) {
    string += `<div class="tc-row"> `;
    for (const columnItem of block.data.content[rowItem]) {
      string += `<div class="tc-cell"> ${columnItem} </div>`;
    }
    string += ` </div>`;
  }
  return `
    <div class="tc-table">
      ${string}
    </div>`;
}

function QuoteParser(block: any) {
  return `
    <blockquote style="text-align: ${block.data.alignment}">"${block.data.text}" - <span class="quoteCaption">${block.data.caption}</span></blockquote>
    `;
}

// TODO: Parse and show checklist
// function ChecklistParser(block: any){
//   let string = '';
//   for (const item of block.data.items) {
//     string += `<div class="checkbox-wrapper">`
//     string += `<input class="substituted" type="checkbox" aria-hidden="true" ${item.checked ? 'checked' : ''}>`

//     // for (const columnItem of block.data.content[rowItem]) {
//     //   string += `<div class="tc-cell"> ${columnItem} </div>`
//     // }
//     string += `</div>`
//     // string += `<div>${item.text}</div>`
//   }
//   return `<div class="cdx-block cdx-checklist">
//     ${string}
//   </div>`;
// }

// TODO: Parse and show image from meta
function LinkToolParser(block: any) {
  return `
      <a class="link-tool__content link-tool__content--rendered" target="_blank" rel="nofollow noindex noreferrer" href="${block.data.link}">
        <div class="link-tool__title">${block.data.meta.title}</div>
        <p class="link-tool__description">${block.data.meta.description}</p>
        <span class="link-tool__anchor"${block.data.link}</span>
      </a>
    `;
}

function ImageParser(block: any) {
  return `
    <figure>
      <img src="${block.data.file.url}" alt="${block.data.caption}">
      <figcaption>${block.data.caption}.</figcaption>
    </figure>
    `;
}

function CodeParser(block: any) {
  return `
    <pre>
      <code class="language-${block.data.language}">${block.data.code}</code>
    </pre>
    `;
}

const edjsParser = edjsHTML({
  table: TableParser,
  quote: QuoteParser,
  linkTool: LinkToolParser,
  image: ImageParser,
  code: CodeParser
});
const HTML = edjsParser.parse(props.blockData);
onMounted(() => {
  hljs.highlightAll();
});
</script>

<style lang="less" scoped>
.readonlyBlock {
  width: 100%;
  :deep(ol) {
    margin-left: 16px;
  }
  :deep(img) {
    max-width: 100%;
  }
  :deep(blockquote) {
    font:
      14px/22px normal helvetica,
      sans-serif;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
    padding-left: 15px;
    border-left: 3px solid #ccc;
    .quoteCaption {
      font-style: italic;
      font-family: 'Lato';
    }
  }
  :deep(.tc-table) {
    margin-top: 8px;
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;

    .tc-cell {
      border: 1px solid #dddddd;
      text-align: left;
      padding: 8px;
    }

    .tc-row:nth-child(even) {
      background-color: #dddddd;
    }
  }
  :deep(figcaption) {
    max-width: 200px;
    margin-left: auto;
    margin-right: auto;
    font-family: sohne, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
}
</style>
