import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';
import fs from 'fs-extra';
// import ts from 'typescript';
import { packages } from '../../../meta/packages';
import { functionNames, getFunction } from '../../../packages/metadata/metadata';
// import { getTypeDefinition, replacer } from '../../../scripts/utils';

export function MarkdownTransform(): Plugin {
  // const DIR_TYPES = resolve(__dirname, '../../../types/packages');
  // const hasTypes = fs.existsSync(DIR_TYPES);

  // if (!hasTypes)
  //   console.warn('No types dist found, run `npm run build:types` first.');

  return {
    name: 'vueyous-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null;

      // linkify function names
      code = code.replace(
        new RegExp(`\`({${functionNames.join('|')}})\`(.)`, 'g'),
        (_, name, ending) => {
          if (ending === ']') // already a link
            return _;
          const fn = getFunction(name)!;
          return `[\`${fn.name}\`](${fn.docs}) `;
        },
      );

      // TODO: set link after deployed
      // convert links to relative
      // code = code.replace(/https?:\/\/vueuse\.org\//g, '/');

      const [pkg, _name, i] = id.split('/').slice(-3);

      const name = functionNames.find(n => n.toLowerCase() === _name.toLowerCase()) || _name;

      if (functionNames.includes(name) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('---\n\n');
        const firstHeader = code.search(/\n#{2,6}\s.+/);
        const sliceIndex = firstHeader < 0 ? frontmatterEnds < 0 ? 0 : frontmatterEnds + 4 : firstHeader;

        // Insert JS/TS code blocks
        //         code = await replaceAsync(code, /\n```ts( [^\n]+)?\n(.+?)\n```\n/gs, async (_, meta = '', snippet = '') => {
        //           const formattedTS = (await format(snippet.replace(/\n+/g, '\n'), { semi: false, singleQuote: true, parser: 'typescript' })).trim();
        //           const js = ts.transpileModule(formattedTS, {
        //             compilerOptions: { target: 99 },
        //           });
        //           const formattedJS = (await format(js.outputText, { semi: false, singleQuote: true, parser: 'typescript' }))
        //             .trim();
        //           if (formattedJS === formattedTS)
        //             return _;
        //           return `
        // <CodeToggle>
        // <div class="code-block-ts">

        // \`\`\`ts ${meta}
        // ${snippet}
        // \`\`\`

        // </div>
        // <div class="code-block-js">

        // \`\`\`js
        // ${formattedJS}
        // \`\`\`

        // </div>
        // </CodeToggle>\n`;
        //         });

        const { header } = await getFunctionMarkdown(pkg, name);

        // if (hasTypes)
        //   code = replacer(code, footer, 'FOOTER', 'tail');
        if (header)
          code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex);

        code = code
          .replace(/(# \w+?)\n/, `$1\n\n<FunctionInfo fn="${name}"/>\n`);
        // .replace(/## (Components?(?:\sUsage)?)/i, '## $1\n<LearnMoreComponents />\n\n')
        // .replace(/## (Directives?(?:\sUsage)?)/i, '## $1\n<LearnMoreDirectives />\n\n');
      }

      return code;
    },
  };
}

const DIR_SRC = resolve(__dirname, '../..');
const GITHUB_BLOB_URL = 'https://github.com/pei-pay/VueYous/blob/main/packages';

export async function getFunctionMarkdown(pkg: string, name: string) {
  const URL = `${GITHUB_BLOB_URL}/${pkg}/${name}`;

  const dirname = join(DIR_SRC, pkg, name);
  const demoPath = ['demo.vue'].find(i => fs.existsSync(join(dirname, i)));
  // const types = await getTypeDefinition(pkg, name);

  // if (!types)
  //   console.warn(`No types found for ${pkg}/${name}`);

  // let typingSection = '';

  //   if (types) {
  //     const code = `\`\`\`typescript\n${types.trim()}\n\`\`\``;
  //     typingSection = types.length > 1000
  //       ? `
  // ## Type Declarations

  // <details>
  // <summary op50 italic cursor-pointer select-none>Show Type Declarations</summary>

  // ${code}

  // </details>
  // `
  //       : `\n## Type Declarations\n\n${code}`;
  //   }

  const links = ([
    ['Source', `${URL}/index.ts`],
    demoPath ? ['Demo', `${URL}/${demoPath}`] : undefined,
    ['Docs', `${URL}/index.md`],
  ])
    .filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`).join(' • ');

  const sourceSection = `## Source\n\n${links}\n`;
  //   const ContributorsSection = `
  // ## Contributors

  // <Contributors fn="${name}" />
  //   `;
  //   const changelogSection = `
  // ## Changelog

  // <Changelog fn="${name}" />
  // `;

  const demoSection = demoPath
    ? `
<script setup>
import Demo from \'./${demoPath}\'
</script>

## Demo

<DemoContainer>
<p class="demo-source-link"><a href="${URL}/${demoPath}" target="_blank">source</a></p>
<Demo/>
</DemoContainer>
`
    : '';

  const packageNote = packages.find(p => p.name === pkg)!.addon
    ? `Available in the <a href="/${pkg}/README">@vueyous/${pkg}</a> add-on.\n`
    : '';

  // const footer = `${typingSection}\n\n${sourceSection}\n${ContributorsSection}\n${changelogSection}\n`;
  const footer = `${sourceSection}`;

  const header = demoSection + packageNote;

  return {
    footer,
    header,
  };
}

// function replaceAsync(str: string, match: RegExp, replacer: (substring: string, ...args: any[]) => Promise<string>) {
//   const promises: Promise<string>[] = [];
//   str.replace(match, (...args) => {
//     promises.push(replacer(...args));
//     return '';
//   });
//   return Promise.all(promises).then(replacements => str.replace(match, () => replacements.shift()!));
// }