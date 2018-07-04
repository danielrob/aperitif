import T from 'prop-types'
import { forbidExtraProps } from 'airbnb-prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

import { compose } from 'utils'
import { DraggableTypes } from 'constantz'
import { createComponentBundle } from 'duck'

import { CIDropzone } from '../components'

class NewWithPropAsChildPropDropzone extends React.Component {
  render() {
    const { connectDropTarget, isOver, children } = this.props
    return (
      <CIDropzone
        innerRef={innerRef => connectDropTarget(findDOMNode(innerRef))}
        isOver={isOver}
      >
        {children}
      </CIDropzone>
    )
  }
}

/* connect */
const mapDispatchToProps = {
  newWithPropAsChild: createComponentBundle,
}

/* dnd */
const dropzoneTarget = {
  drop(props, monitor) {
    const { newWithPropAsChild, targetInvocationId: parentId, targetPosition: position } = props
    newWithPropAsChild({ parentId, position, item: monitor.getItem(), propAsChild: true })
  },
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
})

/* compose export */
export default compose(
  connect(null, mapDispatchToProps),
  DropTarget(DraggableTypes.PROP, dropzoneTarget, collect)
)(NewWithPropAsChildPropDropzone)


/* propTypes */
NewWithPropAsChildPropDropzone.propTypes = forbidExtraProps({
  // passed by parent
  targetInvocationId: T.number.isRequired,
  targetPosition: T.number.isRequired,
  children: T.node.isRequired,

  // mapDispatchToProps
  newWithPropAsChild: T.func.isRequired,

  // Injected by React DnD:
  connectDropTarget: T.func.isRequired,
  isOver: T.bool.isRequired,
})
