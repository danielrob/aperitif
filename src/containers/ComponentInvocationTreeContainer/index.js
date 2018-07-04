import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createComponentBundle } from 'duck'
import { DropTarget } from 'react-dnd'

import { ComponentInvocationTree } from 'components'
import { DraggableTypes } from 'constantz'
import { compose } from 'utils'

import { makeGetInvocation } from './selectors'

/* connect */
const makeMapStateToProps = () => {
  const getInvocation = makeGetInvocation()
  return (state, props) => getInvocation(state, props)
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ createComponentBundle }, dispatch)

/* dnd */
const dropzoneTarget = {}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isSupremeOver: monitor.isOver(),
  dragItem: monitor.getItem(),
})

/* compose */
export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  DropTarget(DraggableTypes.PROP, dropzoneTarget, collect)
)(ComponentInvocationTree)
