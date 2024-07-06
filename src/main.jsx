import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Components/Layout'
import TodoList from './Components/Todo/TodoList'
import TodoCreate from './Components/Todo/TodoCreate'
import TodoUpdate from './Components/Todo/TodoUpdate';
import TodoShow from './Components/Todo/TodoShow';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<TodoList />} />
          <Route path={'/todo/create'} element={<TodoCreate />} />
          <Route path={'/todo/:id/update'} element={<TodoUpdate />} />
          <Route path={'/todo/:id/show'} element={<TodoShow />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>

)
