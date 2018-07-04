/* eslint-disable prefer-const */
import { createAction } from 'redux-actions'

import {
  addNames,
  addFiles,
  addExpressions,
  addInvocations,
  insertAt,
  insertAtKey,
  removeAtKey,
  updateEntity,
  updateEntityAtKey,
} from 'model-utils'
import { DIR, STYLED_COMPONENT, componentExpressionTypes, PARAM_INVOCATION } from 'constantz'
import { capitalize } from 'utils'

import { getNewComponentName } from './helpers'
import getTestDB from './getTestDB'

export const CREATE_COMPONENT_BUNDLE = 'CREATE_COMPONENT_BUNDLE'
export const ADD_ATTRIBUTE_TO_COMPONENT_INVOCATION = 'ADD_ATTRIBUTE_TO_COMPONENT_INVOCATION'
export const ADD_PARAM_AS_COMPONENT_INVOCATION_CHILD = 'ADD_PARAM_AS_COMPONENT_INVOCATION_CHILD'
export const MOVE_PARAM_TO_SPREAD = 'MOVE_PARAM_TO_SPREAD'
export const ADD_SPREAD_ATTRIBUTE_TO_COMPONENT_INVOCATION = 'ADD_SPREAD_ATTRIBUTE_TO_COMPONENT_INVOCATION'
export const ADD_INVOCATION_FROM_FILE_TO_CI = 'ADD_INVOCATION_FROM_FILE_TO_CI'
export const MOVE_INVOCATION = 'MOVE_INVOCATION'
export const MOVE_PARAM_INVOCATION = 'MOVE_PARAM_INVOCATION'
export const CHANGE_FILE = 'CHANGE_FILE'
export const CHANGE_NAME = 'CHANGE_NAME'

export default function appReducer(state = getTestDB(), action) {
  switch (action.type) {
    case CHANGE_NAME: {
      const { names } = state
      const { nameId, value } = action.payload

      return {
        ...state,
        names: updateEntity(names, nameId, value),
      }
    }
    case CHANGE_FILE: {
      const { currentFileId, files, names } = state
      let { payload: nextId } = action
      const { type, children } = files[nextId]

      if (type === DIR) {
        nextId = children.find(fileId => names[files[fileId].nameId].includes('index'))
      }

      return {
        ...state,
        currentFileId: nextId || currentFileId,
      }
    }

    case MOVE_PARAM_TO_SPREAD: {
      const { params } = state
      const { payload: { paramId } } = action

      return {
        ...state,
        params: updateEntityAtKey(params, paramId, 'isSpreadMember', true),
      }
    }

    case ADD_SPREAD_ATTRIBUTE_TO_COMPONENT_INVOCATION: {
      const { invocations } = state
      const { payload: { invocationId } } = action

      return {
        ...state,
        invocations: updateEntityAtKey(
          invocations,
          invocationId,
          'hasPropsSpread',
          true
        ),
      }
    }

    case ADD_ATTRIBUTE_TO_COMPONENT_INVOCATION: {
      const { invocations } = state
      const { payload: { parentId, item: { id: itemId } } } = action

      const updater = oldInvocation => insertAtKey(oldInvocation, 'paramIds', 0, itemId)
      const nextInvocations = updateEntity(invocations, parentId, updater)

      return {
        ...state,
        invocations: nextInvocations,
      }
    }

    case ADD_PARAM_AS_COMPONENT_INVOCATION_CHILD: {
      const { invocations } = state
      const { targetInvocationId, targetPosition, paramId } = action.payload

      /* Creates */
      let paramInvocation = { nameOrNameId: paramId, type: PARAM_INVOCATION, source: null }
      let nextInvocations
      [nextInvocations, paramInvocation] = addInvocations(invocations, paramInvocation)

      /* Update */
      const updater = ivn => ({
        ...ivn,
        invocationIds: insertAt(ivn.invocationIds, targetPosition, paramInvocation),
        closed: false,
      })
      nextInvocations = updateEntity(nextInvocations, targetInvocationId, updater)

      return {
        ...state,
        invocations: nextInvocations,
      }
    }

    case ADD_INVOCATION_FROM_FILE_TO_CI: {
      const { names, invocations, files, expressions } = state
      const { targetInvocationId, targetPosition, fileId, isDirectory } = action.payload

      let file = files[fileId]
      if (isDirectory) {
        file = files[file.children.find(id => names[files[id].nameId] === 'index')]
      }

      const expressionId = file.expressionIds.find(
        id => componentExpressionTypes.includes(expressions[id].type)
      )

      /* CREATES */
      let [nextInvocations, newInvocationId] = // eslint-disable-line prefer-const
        addInvocations(invocations, {
          nameOrNameId: expressions[expressionId].nameId,
          source: null,
          closed: true,
        })

      /* UPDATES */
      const updater = ivn => insertAtKey(ivn, 'invocationIds', targetPosition, newInvocationId)
      nextInvocations = updateEntity(nextInvocations, targetInvocationId, updater)

      return {
        ...state,
        invocations: nextInvocations,
      }
    }

    case MOVE_INVOCATION: {
      const { invocations } = state
      const {
        sourceParentId,
        sourceInvocationId,
        targetInvocationId,
        targetPosition,
      } = action.payload
      let updater
      let nextInvocations

      const sourcePosition = invocations[sourceParentId].invocationIds.findIndex(
        id => id === sourceInvocationId,
      )

      /* UPDATES */
      // remove
      updater = ivn => removeAtKey(ivn, 'invocationIds', sourcePosition)
      nextInvocations = updateEntity(invocations, sourceParentId, updater)

      // insert
      updater = ivn => insertAtKey(ivn, 'invocationIds', targetPosition, sourceInvocationId)
      nextInvocations = updateEntity(nextInvocations, targetInvocationId, updater)

      return {
        ...state,
        invocations: nextInvocations,
      }
    }

    case CREATE_COMPONENT_BUNDLE: {
      const { names, files, rootFiles, expressions, invocations, params } = state
      const {
        payload: {
          parentId,
          position,
          item: {
            name,
            id: itemId,
          },
          // #couldchangeinrefactor
          propAsChild,
          closed,
        },
      } = action

      /* CREATES */
      /* eslint-disable prefer-const */
      // names
      let dirName = getNewComponentName(names, capitalize(name))
      let indexName = 'index'
      let wrapperName = `${dirName}Wrapper`
      let nextNames
      [nextNames, dirName, indexName, wrapperName] =
        addNames(names, dirName, indexName, wrapperName)

      // invocations
      let nextInvocations = invocations
      let invocationIds = []

      // paramInvocation if adding now
      if (propAsChild) {
        let paramInvocation = { nameOrNameId: itemId, type: PARAM_INVOCATION, source: null };
        [nextInvocations, paramInvocation] = addInvocations(nextInvocations, paramInvocation)
        invocationIds.push(paramInvocation)
      }

      let invoke = {
        nameOrNameId: dirName,
        source: null,
        paramIds: propAsChild ? [] : [itemId],
        invocationIds,
        closed,
      }
      let wrapperInvoke = { nameOrNameId: wrapperName, source: null };
      [nextInvocations, invoke, wrapperInvoke] =
        addInvocations(nextInvocations, invoke, wrapperInvoke)

      // expressions
      let expression =
        { nameId: dirName, invocationIds: [wrapperInvoke], paramIds: [itemId] }
      let wrapperExpression = { nameId: wrapperName, invocationIds: [], type: STYLED_COMPONENT }
      let nextExpressions
      [nextExpressions, expression, wrapperExpression] =
        addExpressions(expressions, expression, wrapperExpression)

      // files
      let indexFile = { nameId: indexName, expressionIds: [expression] }
      let wrapperFile = { nameId: wrapperName, expressionIds: [wrapperExpression] }
      let nextFiles
      [nextFiles, indexFile, wrapperFile] = addFiles(files, indexFile, wrapperFile)

      // dirs
      let directory = { nameId: dirName, type: DIR, children: [wrapperFile, indexFile] };
      [nextFiles, directory] = addFiles(nextFiles, directory)
      /* eslint-enable prefer-const */

      /* UPDATES */
      const updater = ivn => ({
        ...ivn,
        invocationIds: insertAt(ivn.invocationIds, position, invoke),
        closed: false,
      })
      nextInvocations = updateEntity(nextInvocations, parentId, updater)

      return {
        ...state,
        names: nextNames,
        expressions: nextExpressions,
        invocations: nextInvocations,
        rootFiles: [directory, ...rootFiles],
        files: nextFiles,
        params, // todo
      }
    }

    default:
      return state
  }
}

export const createComponentBundle = createAction(
  CREATE_COMPONENT_BUNDLE
)

export const changeFile = createAction(
  CHANGE_FILE
)

export const addAttributeToComponentInvocation = createAction(
  ADD_ATTRIBUTE_TO_COMPONENT_INVOCATION
)

export const addParamAsComponentInvocationChild = createAction(
  ADD_PARAM_AS_COMPONENT_INVOCATION_CHILD
)

export const addPropsSpreadToComponentInvocation = createAction(
  ADD_SPREAD_ATTRIBUTE_TO_COMPONENT_INVOCATION
)

export const addInvocationFromFileToCI = createAction(
  ADD_INVOCATION_FROM_FILE_TO_CI
)

export const moveParamToSpread = createAction(
  MOVE_PARAM_TO_SPREAD
)

export const moveInvocation = createAction(
  MOVE_INVOCATION
)

export const changeName = createAction(
  CHANGE_NAME
)
