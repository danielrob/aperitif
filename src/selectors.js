import { partition } from 'lodash'
import { createSelector } from 'reselect'
import { DIR } from 'constantz'
import { sortAlphabetically } from 'utils'

export const selectCurrentFileId = s => s.app.present.currentFileId
export const selectRootFiles = s => s.app.present.rootFiles
export const selectNames = s => s.app.present.names
export const selectFiles = s => s.app.present.files
export const selectDeclarations = s => s.app.present.declarations
export const selectInvocations = s => s.app.present.invocations
export const selectCallParams = s => s.app.present.callParams
export const selectDeclParams = s => s.app.present.declParams
export const selectPreferences = s => s.app.present.preferences

/*
  Atomic model selectors
*/
export const makeSelectInvocation = () => createSelector(
  selectNames,
  selectInvocations,
  (state, props) => props.invocationId,
  (names, invocations, invocationId) => {
    const { id, nameId, ...rest } = invocations[invocationId]
    return {
      invocationId,
      name: names[nameId],
      nameId,
      ...rest,
    }
  }
)

/*
  Single Model selectors - `makeSelect${modelName}`
*/
export const makeSelectName = () => (state, props) => selectNames(state)[props.nameId]

export const makeSelectDeclaration = () => createSelector(
  selectNames,
  selectDeclarations,
  (state, props) => props.declarationId,
  (names, declarations, declarationId) => {
    const { id, nameId, ...rest } = declarations[declarationId]
    return {
      declarationId,
      name: names[nameId],
      nameId,
      ...rest,
    }
  }
)

export const makeSelectFile = () => createSelector(
  selectNames,
  selectFiles,
  selectCurrentFileId,
  (state, props) => props.fileId,
  (names, files, currentFileId, fileId) => {
    const { nameId, type, children, declarationIds } = files[fileId]
    const sortedChildren = children.sort((a, b) => {
      const aName = names[files[a].nameId]
      const bName = names[files[b].nameId]
      return (
        (aName === 'index' && 1) ||
        (bName === 'index' && -1) ||
        sortAlphabetically(aName, bName)
      )
    })


    const [directories, fichiers] = partition(sortedChildren, id =>
      files[id].isDirectory
    )


    return {
      nameId,
      name: names[nameId],
      type,
      fileChildren: [...directories, ...fichiers],
      isDirectory: !!children.length || type === DIR,
      isCurrent: fileId === currentFileId,
      containsCurrent: children.includes(currentFileId),
      declarationIds,
    }
  }
)

