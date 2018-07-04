import { createSelector } from 'reselect'

import { expressionTypes } from 'constantz'

import {
  selectNames,
  selectInvocations,
  selectParams,
  getCurrentFileExpressions,
  getCurrentFileImports,
  getCurrentFileDefaultExport,
} from 'containers/App/selectors'

const { LOOKTHROUGH } = expressionTypes

// let's start with the inefficient approach,
// the long term approach is to connect components further down
export const selectCurrentFileForEditing = createSelector(
  selectNames,
  getCurrentFileExpressions,
  selectParams,
  selectInvocations,
  getCurrentFileImports,
  getCurrentFileDefaultExport,
  (names, expressions, params, invocations, currentFileImports, defaultExportExpr) => ({
    // expressions
    expressions: expressions.map(expression => ({ // perf note map
      name: names[expression.nameId],
      type: expression.type,
      invocations: expression.invocationIds.map(id => invocations[id]),
      params: expression.paramIds.map(id => params[id]),
      exportType: expression.exportType,
    })).filter(({ type }) => type !== LOOKTHROUGH),
    // imports
    imports: currentFileImports,
    // exports
    defaultExport: defaultExportExpr,
  })
)
