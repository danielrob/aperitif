import T from 'prop-types'
import { forbidExtraProps } from 'airbnb-prop-types'
import React from 'react'
import styled from 'styled-as-components'
import theme from 'theme-proxy'
import ReactTooltip from 'react-tooltip'

import {
  StatelessFunctionComponent,
  ClassComponent,
  StyledComponent,
  ProjectIndexDeclaration,
  Standard,
  Json,
  ExportAppButton,
} from 'components'
import {
  STATELESS_FUNCTION_COMPONENT,
  STYLED_COMPONENT,
  CLASS_COMPONENT,
  PROJECT_INDEX,
  JSON_TYPE,
} from 'constantz'

import { Imports, DefaultExport } from './'

/*
  Component
*/
class Editor extends React.PureComponent {
  static templates = {
    [STATELESS_FUNCTION_COMPONENT]: StatelessFunctionComponent,
    [STYLED_COMPONENT]: StyledComponent,
    [CLASS_COMPONENT]: ClassComponent,
    [PROJECT_INDEX]: ProjectIndexDeclaration,
    [JSON_TYPE]: Json,
  }

  componentDidUpdate() {
    if (!this.props.dragItem) {
      ReactTooltip.rebuild()
    }
  }

  render() {
    const { imports, declarations, defaultExport, workspaceActions: wAs } = this.props
    return (
      <React.Fragment>
        <ExportAppButton onClick={wAs.exportToStackBlitz} position={1} text="Export to StackBlitz" />
        <ExportAppButton onClick={wAs.downloadApp} position={2.5} text="Download" />
        <Imports key="imports" imports={imports} />
        {declarations.map(declaration => {
          const { type, declarationId } = declaration
          const Renderer = Editor.templates[type] || Standard
          return (
            <div key={declarationId}>
              <Renderer {...declaration} />
              <br />
            </div>
          )
        })}
        <DefaultExport nameId={defaultExport} />
        <ReactTooltip
          id="prop"
          effect="solid"
          showDelay={150}
          getContent={dataTip => <pre>{dataTip}</pre>}
        />
        <br /* The POSIX standard EOF newline. */ />
      </React.Fragment>
    )
  }
}


/*
  propTypes
*/
Editor.propTypes = forbidExtraProps({
  workspaceActions: T.objectOf(T.func),
  imports: T.arrayOf(T.object).isRequired,
  declarations: T.arrayOf(T.object).isRequired,
  defaultExport: T.number,
  currentFileId: T.number,
  dragItem: T.bool,
})

Editor.defaultProps = {
  defaultExport: null,
  currentFileId: null,
  dragItem: false,
  workspaceActions: {},
}


/*
  style + export
*/
export default styled(Editor).as.div.attrs({
  id: 'editor',
})`
  background-color: ${theme.colors.white};
  padding: 50px 100px;
  color: ${theme.colors.darkblue};
  min-width: 960px;
`
