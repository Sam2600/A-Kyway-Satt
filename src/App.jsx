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
      <button
  class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">
  Button
</button>
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