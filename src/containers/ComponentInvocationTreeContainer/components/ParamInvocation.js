import T from 'prop-types'
import { forbidExtraProps } from 'airbnb-prop-types'
import React from 'react'
import styled from 'styled-as-components'
import theme from 'theme-proxy'
import { indent } from 'utils'

const ParamInvocation = ({ declIsSpreadMember, connectDragSource, isPIDragging, name, depth }) =>
  isPIDragging ? null : (
    <React.Fragment>
      {indent(depth)}
      {'{'}
      {connectDragSource(
        <div className="dragsource">
          {declIsSpreadMember && 'props.'}
          {name}
        </div>
      )}
      {'}'}
    </React.Fragment>
  )

export default styled(ParamInvocation).as.div`
  color: ${theme.colors.darkblue}
  .dragsource {
    display: inline-block;
    user-select: text;
  }
`

ParamInvocation.propTypes = forbidExtraProps({
  name: T.string.isRequired,
  depth: T.number.isRequired,
  isPIDragging: T.bool.isRequired,
  declIsSpreadMember: T.bool.isRequired,
  connectDragSource: T.func.isRequired,
})
