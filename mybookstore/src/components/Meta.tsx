import React from 'react'
import { Helmet } from 'react-helmet-async'

const Meta = ({title="Welcome to OldBookShop",description, keywords}:any) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description || 'We sell the best products for cheap' } />
        <meta name='keywords' content={keywords || 'new booka, old books, school, colleges'} />
    </Helmet>
  )
}

export default Meta
