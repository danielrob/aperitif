import { RESOLVE_ALIASES } from 'constantz'

import indexHtml from './indexHtml'

/**
 * postProcessFileTree:
 * - adds index.html
 * - adds index.js files for top level components / containers folders
 * - adds package.json
 */
/* eslint-disable no-param-reassign */
export default function postProcessFileTree(fileTree, semis) {
  // index.html
  fileTree['index.html'] = indexHtml

  // indexes
  Object.entries(fileTree).forEach(([name, value]) => {
    if (RESOLVE_ALIASES.includes(name)) {
      fileTree[name]['index|js'] = Object.keys(value).reduce((out, exportName) => {
        const exportLine = `export { default as ${exportName} } from './${exportName}'${semis ? ';' : ''}`
        return out ? `${out}\n${exportLine}` : exportLine
      }, '')
    }
  })
  return fileTree
}
