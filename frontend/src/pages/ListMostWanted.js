import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import BackButton from '../components/BackButton';

const ListMostWanted = () => {
  const [list, setList] = useState([]);
   

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'mostWanted'));
      setList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Most Wanted List</h2>
      <ul>
        {list.map((person) => (
          <li key={person.id}>
            <h3>{person.name}</h3>
            <p>Crime: {person.crime}</p>
            <p>Last Seen: {person.lastSeen}</p>
            {person.photoUrl && (
              <img src={person.photoUrl} alt={person.name} width="100" />
            )}
          </li>
        ))}
      </ul>
      <BackButton/>
    </div>
  );
};

export default ListMostWanted;
