<template>
  <div id="editorjs" v-show="false"></div>
  <div class="readonlyBlock">
    <div class="my-4" v-for="(item, index) in HTML" :key="index">
      <div v-html="item"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import edjsHTML from 'editorjs-html';
// import 'highlight.js/styles/stackoverflow-light.css';
import 'highlight.js/styles/stackoverflow-dark.css';
import hljs from 'highlight.js';

if (import.meta.client) {
  onMounted(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const List = (await import('@editorjs/list')).default;
    const Quote = (await import('@editorjs/quote')).default;
    const ImageTool = (await import('@editorjs/image')).default;
    const Table = (await import('@editorjs/table')).default;
    const editor = new EditorJS({
      holder: 'editorjs',
      tools: {
        header: Header,
        list: List,
        quote: Quote,
        image: ImageTool,
        table: Table
      }
    });
    hljs.highlightAll();
  });
}

const props = defineProps({
  blockData: {
    type: Object as PropType<any>,
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
    <blockquote style="text-align: ${block.data.alignment}">"${block.data.text}" ${block.data.caption ? '-' : ''} <span class="quoteCaption">${block.data.caption}</span></blockquote>
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
        <div class="link-tool__image" style="background-image: url(${block.data.meta.image.url});"></div>
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
      <figcaption>${block.data.caption}</figcaption>
    </figure>
    `;
}

function CodeParser(block: any) {
  if (block.data.language === 'html') {
    block.data.code = block.data.code
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
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
  font-size: 20px;
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

:deep(.link-tool) {
  position: relative;

  &__content {
    display: block;
    padding: 25px;
    border-radius: 2px;
    box-shadow: 0 0 0 2px #fff;
    color: initial !important;
    text-decoration: none !important;

    &::after {
      content: '';
      clear: both;
      display: table;
    }

    &--rendered {
      background: #fff;
      border: 1px solid rgba(201, 201, 204, 0.48);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      will-change: filter;
      animation: link-in 450ms 1 cubic-bezier(0.215, 0.61, 0.355, 1);

      &:hover {
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
      }
    }
  }

  &__image {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    margin: 0 0 0 30px;
    width: 65px;
    height: 65px;
    border-radius: 3px;
    float: right;
  }

  &__title {
    font-size: 17px;
    font-weight: 600;
    line-height: 1.5em;
    margin: 0 0 10px 0;

    &__anchor {
      margin-top: 25px;
    }
  }

  &__description {
    margin: 0 0 20px 0;
    font-size: 15px;
    line-height: 1.55em;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__anchor {
    display: block;
    font-size: 15px;
    line-height: 1em;
    color: #888 !important;
    border: 0 !important;
    padding: 0 !important;
  }
}
</style>
