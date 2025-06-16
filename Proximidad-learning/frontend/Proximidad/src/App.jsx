import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
    const [datos, setdatos] = useState(null);

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/usuario')
        .then(response => setdatos(response.data))
        .catch(error => console.error('Error al obtener los datos'))
    }, []);


  return (
    <>
    <div>
      <h1>Usuarios</h1>
      {datos ? (
        <>
          <h2>usuarios nombres</h2>
          {datos.map(user => 
          <p key={user.id}>{user.nombre_completo} - {user.tipo_usuario}</p>
          )}
        </>
      ): (
        <p>Cargando datos....</p>
      )}
    </div>
    
      
    </>
  )

}

export default App
