import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useEffect, useState } from 'react';

export const Trading = () => {
  const [journals, setJournals] = useState([]);

  const { getToken } = useKindeAuth();

  const fetchBooks = async () => {
    try {
      const accessToken = await getToken();
      const res = await fetch('http://localhost:8080/api', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      setJournals(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  console.log('journals', journals);

  return (
    <>
      <div>Trading Journal Main Page</div>
      <ul>
        {journals?.map((journal: any) => (
          <li key={journal.name}>
            {journal.name} {journal.description}
          </li>
        ))}
      </ul>
    </>
  );
};
