import { useEffect, useState } from "react";
import axios from "axios";
import IncidentsTable from "../components/incidents/IncidentsTable";
import Topbar from '@/components/Topbar';

import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie || '';
  const { token } = parse(cookies);

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get("/api/incidents");
        setIncidents(response.data);
      } catch (error) {
        console.error("Failed to fetch incidents", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <>
      <Topbar />
      <div className="w-full p-4 m-auto mt-18 lg:w-3/4">
        <h1 className="text-xl font-bold mb-6">Incidents</h1>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <IncidentsTable incidents={incidents} />
        )}
      </div>
    </>
  );
}