import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ManageMostWanted = () => {
  const [list, setList] = useState([]);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, 'mostWanted'));
    setList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'mostWanted', id));
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2>Manage Most Wanted</h2>
      <ul>
        {list.map((person) => (
          <li key={person.id}>
            <h3>{person.name}</h3>
            <button onClick={() => handleDelete(person.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageMostWanted;
