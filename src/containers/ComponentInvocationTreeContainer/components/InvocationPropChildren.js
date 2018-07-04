import React from 'react'
import styled from 'styled-as-components'

import theme from 'theme-proxy'
import { indent } from 'utils'

const InvocationPropChildren = ({ paramChildren, depth }) => (
  <React.Fragment>
    {!!paramChildren.length && indent(depth + 1)}
    {paramChildren.map(child => (
      <span key={child.displayId}>
        {'{'}
        <span className="prop-as-child">
          {child.isSpreadMember && 'props.'}
          {child.name}
        </span>
        {'}'}
      </span>
    ))}
  </React.Fragment>
)

export default styled(InvocationPropChildren).as.div`
  .prop-as-child {
    color: ${theme.colors.darkblue}
  }
`
