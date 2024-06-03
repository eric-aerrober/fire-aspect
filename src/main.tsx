import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css'
import 'react-tooltip/dist/react-tooltip.css'
import { HomePage } from './pages/home';
import { IconSideBar } from './components/sidebar/IconSidebar';
import { SettingsPage } from './pages/settings/settings-page';
import { DataBasePage } from './pages/database/database-page';
import { buildDatabaseTableRouter } from './pages/database/routing';
import Home from 'remixicon-react/Home2LineIcon'
import Database from 'remixicon-react/Database2LineIcon'
import Graph from 'remixicon-react/FlowChartIcon'
import Settings from 'remixicon-react/Settings3LineIcon'
import Link from 'remixicon-react/LinksLineIcon'
import Tool from 'remixicon-react/ToolsLineIcon'
import Chat from 'remixicon-react/Chat1LineIcon'
import ListCheck from 'remixicon-react/ListCheck2Icon'
import { IntegrationsPage } from './pages/model-integrations/integrations-page';
import { IntegrationsAddPage } from './pages/model-integrations/integrations-add-page';
import { ChatsPage } from './pages/chat/chat-page';
import { ChatRenderedPage } from './pages/chat/chat-rendered-page';
import { ExecutionLogPage } from './pages/execution-log/execution-log-page';
import { ExecutionLogRendered } from './pages/execution-log/execution-log-rendered';
import { ToolsPage } from './pages/tools/tools-page';
import { ToolsAddPage } from './pages/tools/tools-new';
import { AgentIcon } from './components/logos/robot';
import { AgentsPage } from './pages/agents/agents-page';
import { AgentsConfigurePage } from './pages/agents/agents-configure';
import { CreateNewChatPage } from './pages/chat/chat-create-new-chat-page';
import { CreateNewAgentChatPage } from './pages/chat/chat-create-new-agent-page';
import { PopulateDatabase } from './database/populate';

const topLevelSidebar = <IconSideBar options={[
  {
    icon: Home, 
    tooltip: "Home",
    path: "/home"
  },
  {
    icon: Link, 
    tooltip: "Integrated Models",
    path: "/integrations"
  },
  {
    icon: Tool, 
    tooltip: "Defined Tools",
    path: "/tools"
  },
  {
    icon: AgentIcon, 
    tooltip: "Defined Agents",
    path: "/agents"
  },
  {
    icon: Chat, 
    tooltip: "Conversations",
    path: "/conversations"
  },
  {
    icon: ListCheck, 
    tooltip: "Execution Log",
    path: "/execution-log"
  },
  {
    icon: Database, 
    tooltip: "Local Database",
    path: "/database"
  },
  {
    icon: Settings, 
    tooltip: "Settings",
    path: "/settings"
  }
]}/>

const router = createBrowserRouter([
  {
    path: "/", 
    element: topLevelSidebar,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/database", element: <DataBasePage />, children: buildDatabaseTableRouter() },
      { 
        path: "/conversations", 
        element: <ChatsPage />,
        children: [
          { path: "/conversations/:id", element: <ChatRenderedPage /> },
          { path: "/conversations/new-chat", element: <CreateNewChatPage /> },
          { path: "/conversations/new-agent", element: <CreateNewAgentChatPage /> }
        ]
      },
      { 
        path: "/execution-log", 
        element: <ExecutionLogPage />,
        children: [
          { path: "/execution-log/:id", element: <ExecutionLogRendered /> }
        ]
      },
      { path: "/agents", element: <AgentsPage /> },
      { path: "/agents/:id", element: <AgentsConfigurePage /> },
      { path: "/tools", element: <ToolsPage /> },
      { path: "/tools/new/:id", element: <ToolsAddPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/integrations", element: <IntegrationsPage /> },
      { path: "/integrations/add/:id", element: <IntegrationsAddPage /> },
    ]
  },
  {
    path: "*",
    element: <Navigate to="/home" />
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

PopulateDatabase()

postMessage({ payload: 'removeLoading' }, '*')
  