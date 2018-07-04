import { createSelector } from 'reselect'
import { DIR } from 'constantz'

export const selectCurrentFileId = s => s.app.currentFileId
export const selectRootFiles = s => s.app.rootFiles
export const selectNames = s => s.app.names
export const selectFiles = s => s.app.files
export const selectDeclarations = s => s.app.declarations
export const selectInvocations = s => s.app.invocations
export const selectParams = s => s.app.params

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
      declarationId: id,
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
    const { id, nameId, type, children, declarationIds } = files[fileId]

    return {
      name: names[nameId],
      type,
      fileChildren: children,
      isDirectory: !!children.length || type === DIR,
      isCurrent: id === currentFileId,
      declarationIds,
    }
  }
)


/*
  Filtered set of Model selectors - `selectSome${modelName}s`
*/
export const makeSelectSomeParams = () => createSelector(
  selectNames,
  selectParams,
  (state, props) => props.paramIds,
  (names, params, filterIds) =>
    filterIds.map(id => ({
      name: names[params[id].nameId],
      ...params[id],
    }))
)

