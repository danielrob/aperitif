import { partition } from 'lodash'
import T from 'prop-types'
import { forbidExtraProps } from 'airbnb-prop-types'
import React from 'react'
import styled from 'styled-as-components'

import theme from 'theme-proxy'
import { PROP, PROPS_SPREAD } from 'constantz'
import { indent } from 'utils'

import { canDropPropToOpenTag } from '../helpers'

const OpenTag = ({
  name,
  isOverOpenTag,
  dragItem,
  callParams,
  closed,
  hasPropsSpread,
  pseudoSpreadPropsName,
  depth,
}) => {
  const spreadPropsIsOver = isOverOpenTag && dragItem.type === PROPS_SPREAD
  const propIsOver = isOverOpenTag && dragItem.type === PROP &&
    canDropPropToOpenTag(callParams, dragItem)

  const [keyParams, standardCallParams] = partition(callParams, p => p.name === 'key')
  const keyParam = keyParams[0]

  return (
    <React.Fragment>
      {indent(depth)}{`<${name}`}
      {keyParam && (
        <span>
          {' '}{keyParam.name}={'{'}{keyParam.valueString}{'}'}
        </span>
      )}
      {(hasPropsSpread || spreadPropsIsOver) && (
        <span className="spread-props-attribute">
          {' {'}...props{'}'}
        </span>
        )}
      {pseudoSpreadPropsName && (
        <span className="spread-props-attribute">
          {' {'}...{pseudoSpreadPropsName}{'}'}
        </span>
        )}
      {propIsOver && (
        <span className="new-attribute-preview">
          {' '}
          {dragItem.name}={'{'}
          {dragItem.isSpreadMember && 'props.'}
          {dragItem.name}
          {'}'}
        </span>
      )}
      {standardCallParams.map(({ id, declIsSpreadMember, name, valueString = name }) =>
        !((hasPropsSpread || spreadPropsIsOver) && declIsSpreadMember) && (
          <span key={id}>
            {' '}
            {name}
            =
            {'{'}
            {declIsSpreadMember && 'props.'}
            {valueString}
            {'}'}
          </span>
        ))}
      {closed && ' /'}
      {'>'}
    </React.Fragment>
  )
}

export default styled(OpenTag).as.div.attrs({ style: { userSelect: 'text' } })`
  .new-attribute-preview {
    color: ${theme.color.darkgreen};
    transition: 250ms;
  }
`

/* propTypes */
OpenTag.propTypes = forbidExtraProps({
  name: T.string.isRequired,
  callParams: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    declIsSpreadMember: T.bool,
    valueString: T.string,
  }).isRequired).isRequired,
  closed: T.bool.isRequired,
  hasPropsSpread: T.bool.isRequired,
  pseudoSpreadPropsName: T.string,
  depth: T.number.isRequired,

  // for wrapper
  innerRef: T.func.isRequired,

  // Injected by React DnD:
  isOverOpenTag: T.bool.isRequired,
  dragItem: T.shape({ type: T.string }).isRequired,
})

OpenTag.defaultProps = {
  pseudoSpreadPropsName: null,
}
