// client.ts
import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: '421vvnvt',
  dataset: 'production',
  useCdn: true
})