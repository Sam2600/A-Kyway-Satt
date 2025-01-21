import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
import {supabase} from "../../database/SupabaseClient"
import { set } from "react-hook-form";

const TABS = [
  {
    label: "Done",
    value: 1,
  },
  {
    label: "UnPaid",
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

const TABLE_HEAD= ["No", "Owner", "Taker", "Item", "Amount", "Status", "Action"]; 

export const DebtList = () => {

  const [me, setMe] = useState("");
  const [current, setCurrent] = useState(1);
  const [debtList, setDebtList] = useState([]);
  const [filteredDebtList, setFilteredDebtList] = useState([]);

  const getDebtList = async () => {

    /**
     * @description get a user id first
     */
    const { id } = await supabase.auth
      .getSession()
      .then((resp) => resp?.data)
      .then((data) => data?.session)
      .then((session) => session?.user);
    
    /**
     * @description then get a query where with user id
     */
    const { data } = await supabase.from("debts").select(`
      id,
      from:pay_from_user_id(id, name),
      to:pay_to_user_id(id, name),
      item:item_id(name),
      amount,
      status
    `).or(`pay_to_user_id.eq.${id}, pay_from_user_id.eq.${id}`);

      setMe(id);
      setDebtList(data);
      setFilteredDebtList(data);
  };

  const handleFilterDebt = (value, me) => {
    setCurrent(value);
    switch (value) {
      case 2:
        setFilteredDebtList(debtList.filter((debt) => debt?.to?.id == me));
        break;
      case 3:
        setFilteredDebtList(debtList.filter((debt) => debt?.to?.id != me));
        break;
      default:
        setFilteredDebtList(debtList);
        break;
    }
  }

  const handleFilterDebtWithStatus = (value) => {
    /**@todo later */
  }

  useEffect(() => {
    /**
     * @date 2025/01/17
     * @desctiption This is temporary code to reduce db fetching
     */
    if (!debtList.length) {
      getDebtList();
    }
  }, []);

  return (
    <Card className="h-full w-full border border-gray-400 rounded-lg">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
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
          <div className="flex gap-4 w-full md:w-4/6">
            <Tabs value={1} className="w-full -z-0 md:w-2/6">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab disabled onClick={() => handleFilterDebtWithStatus(value)} key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <Tabs value={current} className="w-full -z-0 md:w-3/6">
              <TabsHeader>
                {DEBT_TABS.map(({ label, value }) => (
                  <Tab onClick={() => handleFilterDebt(value, me)} key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
          </div>
          <div className="w-full md:w-72">
            <Input
              label="Search"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
        </div>
      </CardHeader>

      <CardBody className="px-0"> {/* overflow-scroll */}
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDebtList?.map((debt, index) => {
              const isLast = index === filteredDebtList.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

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
                        {debt?.item?.name}
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
                  <td className={classes}>
                    <Tooltip content="Edit User">
                      <IconButton variant="text">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            },
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
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
    </Card>
  );
}