import React from 'react'
import { Semi, Keyword, Input } from 'components'
import { indent } from 'utils'
import { APP_CONTAINER_NAME_ID } from 'duck/tasks/initializeFromData'

export default class ProjectIndexDeclaration extends React.PureComponent {
  render() {
    return (
      <div>
        <Keyword>import</Keyword> React <Keyword>from</Keyword> 'react' <Semi />
        <Keyword>import</Keyword> ReactDOM <Keyword>from</Keyword> 'react-dom' <Semi />
        <Keyword>import</Keyword>{' { '}<Input nameId={APP_CONTAINER_NAME_ID} /> {' } '}
        <Keyword>from</Keyword>{' '}'containers' <Semi />
        <br />
        ReactDOM.render(<br />
        <Keyword>{indent(1)}{'<'}<Input nameId={APP_CONTAINER_NAME_ID} />{'/>'}</Keyword>,<br />
        {indent(1)}document.getElementById('root')<br />
        )
        <Semi />
      </div>
    )
  }
}
