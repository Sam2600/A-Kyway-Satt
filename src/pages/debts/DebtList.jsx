import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../database/SupabaseClient";
import { useDebounce } from "../../hooks/useDebounce";
import { retry } from "@reduxjs/toolkit/query";
import { scrollToTop } from "../../utils/helper_functions/helper";

const PER_PAGE = 10;

const TABS = [
  {
    label: "Done",
    value: 1,
  },
  {
    label: "Not Yet",
    value: 0,
  },
];

const DEBT_TABS = [
  {
    label: "All",
    value: 1,
  },
  {
    label: "Get Debt",
    value: 2,
  },
  {
    label: "Pay Debt",
    value: 3,
  },
];

const TABLE_HEAD = [
  "No",
  "Owner",
  "Taker",
  "Item",
  "Amount",
  "Status",
  "Action",
];

export const DebtList = () => {
  // current UserID
  const [me, setMe] = useState("");

  // debt search keyword
  const [search, setSearch] = useState("");

  // success message
  const [serverMessage, setServerMessage] = useState({
    status: false,
    message: "",
  });

  // (all, get, pay) debt types
  const [debtType, setDebtType] = useState(1);

  // debt list
  const [debtList, setDebtList] = useState([]);

  // debt status paid or didn't pay yet
  const [debtStatus, setDebtStatus] = useState(0);

  // pagination and page ranges
  const [currentPage, setCurrentPage] = useState(1);
  const [range, seRange] = useState({
    from: 0,
    to: PER_PAGE,
  });

  /**
   * @description Get the list of debts based on (debtList, debtType) query states
   */
  const getDebtList = async (search) => {
    /**
     * @description get a user id first
     */
    const { id } = await supabase.auth
      .getSession()
      .then((resp) => resp?.data)
      .then((data) => data?.session)
      .then((session) => session?.user);

    let query = supabase.from("debts").select(
      `
      id,
      from:pay_from_user_id(id, name),
      to:pay_to_user_id(id, name),
      items!inner(
        name
      ),
      amount,
      status
    `
    );

    if (search) {
      query = query.ilike("items.name", `%${search}%`);
    }

    switch (debtType) {
      case 2:
        query = query.eq("pay_to_user_id", me);
        break;

      case 3:
        query = query.eq("pay_from_user_id", me);
        break;

      default:
        query = query.or(`pay_to_user_id.eq.${id}, pay_from_user_id.eq.${id}`);
        break;
    }

    switch (debtStatus) {
      case 1:
        query = query.eq("status", true);
        break;

      default:
        query = query.eq("status", false);
        break;
    }

    const { data } = await query.is("deleted_at", null).range(range?.from, range?.to);

    setMe(id);
    setDebtList(data);
  };

  const handleRemoveDebt = async (id) => {
    
    const { error } = await supabase.from('debts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
    
    if (error) {

      console.error(error);
      setServerMessage({
        status: false,
        message: "Debt remove failed",
      });

      scrollToTop();

    } else {

      setServerMessage({
        status: true,
        message: "Debt removed successfully"
      });

      scrollToTop();
    }
  }

  const handlePagination = (page) => {};

  let _search = useDebounce(search, 400);

  useEffect(() => {
    getDebtList(_search);
  }, [debtType, debtStatus, _search]);

  return (
    <>
      {
        serverMessage?.message && (
          <p className={`text-white text-center w-full sm:w-full md:w-5/12 lg:w-3/12 xl:w-3/12 ${serverMessage?.status ? "bg-green-500" : "bg-red-500"} p-3 mb-9 rounded-md`}>
            {serverMessage?.message}
          </p>
        )
      }
      <Card className="h-full w-full border border-gray-400 rounded-lg">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="flex flex-col md:flex-row md:justify-between mb-8 space-y-6 md:gap-8 md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Debt List
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about debts of me
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <NavLink className="flex items-center gap-2" to={"/add-debt"}>
              <Button size="sm" className="flex justify-between gap-x-2">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Debt
              </Button>
            </NavLink>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex-col space-y-5 gap-4 w-full -z-0 md:w-4/6 lg:w-2/6">
            <Tabs value={debtStatus} className="w-full md:w-4/6 lg:w-4/6 xl:w-3/6">
              <TabsHeader className="bg-gray-300">
                {TABS.map(({ label, value }) => (
                  <Tab
                    onClick={() => setDebtStatus(value)}
                    key={value}
                    value={value}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <Tabs value={debtType} className="w-full md:w-5/6 lg:w-5/6 xl:w-5/6  ">
              <TabsHeader className="bg-gray-300">
                {DEBT_TABS.map(({ label, value }) => (
                  <Tab
                    onClick={() => setDebtType(value)}
                    key={value}
                    value={value}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
          </div>
          <div className="w-full md:w-72">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              label="Search with item names"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>
      {debtList?.length ? (
        <>
          <CardBody className="px-0 overflow-auto p-4">
            {" "}
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head, index) => {

                    // cuz we have an extra column for actions
                    const isLast = index === debtList.length + 2;

                    return (
                        <th
                        key={head}
                        className={`border border-blue-gray-100 bg-blue-gray-50/50 p-4`}
                        >
                          <Typography
                          variant="small"
                          color="blue-gray"
                          className={`font-normal leading-none opacity-70 ${isLast ? "pl-6" : ""}`}
                          >
                            {head}
                          </Typography>
                        </th>
                    )}
                  )}
                </tr>
              </thead>
              <tbody>
                {debtList?.map((debt, index) => {
                  const isLast = index === debtList.length + 1;
                  const classes = isLast
                    ? "p-4 border"
                    : "p-4 border border-blue-gray-50";

                  return (
                    <tr key={debt?.id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {/* <Avatar src={"#"} alt={"#"} size="sm" /> */}
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {index + 1}
                            </Typography>
                            {/* <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            > */}
                            {/* {email} */}
                            {/* </Typography> */}
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {/* <Avatar src={"#"} alt={"#"} size="sm" /> */}
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {debt?.to?.name}
                            </Typography>
                            {/* <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal opacity-70"
                            > */}
                            {/* {email} */}
                            {/* </Typography> */}
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {debt?.from?.name}
                          </Typography>
                          {/* <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          > */}
                          {/* {org} */}
                          {/* </Typography> */}
                        </div>
                      </td>
                      {/* <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={online ? "online" : "offline"}
                            color={online ? "green" : "blue-gray"}
                          />
                        </div>
                      </td> */}
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {debt?.items?.name}
                          </Typography>
                          {/* <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          > */}
                          {/* {org} */}
                          {/* </Typography> */}
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {debt?.amount}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            size="sm"
                            value={debt?.status ? "done" : "Not Yet"}
                            color={debt?.status ? "green" : "red"}
                          />
                        </div>
                      </td>
                      <td className={`${classes}`}>
                        <div className="pl-3 flex justify-start items-center">
                          <Tooltip content="Edit Debt">
                            <IconButton variant="text">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Remove Debt">
                            <IconButton onClick={() => handleRemoveDebt(debt?.id)} variant="text">
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
          {debtList.length > PER_PAGE && (
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal"
              >
                Page 1 of 10
              </Typography>
              <div className="flex gap-2">
                <Button variant="outlined" size="sm">
                  Previous
                </Button>
                <Button variant="outlined" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          )}
        </>
      ) : (
        <p className="text-center inline my-10 font-bold">
          There is no debts. Try again {":("}
        </p>
      )}
    </Card>
    </>
  );
};
