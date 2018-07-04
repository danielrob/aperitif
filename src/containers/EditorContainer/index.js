import React from 'react'
import { connect } from 'react-redux'
import { DropTarget } from 'react-dnd'
import { createStructuredSelector } from 'reselect'

import { compose } from 'utils'
import {
  getCurrentFileImports,
  getCurrentFileDefaultExport,
  selectCurrentFileId,
  selectDeclarations,
} from 'selectors'
import { FILE, STYLED_COMPONENT } from 'constantz'
import { mergeFile } from 'duck'

import { Editor } from './components'
import { selectCurrentFileDeclarations } from './selectors'

const EditorContainer =

class EditorContainer extends React.Component {

  render() {
    const {
      connectEditorTarget,
      isOverPassiveEditorArea, // ignore-line no-unused
      currentFileId, // ignore-line no-unused
      projectDeclarations, // ignore-line no-unused
      ...props
    } = this.props
    return connectEditorTarget(
      <div style={{ overflow: 'scroll', paddingBottom: '200px' }}>
        <Editor {...props} />
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  // to inject
  imports: getCurrentFileImports,
  declarations: selectCurrentFileDeclarations,
  defaultExport: getCurrentFileDefaultExport,
  // to use in drop logic
  currentFileId: selectCurrentFileId,
  projectDeclarations: selectDeclarations,
})

const mapDispatchToProps = { mergeFile }

// whole editor area target
const editorTarget = {
  canDrop(props, monitor) {
    const { projectDeclarations, imports } = props
    const { declarationIds } = monitor.getItem()

    const styledComponentId = declarationIds
      .find(id => projectDeclarations[id].type === STYLED_COMPONENT)

    const isInSameComponentBundle = imports
      .find(({ declarationId }) => declarationId === styledComponentId)

    return monitor.isOver({ shallow: true }) &&
      styledComponentId &&
      isInSameComponentBundle
  },

  drop(props, monitor) {
    const { mergeFile, currentFileId } = props
    const { fileId } = monitor.getItem()

    mergeFile({
      sourceFileId: fileId,
      targetFileId: currentFileId,
    })
  },
}

const editorCollect = (connect, monitor) => ({
  connectEditorTarget: connect.dropTarget(),
  isOverPassiveEditorArea: monitor.isOver({ shallow: true }),
  isOverEditor: monitor.isOver(),
  dragItem: monitor.getItem(),
})

// active editor area target
const activeEditorAreaCollect = (connect) => ({
  connectActiveEditorAreaTarget: connect.dropTarget(),
})

const dropTypes = [FILE]

/* compose export */
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  DropTarget(dropTypes, editorTarget, editorCollect),
  DropTarget(dropTypes, {}, activeEditorAreaCollect),
)(EditorContainer)
