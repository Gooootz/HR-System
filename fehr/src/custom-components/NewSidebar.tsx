import {
  BoxIcon,
  Clock3Icon,
  HomeIcon,
  LucideCalendarClock,
  LucideCalendarDays,
  UserPlusIcon,
  Users,
  UserSearchIcon,
  ClipboardList,
  LucideCalendar,
  MegaphoneIcon,
  // CalendarDays,
  BarChart,
  CalendarCheck,
  CircleDollarSign,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  //   SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  //   SidebarSeparator,
} from "@/components/ui/sidebar";
import React, { useState } from "react";

export const NewSideBar = () => {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const sidebarItems = [
    {
      title: "Admin Panel",
      collection: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: HomeIcon,
        },
        {
          title: "Employee",
          icon: Users,
          children: [
            {
              title: "Employee Management",
              url: "/admin/employee-management",
              icon: Users,
            },
            {
              title: "Employee Onboarding",
              url: "/admin/onboarding",
              icon: UserPlusIcon,
            },
            {
              title: "Applicant Tracking",
              url: "/admin/applicant-tracking",
              icon: UserSearchIcon,
            },
            {
              title: "Job Posting",
              url: "/admin/job-posting",
              icon: MegaphoneIcon,
            },
          ],
        },
        {
          title: "Attendance",
          icon: Clock3Icon,
          children: [
            {
              title: "Attendance Monitoring",
              url: "/admin/attendance-monitoring",
              icon: Clock3Icon,
            },
            {
              title: "Daily Time Records",
              url: "/admin/daily-time-records",
              icon: LucideCalendarClock,
            },
            {
              title: "DTR Management",
              url: "/admin/dtr-management",
              icon: ClipboardList,
            },
          ],
        },
        {
          title: "Calendar",
          icon: LucideCalendar,
          children: [
            {
              title: "School Calendar",
              url: "/admin/school-calendar",
              icon: LucideCalendar,
            },
            {
              title: "Leave Management",
              url: "/admin/leave-management",
              icon: LucideCalendarDays,
            },
          ],
        },
        {
          title: "Payroll",
          icon: CircleDollarSign,
          children: [
            {
              title: "Payroll Calendar",
              url: "/admin/payroll-calendar",
              icon: CalendarCheck,
            },
            {
              title: "Payroll",
              url: "/admin/payroll",
              icon: CircleDollarSign,
            },
            {
              title: "Matrix",
              url: "/admin/matrix",
              icon: BarChart,
            },
          ],
        },
      ],
    },
  ];

  const renderMenuItem = (item: any) => {
    if (item.children) {
      return (
        <div key={item.title}>
          <SidebarMenuItem className="mt-1">
            <button
              onClick={() => toggleMenu(item.title)}
              className={`flex items-center justify-between w-full space-x-2 rounded-md transition text-gray-300 hover:bg-green-700 hover:text-white p-2`}
            >
              <div className="flex items-center space-x-2">
                {React.createElement(item.icon as React.ElementType)}
                <span>{item.title}</span>
              </div>
              {expandedMenus[item.title] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </SidebarMenuItem>
          {expandedMenus[item.title] && (
            <div className="ml-6 mt-1">
              {item.children.map((child: any) => (
                <SidebarMenuItem key={child.title} className="mt-1">
                  <NavLink
                    to={child.url}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 rounded-md transition p-2 ${isActive
                        ? "bg-green-700 text-white"
                        : "text-gray-300 hover:bg-green-700 hover:text-white"
                      }`
                    }
                  >
                    <SidebarMenuButton>
                      {React.createElement(child.icon as React.ElementType)}
                      <span>{child.title}</span>
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <SidebarMenuItem key={item.title} className="mt-1">
        <NavLink
          to={item.url}
          className={({ isActive }) =>
            `flex items-center space-x-2 rounded-md transition p-2 ${isActive
              ? "bg-green-700 text-white"
              : "text-gray-300 hover:bg-green-700 hover:text-white"
            }`
          }
        >
          <SidebarMenuButton>
            {React.createElement(item.icon as React.ElementType)}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </NavLink>
      </SidebarMenuItem>
    );
  };

  return (
    <>
      <Sidebar collapsible="icon">
        {/* {isSudo} */}
        <SidebarContent className="z-[20000]">
          <SidebarGroup className="pb-2">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="list-none">
                  <SidebarMenuButton>
                    <BoxIcon className="text-white" />
                    <span className="text-sm text-white uppercase">
                      Aldersgate College Inc.
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* <Separator /> */}
          {sidebarItems.map((item) => (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel className="text-gray-300">
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.collection.map(renderMenuItem)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </>
  );
};
