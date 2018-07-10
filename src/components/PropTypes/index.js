import { maxBy } from 'lodash'
import C from 'check-types'
import React from 'react'
import JSstringify from 'javascript-stringify'

import { indent } from 'utils'
import { Semi } from 'components'
import { Name, NameInput } from 'containers'

const PropTypes = ({ props, nameId }) => {
  const maxCount = (maxBy(props, 'count') || { count: 0 }).count
  return !!props.length && (
    <React.Fragment>
      <br />
      <NameInput nameId={nameId} />.propTypes = {'{'}
      {props.filter(({ isSpreadMember }) => !isSpreadMember).map(
        ({ nameId, count, payload }) =>
          count && (
            <div key={nameId}>
              {indent(1)}
              <span
                data-tip={JSstringify(payload, null, 2)}
                data-for="prop"
                data-delay-show="250"
              >
                <Name nameId={nameId} />
              </span>
              : {getPropType(payload)}
              {count === maxCount && C.not.null(payload) && '.isRequired'}
              ,
            </div>
          )
      )}
      {'}'}<Semi />
    </React.Fragment>
  )
}

export default PropTypes

const getPropType = (payload, pTName = 'PropTypes', nested) => {
  if (C.null(payload)) {
    return `${pTName}.any`
  }
  if (C.string(payload)) {
    return `${pTName}.string`
  }
  if (C.boolean(payload)) {
    return `${pTName}.bool`
  }
  if (C.number(payload)) {
    return `${pTName}.number`
  }
  if (C.object(payload)) {
    if (nested) {
      return `${pTName}.object`
    }
    return (
      <React.Fragment>
        {pTName}.shape({'{'}
        <br />
        {Object.keys(payload).map(key => (
          <React.Fragment key={key}>
            {indent(2)}
            <span
              data-tip={JSstringify(payload[key], null, 2)}
              data-for="prop"
              data-delay-show="250"
            >
              {key}
            </span>
            : {getPropType(payload[key], pTName, true)},
            <br />
          </React.Fragment>
        ))}
        {indent(1)}
        {'}'})
      </React.Fragment>
    )
  }
  if (C.array(payload)) {
    if (nested) {
      return `${pTName}.array`
    }
    return `${pTName}.arrayOf(${getPropType(payload[0], pTName, true)})`
  }
}
