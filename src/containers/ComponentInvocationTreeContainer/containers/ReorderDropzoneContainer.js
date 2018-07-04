import T from 'prop-types'
import { forbidExtraProps } from 'airbnb-prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

import { compose } from 'utils'
import { COMPONENT_INVOCATION } from 'constantz'
import { moveInvocation } from 'duck'

import { ReorderDropzone } from '../components'

class ReorderDropzoneContainer extends React.Component {
  render() {
    const { connectDropTarget, ciDimensions, ...props } = this.props
    return (
      <ReorderDropzone
        innerRef={innerRef => connectDropTarget(findDOMNode(innerRef))}
        ciDimensions={ciDimensions}
        {...props}
      />
    )
  }
}

/* connect */
const mapDispatchToProps = { moveInvocation }

/* dnd */
const dropzoneTarget = {
  drop(props) {
    const {
      moveInvocation,
      sourceInvocationId,
      targetInvocationId,
      targetPosition,
      parentId,
    } = props
    moveInvocation({
      sourceParentId: parentId,
      sourceInvocationId,
      targetInvocationId,
      targetPosition,
    })
  },
}

const collect = connect => ({
  connectDropTarget: connect.dropTarget(),
})

/* compose export */
export default compose(
  connect(null, mapDispatchToProps),
  DropTarget(COMPONENT_INVOCATION, dropzoneTarget, collect)
)(ReorderDropzoneContainer)


/* propTypes */
ReorderDropzoneContainer.propTypes = forbidExtraProps({
  // passed by parent
  targetInvocationId: T.number.isRequired,
  position: T.number.isRequired,
  parentId: T.number.isRequired,

  // from dragItem via parent
  sourceInvocationId: T.number.isRequired,
  ciDimensions: T.shape({ clientWidth: T.number, clientHeight: T.number }).isRequired,
  depth: T.number.isRequired,

  // connect
  moveInvocation: T.func.isRequired,

  // React Dnd
  connectDropTarget: T.func.isRequired,
})
