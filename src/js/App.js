import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const App = () => {
  // Estados para manejar los usuarios y la paginación
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Obtener usuarios de la API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://random-data-api.com/api/v2/users?size=9&page=${page}`);
      if (response.data.length === 0) {
        setHasMore(false);  
      } else {
        setUsers((prevUsers) => [...prevUsers, ...response.data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Cargar los usuarios iniciales
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>Lista de Usuarios</h1>
      <InfiniteScroll
        dataLength={users.length}
        next={fetchUsers}
        hasMore={hasMore}
        loader={<h4>Cargando más usuarios...</h4>}
        endMessage={<p>No hay más usuarios para mostrar.</p>}
      >
        <div className="user-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <img src={`https://robohash.org/${user.id}?size=200x200`} alt={user.first_name} />
              <h3>{user.first_name} {user.last_name}</h3>
              <p>Email: {user.email}</p>
              <p>Teléfono: {user.phone_number}</p>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default App;
