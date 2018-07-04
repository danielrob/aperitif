import React from 'react'
import { Workspace } from 'components'

export default class WorkspaceContainer extends React.Component {
  constructor() {
    super()
    this.state = {
      width: Math.min(document.body.clientWidth * 0.3, 300),
    }
  }

  handleMouseMove = ({ clientX }) => {
    this.setState({
      width: Math.min(Math.max(clientX, 10), document.body.clientWidth * 0.45),
    })
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleDividerMouseDown = () => {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    return (
      <Workspace
        {...this.props}
        width={this.state.width}
        handleDividerMouseDown={this.handleDividerMouseDown}
      />
    )
  }
}
