import React from 'react'
import { Workspace } from 'components'
import { ToTextContainer } from 'containers'

import download from './download'

export default class WorkspaceContainer extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      width: Math.min(document.body.clientWidth * 0.3, 300),
      export: false,
    }
  }

  toggleExport = () => this.setState({ export: !this.state.export })

  download = fileTree => download(fileTree) && this.toggleExport()

  handleMouseMove = e => {
    const { clientX } = e
    this.setState({
      width: Math.min(Math.max(clientX, 10), document.body.clientWidth * 0.45),
    })
    e.preventDefault()
  }

  handleMouseUp = e => {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    e.preventDefault()
  }

  handleDividerMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
    e.preventDefault()
  }

  render() {
    return [
      <Workspace
        key="workspace"
        {...this.props}
        width={this.state.width}
        handleDividerMouseDown={this.handleDividerMouseDown}
        downloadApp={this.toggleExport}
      />,
      this.state.export && <ToTextContainer key="export" onFinish={this.download} />,
    ]
  }
}
