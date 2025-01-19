import {
    Cog6ToothIcon,
    InboxArrowDownIcon,
    PowerIcon,
    UserCircleIcon,
} from "@heroicons/react/24/outline";

export const profileMenuItems = [
    {
        to: "/profile",
        label: "My Profile",
        icon: UserCircleIcon,
    },
    {
        to: "/edit-profile",
        label: "Edit Profile",
        icon: Cog6ToothIcon,
    },
    {
        to: "/inbox",
        label: "Inbox",
        icon: InboxArrowDownIcon,
    },
    {
        label: "Sign Out",
        icon: PowerIcon,
    },
];