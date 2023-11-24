import { useAuthState } from 'lib/authentication';
import { config } from 'lib/config';
import { useEffect, useState } from 'react';

export const Trading = () => {
  const [journals, setJournals] = useState([]);

  const { getToken } = useAuthState();

  const fetchBooks = async () => {
    try {
      const accessToken = await getToken();
      const res = await fetch(`${config.api}/api`, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
