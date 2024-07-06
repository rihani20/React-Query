import { Link, useParams } from "react-router-dom";
import TodoCompleted from "./TodoCompleted.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../../Api/TodoApi.js";

function TodoShow() {
    const { id } = useParams()
    const queryClient = useQueryClient()

    const { data: todo,
        isLoading,
        isError,
        error } = useQuery({
            queryKey: ['todo', parseInt(id)],
            queryFn: () => API.get(id),
            staleTime: 50000,
            initialData: () => {
                const todoData = (queryClient.getQueryData('todos')?.data)
                return todoData?.find((todoItem) => todoItem.id === parseInt(id))
            }
        })

    if (isLoading) return <h6>Loading....</h6>
    
    if (isError) {
        return <div className="alert alert-danger" role="alert">
            <strong>Error:</strong>: {error.message}
        </div>
    }


    return (
        <>
            <Link to={'/'} className={'btn btn-primary'}>Back</Link>
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">{todo?.id} - {todo?.title}</h4>
                    <h4 className="card-title"><TodoCompleted completed={todo?.completed} /></h4>
                </div>
            </div>
            Details
            <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem ducimus illum maiores vero. Ratione distinctio sint obcaecati animi quidem cumque aspernatur ipsa corrupti natus, atque, enim pariatur fugiat quae voluptatem....
            </p>
        </>
    );
}

export default TodoShow;