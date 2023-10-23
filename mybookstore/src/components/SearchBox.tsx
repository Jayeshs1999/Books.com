import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

const SearchBox = () => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const {keyword: urlKeyword} = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = (e:any) => {
        e.preventDefault();
        if(keyword.trim()) {
            setKeyword('')
            navigate(`/search/${keyword}`)
        }else {
            navigate('/')
        }
    }

  return (
   <Form onSubmit={submitHandler} className='d-flex'>
        <Form.Control
        type='text'
        name='q'
        onChange={(e)=>setKeyword(e.target.value)}
        value={keyword}
        placeholder={t('searchBooks')}
        className='mr-sm-2 ml-sm-5'
        >
        </Form.Control>
        <Button 
        type='submit'
        variant='outline-light'
        className='p-2 mx-2'
        >
            {t('search')}
        </Button>
   </Form>
  )
}

export default SearchBox
