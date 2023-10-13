import React from 'react'
import { useGetOrdersQuery } from '../../slices/orderApiSlice'
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Button, Table } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import Paginate from '../../components/Paginate';
import { useParams } from 'react-router';

const OrderListScreen = () => {
  const  {pageNumber} = useParams();
  const {data:orders ,refetch, isLoading, error,isFetching} = useGetOrdersQuery(pageNumber);


  return (
    <>
    <h1>Orders</h1>
    {isLoading || isFetching ? <Loader/> : error? <Message /> : (
      <>
      <Table striped hover responsive
      className='table-sm'
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.orders.map((order:any)=> (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user && order.user.name}</td>
              <td>{order.createdAt.substring(0,10)}</td>
              <td>{order.totalPrice}</td>
              <td>{order.isPaid? (
                order.paidAt.substring(0,10)
              ): (
                <FaTimes style={{color:'red'}} />
              )}</td>
               <td>{order.isDelivered? (
                order.deliveredAt.substring(0,10)
              ): (
                <FaTimes style={{color:'red'}} />
              )}</td>
              <td>
                <LinkContainer to={`/order/${order._id}`} >
                  <Button variant='light' className='btn-sm'>
                    Details
                  </Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
       <Paginate page={orders.page} pages={orders.pages} isAdmin={true} comesFrom="orderlist" />
       </>
    )}
    </>
  )
}

export default OrderListScreen
