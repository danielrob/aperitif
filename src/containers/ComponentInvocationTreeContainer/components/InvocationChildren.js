import React from 'react'

import { ComponentInvocationTreeContainer } from 'containers'

import { CIDropzonesContainer } from '../containers'

const InvocationChildren = ({ id, invocationIds, depth, createComponentBundle, ...props }) =>
  invocationIds.reduce(
    (out, invocationId) => {
      out.push(
        <ComponentInvocationTreeContainer
          key={invocationId}
          invocationId={invocationId}
          depth={depth + 1}
        />
      )
      // This will probably be replaced by draggable reordering.
      // out.push(
      //   <CIDropzonesContainer
      //     key={`invocation-${invocationId}-drop`}
      //     onClickAction={createComponentBundle}
      //     onDropAction={() => undefined}
      //     parentId={id}
      //     position={i + 1}
      //     {...props}
      //   />
      // )
      return out
    },
    [
      // the starting dropzone
      <CIDropzonesContainer
        key="first"
        onClickAction={createComponentBundle}
        onDropAction={() => undefined}
        parentId={id}
        position={0}
        depth={depth + 1}
        {...props}
      />,
    ]
  )

export default InvocationChildren
