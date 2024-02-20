import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import styled from 'styled-components';
import ShadowedNavbar from './Navabar';

const Container = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUserData();
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return; // Handle not logged in

      const response = await axios.get('http://localhost:5000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/data?page=${currentPage}&searchTerm=${searchTerm}`);
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <ShadowedNavbar />
      <Container>
        <Heading>Dashboard</Heading>
        {user && (
          <p>
            Welcome, {user.name} ({user.email})
          </p>
        )}
        <SearchInput type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />
        <List>
          {data.map((item) => (
            <ListItem key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </ListItem>
          ))}
        </List>
        <PaginationContainer>
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={data.length}
            onPageChange={handlePageChange}
          />
        </PaginationContainer>
      </Container>
    </>
  );
};

export default Dashboard;
