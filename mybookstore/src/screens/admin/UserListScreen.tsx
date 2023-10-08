import React from 'react'
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Button, Table } from 'react-bootstrap';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {

  const {data:users , refetch, isLoading, error} = useGetUsersQuery('');
  const [deleteUser , {isLoading: loadingDelete}] = useDeleteUserMutation();

  const deleteHandler =  async(id:any) => {
    if(window.confirm("Are you sure?")){
        try {
            await deleteUser(id);
            toast.success("User Deleted Successfully")
            refetch();
        }catch(err) {
            toast.error("Errror in userlist scrren")
        }
    }
  }

  return (
    <>
    <h1>Users</h1>
    {loadingDelete && <Loader />}
    {isLoading ? <Loader/> : error? <Message /> : (
      <Table striped hover responsive
      className='table-sm'
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user:any)=> (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
              <td>{user.isAdmin? (
                 <FaCheck style={{color:'green'}} />
              ): (
                <FaTimes style={{color:'red'}} />
              )}</td>
              <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`} >
                  <Button variant='light' className='btn-sm'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
                <Button variant='danger' style={{color:'white'}} className='btn-sm'
                onClick={() => deleteHandler(user._id)}
                >
                    <FaTrash />
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>


      </Table>

    )}
    </>
  )
}

export default UserListScreen
