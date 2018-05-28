import T from 'prop-types'
import { forbidExtraProps, or, explicitNull } from 'airbnb-prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { DragSource, DropTarget } from 'react-dnd'
import { findDOMNode } from 'react-dom'

import { compose } from 'utils'
import { fileTypesArray, DIR, FILE, STYLED_COMPONENT } from 'constantz'
import { changeFile, moveDeclarationToFile, moveFile } from 'duck'

import { makeGetFile } from '../selectors'
import { File } from '../components'

class FileContainer extends React.Component {
  onClickHandler = e => {
    const { changeFile, fileId } = this.props
    e.stopPropagation()
    changeFile(fileId)
  }

  render() {
    const {
      connectDragSource,
      fileId, // eslint-disable-line no-unused-vars
      isCurrent, // eslint-disable-line no-unused-vars
      declarationIds, // eslint-disable-line no-unused-vars
      changeFile, // eslint-disable-line no-unused-vars
      moveDeclarationToFile, // eslint-disable-line no-unused-vars
      moveFile, // eslint-disable-line no-unused-vars
      ...props
    } = this.props

    return (
      <File
        innerRef={innerRef => connectDragSource(findDOMNode(innerRef))}
        onClick={this.onClickHandler}
        {...props}
      />
    )
  }
}

/* connect */
const makeMapStateToProps = () => {
  const getFile = makeGetFile()
  return (state, props) => getFile(state, props)
}

const mapDispatchToProps = { changeFile, moveDeclarationToFile, moveFile }


/* dnd */
// source
const getType = ({ isDirectory }) => (isDirectory ? DIR : FILE)

const sourceSpec = {
  beginDrag(props) {
    const { fileId, isDirectory, declarationIds, name, initial, parentName } = props
    const dropName = (name.includes('index') && !initial) ? parentName : name
    return {
      type: getType(props),
      fileId,
      isDirectory,
      declarationIds,
      dropName,
    }
  },
}

const sourceCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
})

// target
const dropzoneTarget = {
  drop(props, monitor) {
    const { fileId, moveDeclarationToFile, moveFile } = props
    switch (monitor.getItemType()) {
      case DIR:
      case FILE: {
        const { fileId: sourceFileId } = monitor.getItem()
        moveFile({ targetDirectoryId: fileId, sourceFileId })
        break
      }
      case STYLED_COMPONENT: {
        const { declarationId } = monitor.getItem()
        moveDeclarationToFile({ targetDirectoryId: fileId, declarationId })
        break
      }
      // no default
    }
  },

  canDrop(props, monitor) {
    const { fileId, isDirectory, path } = props
    return (
      isDirectory &&
      monitor.isOver({ shallow: true }) &&
      ![fileId, ...path].includes(monitor.getItem().fileId)
    )
  },
}

const targetCollect = connect => ({
  connectDropTarget: connect.dropTarget(),
})

const getTargetTypes = ({ isDirectory }) => isDirectory ?
  [STYLED_COMPONENT, FILE, DIR] : []


/* compose export */
export default compose(
  connect(makeMapStateToProps, mapDispatchToProps),
  DragSource(getType, sourceSpec, sourceCollect),
  DropTarget(getTargetTypes, dropzoneTarget, targetCollect)
)(FileContainer)


/* propTypes */
FileContainer.propTypes = forbidExtraProps({
  // passed by parent / file explorer
  fileId: T.number.isRequired,
  parentName: or([T.string.isRequired, explicitNull()]), // eslint-disable-line
  initial: T.bool,
  path: T.arrayOf(T.number),

  // from makeSelectFile
  name: T.string.isRequired,
  type: T.oneOf(fileTypesArray).isRequired,
  fileChildren: T.arrayOf(T.number).isRequired,
  isDirectory: T.bool.isRequired,
  isCurrent: T.bool.isRequired,
  declarationIds: T.arrayOf(T.number).isRequired,

  // mapDispatchToProps
  changeFile: T.func.isRequired,
  moveDeclarationToFile: T.func.isRequired,
  moveFile: T.func.isRequired,

  // injected by React DnD
  connectDragSource: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  connectDropTarget: T.func.isRequired,
  isDragging: T.bool.isRequired,
})

FileContainer.defaultProps = {
  initial: false,
  path: [],
}
