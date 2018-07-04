import { isFunction, isPlainObject } from 'lodash'
import invariant from 'invariant'

import { JS, STATELESS_FUNCTION_COMPONENT, DEFAULT, COMPONENT_INVOCATION, required, requiredOrNull } from 'constantz'
import { getNextId, getEntitiesAdder } from './helpers'


/*
  Model creation functions
*/
/**
  * The following functions have this signature:
  * @param {Object} modelTable: existing model table to update
  * @param {...Object} newPartial: combined with default model props to create a new model instance
 */
export const addNames = (names, ...args) => {
  invariant(args && args[0], 'at least one name is required')
  return args.reduce((out, name) => {
    const [nextNames, ...nextIds] = out
    const nextNameId = getNextId(nextNames)
    return [
      { ...nextNames, [nextNameId]: name },
      ...nextIds, nextNameId,
    ]
  }, [names])
}

export const addParams = getEntitiesAdder({
  nameId: required,
  payload: null,
  // type specific items
  isSpreadMember: false, // react component expressions
})


export const addFiles = getEntitiesAdder({
  nameId: required,
  type: JS,
  children: [],
  expressionIds: [],
})

export const addExpressions = getEntitiesAdder({
  nameId: required,
  type: STATELESS_FUNCTION_COMPONENT,
  paramIds: [],
  exportType: DEFAULT,
  invocationIds: [],
  // type specific items
  tag: null, // styled-component
})

export const addInvocations = getEntitiesAdder({
  nameId: required,
  source: requiredOrNull,
  paramIds: [],
  invocationIds: [],
  // type specific items
  type: COMPONENT_INVOCATION,
  closed: false, // component-invocation
  hasPropsSpread: false,
})


/*
  Generic limited immutable helpers
*/
/**
 * @function update: { ..., [id]: newValue|cb(oldValue), }
 * @param {Object} entities: object to update, e.g. a model table
 * @param {integer} entityId: object key, e.g. id of entity to be updated
 * @param {Object|Function} valueOrUpdater: value to set, or function to be called with prior value
 */
export const update = (entities, entityId, valueOrUpdater) => ({
  ...entities,
  [entityId]:
    (isFunction(valueOrUpdater) && valueOrUpdater(entities[entityId])) ||
    (isPlainObject(valueOrUpdater) && {
      ...entities[entityId],
      ...valueOrUpdater,
      id: [entityId],
    }) ||
    valueOrUpdater,
})

/**
 * @function updateAtKey: { ..., [id]: { ...oldEntity, key: newValue }, }
 * @param {Object} entities: object to update, e.g. a model table
 * @param {integer} entityId: object key, e.g. id of entity to be updated
 * @param {string|number} key: corresponding key in entity for which value shall be set
 * @param {*} newValue: value to set
 */
export const updateAtKey = (entities, entityId, key, newValue) => ({
  ...entities,
  [entityId]: {
    ...entities[entityId],
    [key]: newValue,
    id: entityId,
  },
})

/**
 * @function insertAt: [..., newValue, ...]
 * @param {Array} arrayToUpdate: array to be updated
 * @param {number} position: array position to update
 * @param {*} insertValue: value to be inserted
 */
export const insertAt = (arrayToUpdate, position, insertValue) => ([
  ...arrayToUpdate.slice(0, position),
  insertValue,
  ...arrayToUpdate.slice(position),
])

/**
 * @function insertAtKey: { ..., [key]: [..., newValue, ...] }
 * @param {Object} objectToUpdate: object to be updated
 * @param {*} key: object key at which to apply insertAt
 * @param {number} position: array position to update
 * @param {*} insertValue: value to be inserted
 */
export const insertAtKey = (objectToUpdate, key, position, insertValue) => ({
  ...objectToUpdate,
  [key]: insertAt(objectToUpdate[key], position, insertValue),
})

/**
 * @function removeAt: [...n, ,n+1...]
 * @param {Array} arrayToUpdate: array to be updated
 * @param {number} position: array position to remove
 */
export const removeAt = (arrayToUpdate, position) => ([
  ...arrayToUpdate.slice(0, position),
  ...arrayToUpdate.slice(position + 1),
])

/**
 * @function removeAtKey: { ..., [key]: [...n, ...n+1] }
 * @param {Object} objectToUpdate: object to be updated
 * @param {*} key: object key at which to apply removeAt
 * @param {number} position: array position to remove
 */
export const removeAtKey = (objectToUpdate, key, position) => ({
  ...objectToUpdate,
  [key]: removeAt(objectToUpdate[key], position),
})

