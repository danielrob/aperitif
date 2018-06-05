import React from 'react'
import styled from 'styled-as-components'
import { FileExplorerContainer, EditorContainer } from 'containers'

import Divider from './Divider'

const Workspace = props => (
  <React.Fragment>
    <FileExplorerContainer />
    <Divider {...props} />
    <EditorContainer />
  </React.Fragment>
)

export default styled(Workspace).as.div`
  & > div {
    position: absolute;
    bottom: 0;
  }
  & > div:first-child {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: ${props => props.width}px;
    overflow-y: scroll;
  }
  & > div:last-child {
    top: 0;
    left: ${props => props.width}px;
    right: 0;
  }
`
