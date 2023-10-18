import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

interface PaginationProps {
  comesFrom: string;
  page: number;
  pages: number;
  isAdmin?: boolean;
  keyword?: any;
  category?: string;
}

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = "",
  comesFrom,
  category,
}: PaginationProps) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // for smooth scrolling
    });
  };

  const generateTo = (x:any) => {
    if (!isAdmin) {
      if (keyword) {
        return `/search/${keyword}/page/${x + 1}`;
      } else if (category) {
        return `/category/${category}/page/${x + 1}`;
      } else if(comesFrom) {
        return `/${comesFrom}/${x + 1}`;
      } else {
        return `/page/${x + 1}`;
      }
    } else {
      return `/admin/${comesFrom}/${x + 1}`;
    }
  };

  return (
    <>
      {pages > 1 && (
        <Pagination>
          {[...Array(pages).keys()].map((x: number) => (
            <LinkContainer
              key={x + 1}
              to={
                generateTo(x)
              }
              onClick={scrollToTop}
            >
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
