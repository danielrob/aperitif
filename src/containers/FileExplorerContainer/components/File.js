import T from 'prop-types'
import { forbidExtraProps, or, explicitNull } from 'airbnb-prop-types'
import React from 'react'
import styled from 'styled-as-components'

import { fileTypes, fileTypesArray } from 'constantz'

import { FileContainer } from '../containers'

class File extends React.Component {
  render() {
    const {
      name,
      parentName,
      type,
      fileChildren,
      isDragging,
      connectDragPreview,
      connectDropTarget,
      path,
    } = this.props
    const displayName = (name.includes('index') && isDragging && parentName) || name

    return connectDropTarget(
      <div>
        {connectDragPreview(<span>{displayName}</span>, { captureDraggingState: true })}
        {type && type !== fileTypes.DIR && `.${type}`}
        {fileChildren.map(fileId => (
          <FileContainer
            key={fileId}
            fileId={fileId}
            parentName={name}
            path={[...path, fileId]}
          />
        ))}
      </div>
    )
  }
}


File.propTypes = forbidExtraProps({
  // passed by parent / file explorer
  name: T.string.isRequired,
  type: T.oneOf(fileTypesArray).isRequired,
  // eslint-disable-next-line react/require-default-props
  parentName: or([T.string.isRequired, explicitNull()]),
  fileChildren: T.arrayOf(T.number).isRequired,
  path: T.arrayOf(T.number).isRequired,

  // Injected by React DnD:
  connectDragPreview: T.func.isRequired,
  connectDropTarget: T.func.isRequired,
  isDragging: T.bool.isRequired,

  // for wrapper
  innerRef: T.func.isRequired,
  onClick: T.func.isRequired,
  isDirectory: T.bool.isRequired,
})


export default styled(File).as.div`
  cursor: pointer;
  ${props => props.parentName && 'margin-left: 10px;'}
  ${props => props.isDirectory && 'padding: 5px 0;'}
`
