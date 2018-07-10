import { partition } from 'lodash'
import T from 'prop-types'
import { forbidExtraProps } from 'airbnb-prop-types'
import React from 'react'
import styled from 'styled-as-components'

import theme from 'theme-proxy'
import { invocationPropTypes } from 'model-prop-types'
import { PROP, PROPS_SPREAD } from 'constantz'
import { indent } from 'utils'
import { Input } from 'components'

const OpenTag = ({
  isOverOpenTag,
  dragItem,
  depth,
  invocation: {
    callParams,
    closed,
    hasPropsSpread,
    pseudoSpreadPropsName,
    nameId,
  },
}) => {
  const spreadPropsIsOver = isOverOpenTag && dragItem.type === PROPS_SPREAD
  const propIsOver = isOverOpenTag && dragItem.type === PROP &&
    canDropPropToOpenTag(callParams, pseudoSpreadPropsName, dragItem)

  const [keyParams, standardCallParams] = partition(callParams, p => p.name === 'key')
  const keyParam = keyParams[0]

  return (
    <React.Fragment>
      {indent(depth)}{'<'}<Input pointer nameId={nameId} />
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

/* propTypes */
OpenTag.propTypes = forbidExtraProps({
  invocation: invocationPropTypes.isRequired,
  depth: T.number.isRequired,
  // for wrapper
  innerRef: T.func.isRequired,
  // Injected by React DnD:
  isOverOpenTag: T.bool.isRequired,
  dragItem: T.shape({ type: T.string }).isRequired,
})

/* style, export */
export default styled(OpenTag).as.div`
  ${props => props.invocation.inline && 'display: inline-block;'}
  .new-attribute-preview {
    color: ${theme.color.darkgreen};
    transition: 250ms;
  }
`

// helpers
export const canDropPropToOpenTag = (targetCallParams, pseudoSpreadPropsName, propBeingDragged) =>
  !targetCallParams.find(({ declParamId }) => declParamId === propBeingDragged.paramId)
  && pseudoSpreadPropsName !== propBeingDragged.name
