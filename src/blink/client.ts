import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'controle-financas-pessoais-brasil-uu9r1ov2',
  authRequired: true
})

export { createClient }
export default blink