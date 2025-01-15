import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";

const supabase_prj_url = import.meta.env.VITE_SUPABASE_PRJ_URL;
const supabase_prj_key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabase_prj_url, supabase_prj_key);

export const App = () => {
  const [search, setSearch] = useState("");
  const [debtList, setDebtList] = useState([]);

  const getCountries = async () => {
    const { data } = await supabase.from("debts").select(`
      id,
      from:pay_from_user_id(name),
      to:pay_to_user_id(name),
      item:item_id(name),
      amount,
      status
    `);
    setDebtList(data);
  };

  useEffect(() => {
    getCountries();
  }, [search]);

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="overflow-x-auto lg:w-8/12">
        <table className="table table-zebra border border-black shadow-lg">
          <thead>
            <tr className="text-lg">
              <th>No</th>
              <th>Owner</th>
              <th>Taker</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {debtList?.map((debt, index) => (
              <tr key={debt.id}>
                <td>{index + 1}</td>
                <td>{debt.from?.name}</td>
                <td>{debt.to?.name}</td>
                <td>{debt.item?.name}</td>
                <td>{debt.amount}</td>
                <td>
                  {debt.status ? (
                    <CheckCircleIcon className="mx-1 h-6 w-6 text-green-400" />
                  ) : (
                    <XCircleIcon className="mx-1 h-6 w-6 text-red-400 " />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
