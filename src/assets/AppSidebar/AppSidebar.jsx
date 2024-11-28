import React from 'react'
import { ChevronDown, ChevronLeft, Clock, MessageSquarePlus, MoreHorizontal } from 'lucide-react'
// import Image from "next/image"
import './AppSidebar.css'


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    useSidebar
  } from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
  
import { assets } from '../Image/assets'
  

const AppSidebar = () => {

    // const [open, setOpen] = React.useState(false)
    // const { toggleSidebar } = useSidebar()

    const recentTopics = [
        "Dealing with Stress After a Breakup",
        "Feeling Overwhelmed by Family Expectations",
        "Career Change Anxiety",
        "Navigating a Toxic Friendship",
        "Overcoming Negative Self-Talk",
        "How to Stay Motivated",
        "Anxiety Around Public Speaking",
        "Handling Burnout at Work",
        "Dealing with Rejection in Relationships"
      ]


  return (

    <SidebarProvider
        style={{
            "--sidebar-width": "20rem",
            "--sidebar-width-mobile": "20rem",
        }}
        
    >

    <Sidebar>
        
        {/* Bagian Header */}
      <SidebarHeader className="sidebar_header">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <ChevronLeft onClick={toggleSidebar}/> */}
            <SidebarMenuButton size="lg" className="logo">
              <div className="image_logo">
                <img
                  src={assets.logo_icon}
                  alt="Haven logo"
                  width={50}
                  height={50}
                  className="logo_shape"
                />
              </div>
              <span className="logo_name">Haven.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

        {/* Bagian Content */}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="recent">
            <Clock className="clock" />
            <span>Recents</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentTopics.map((topic, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton variant="ghost" className="topics">
                    {topic}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton variant="ghost" className="see_more">
                  See More →
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

        {/* Bagian Footer */}

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant="outline" className="new_chat">
              <MessageSquarePlus className="new_chat_text" />
              New Chat
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton variant="outline" className="more">
                        <MoreHorizontal className="more_text" />
                            More
                            <ChevronDown className="ml-auto"/>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="more_content" side="right" align="start">
                    <DropdownMenuItem>
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Appearance</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Help & Support </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Log Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>


      <SidebarRail />
    </Sidebar>
   </SidebarProvider>

  )
}

export default AppSidebar