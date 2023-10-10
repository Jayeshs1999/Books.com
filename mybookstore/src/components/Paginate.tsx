import React from 'react'
import { Pagination } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Paginate = ({pages,page, isAdmin=false, keyword= ''}:any) => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // for smooth scrolling
    });
  };
  return (
    <>
     {pages > 1 &&  (
       <Pagination>
            {[...Array(pages).keys()].map((x:any)=>(
                <LinkContainer key={x+1}
                to={
                    !isAdmin? keyword ? `/search/${keyword}/page/${x+1}`: `/page/${x+1}`:`/admin/productlist/${x+1}`
                }
                onClick={scrollToTop}
                >
                    <Pagination.Item active={x+1 === page}>
                        {x+1}
                    </Pagination.Item>
                </LinkContainer>
            ))}
       </Pagination> 
     )}  
  </>
  ) 
}

export default Paginate
