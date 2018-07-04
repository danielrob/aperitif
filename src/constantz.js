export const required = 'required'
export const requiredOrNull = 'requiredOrNull'

export const SEMIS = true

/* fileTypes */
export const JS = 'js'
export const DIR = 'dir'

export const fileTypes = { JS, DIR }
export const fileTypesArray = [JS, DIR]

/* expressionTypes */
export const LOOKTHROUGH = "I'm all about my invocation, that's it"
export const STATELESS_FUNCTION_COMPONENT = 'stateless_function_component'
export const STYLED_COMPONENT = 'styled_component'
export const STANDARD = 'standard'

export const expressionTypes = {
  LOOKTHROUGH,
  STATELESS_FUNCTION_COMPONENT,
  STYLED_COMPONENT,
  STANDARD,
}

export const componentExpressionTypes = [
  STATELESS_FUNCTION_COMPONENT,
  STYLED_COMPONENT,
]

/* export types */
export const DEFAULT = 'export default'
export const DEFAULT_INLINE = 'export default <expression>'
export const INLINE = 'export when declared'

export const exportTypes = {
  DEFAULT,
  DEFAULT_INLINE,
  INLINE,
  false: 'no export',
}

/* draggable types */
export const PROP = 'prop'
export const COMPONENT_INVOCATION = 'component invocation'
export const PROPS_SPREAD = '...props'
export const FILE = 'file'

export const DraggableTypes = {
  PROP,
  COMPONENT_INVOCATION,
  PROPS_SPREAD,
  FILE,
  DIR,
}
