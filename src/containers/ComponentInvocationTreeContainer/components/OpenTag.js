import T from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-as-components'

import theme from 'theme-proxy'
import { PROP, PROPS_SPREAD } from 'constantz'
import { indent } from 'utils'

const OpenTag = ({
  name,
  isOverCI,
  isOverOpenTag,
  dragItem,
  paramIds,
  params,
  closed,
  hasPropsSpread,
  depth,
}) => {
  const spreadPropsIsOver = isOverOpenTag && dragItem.type === PROPS_SPREAD
  const propIsOver = isOverCI && dragItem.type === PROP && !paramIds.includes(dragItem.id)

  return (
    <React.Fragment>
      {indent(depth)}{`<${name}`}
      {propIsOver && (
        <span className="new-attribute-preview">
          {' '}
          {dragItem.name}={'{'}
          {dragItem.isSpreadMember && 'props.'}
          {dragItem.name}
          {'}'}
        </span>
        )}
      {(hasPropsSpread || spreadPropsIsOver) && (
        <span className="spread-props-attribute">
          {' {'}...props{'}'}
        </span>
        )}
      {params.map(param => !(hasPropsSpread && param.isSpreadMember) && (
        <span key={param.id}>
          {' '}
          {param.name}
          =
          {'{'}
          {param.isSpreadMember && 'props.'}
          {param.name}
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
    color: ${theme.color.darkblue};
    ${props => props.isOverCIButNotOpenTag && 'font-size: 14px'};
    ${props => props.isOverCIButNotOpenTag && css`color: ${theme.color.grey};`}
    transition: 130ms;
  }
`

OpenTag.propTypes = {
  name: T.string.isRequired,
  isOverCI: T.bool.isRequired,
  paramIds: T.arrayOf(T.number).isRequired,
  params: T.arrayOf(T.object).isRequired,
  closed: T.bool.isRequired,
  hasPropsSpread: T.bool.isRequired,
  dragItem: T.shape({ type: T.string }).isRequired,
  depth: T.number.isRequired,

  // Injected by React DnD:
  isOverOpenTag: T.bool.isRequired,
}
