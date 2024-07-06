import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import TodoCreate from "./TodoCreate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from '../../Api/TodoApi.js'
import TodoCompleted from "./TodoCompleted";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function TodoList() {
    const [countData, setCountData] = useState(0)
    const [customError, setCustomError] = useState()
    const queryClient = useQueryClient()
    const { data: todos,
        isFetching,
        isLoading,
        isError,
        error,
        refetch,
        dataUpdatedAt,
    } =
        useQuery({
            queryKey: ['todos'],
            queryFn: API.getAll,
            onError: error => {
                console.log(error)
                setCustomError(error)
            },
            onSuccess: data => {
                const todoCount = data.data.length;
                setCountData(todoCount);
            },

            refetchOnWindowFocus: false,
            //refetchOnMount: false,
            // enabled: false,
            retry: 0,
            cacheTime: 50000,
            staleTime: 10000,
            /*  refetchInterval: 2000,
             refetchIntervalInBackground: true */

            select: (data) => {

                return data.data.map((todo) => {
                    return { ...todo, longId: String(todo.id).padStart(5, '0') }
                })

                /*      return data.data.map((todo) => {
                         return { ...todo, longId: String(todo.id).padStart(4, '0') }
                     }) */
                //  return(data.data.filter((todo) => todo.userId === 2));

            }

        })

    const todoDeleteMutation = useMutation({
        mutationFn: variables => {
            return API.delete(variables.id)
        },
        onSuccess: (data, variables, context) => {
            // queryClient.invalidateQueries(['todos'])
            // queryClient.removeQueries( ['todo', id])
            /**
             * validate cache , fetch dta , not get from server 
             */
            const id = variables.id
            queryClient.setQueriesData(['todos'], (input) => {
                const data = input.data.filter((todo) => todo.id !== id)
                return {...input, data: data}
            })

        }
    })

    const deleteCallback = async (e) => {
        e.preventDefault()
        todoDeleteMutation.mutate({
            id: parseInt(e.currentTarget.dataset.id)
        })
    }


    if (isLoading) return <h6>Loading....</h6>

    if (isError) {
        return <div className="alert alert-danger" role="alert">
            <strong>Error:</strong>: {error.message}
        </div>
    }

    if (customError) {
        return <div className="alert alert-danger" role="alert">
            <strong>Error:</strong>: {customError.message}
        </div>
    }

    return (
        <>
            <TodoCreate />
            last update : {new Date(dataUpdatedAt).toTimeString().substring(0, 8)}
            <br />
            <button disabled={isFetching} className="btn btn-primary" onClick={refetch}>Refetech</button>
            <ReactQueryDevtools />
            <h2 className='text-primary'>Todo List <span>({countData})</span></h2>
            <hr />
            <table className="table table-responsive text-center">
                <thead className="thead-inverse">
                    <tr>
                        <th>#id</th>
                        <th>Title</th>
                        <th>Completed</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos?.slice(0, 3).map((todo) => <tr key={todo.id}>
                        <td>{todo.longId}</td>
                        <td>{todo.title}</td>
                        <td>
                            <TodoCompleted completed={todo.completed} />
                        </td>
                        <td>
                            <Link className={'btn btn-sm mx-1 btn-success rounded-1'}
                                to={`todo/${todo.id}/show`}>Show</Link>
                            <Link className={'btn btn-sm mx-1 btn-primary rounded-1'}
                                to={`todo/${todo.id}/update`}>Update</Link>
                            <button data-id={todo.id} className={'btn btn-sm mx-1 btn-danger rounded-1'}
                                onClick={deleteCallback}
                            >Delete
                            </button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </>
    );
}