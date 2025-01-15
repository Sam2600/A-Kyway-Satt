import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase_prj_url = import.meta.env.VITE_SUPABASE_PRJ_URL;
const supabase_prj_key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabase_prj_url, supabase_prj_key);

export const App = () => {

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    setCountries(data);
  }

  return (
    <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Country Name</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country) => (
              <tr key={country.name}>
                <td>{country.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}