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
  return (
    <>
      {pages > 1 && (
        <Pagination>
          {[...Array(pages).keys()].map((x: number) => (
            <LinkContainer
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : category
                    ? `/category/${category}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/${comesFrom}/${x + 1}`
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
