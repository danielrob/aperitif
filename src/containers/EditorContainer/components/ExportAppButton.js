import React from 'react'
import styled from 'styled-components'

const ExportAppButton = styled.button.attrs({
  children: 'Download',
})`
  user-select: none;
  position: absolute;
  top: 20px;
  right: 20px;
`

export default props => props.onClick && <ExportAppButton {...props} />
