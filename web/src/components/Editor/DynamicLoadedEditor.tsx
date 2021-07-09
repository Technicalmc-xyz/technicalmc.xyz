import React from 'react'
import dynamic from 'next/dynamic'
import Loader from '../Loader'

const DynamicLoadedEditor = dynamic(
    import('./ArticleEditor'),
  {
    loading: () => (<Loader/>),
    ssr: false
  }
)

export default DynamicLoadedEditor 