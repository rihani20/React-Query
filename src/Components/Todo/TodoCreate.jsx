
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import TodoApi from "../../Api/TodoApi";
import TodoModel from './../../Models/TodoModel';

function TodoCreate() {
    const {
        register, reset, handleSubmit,
        formState: {
            errors,
            isDirty,
            isValid,
        }
    } = useForm()
    const queryClient = useQueryClient()
    const todoCreateMutation = useMutation({
        mutationFn: (todo) => {
            return TodoApi.create(todo)
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries('todos')
        },
        onError: error => {
            console.log(error.message)
        }


    })

    const submitForm = (data) => {
        const todo = new TodoModel(data.title, data.completed)
        todoCreateMutation.mutate(todo)
        reset()
    }

    return (
        <>
            <h2 className='text-primary'>Add Todo</h2>
            <form onSubmit={handleSubmit(submitForm)}>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control"  {...register('title', {
                        required: {
                            value: 'true',
                            message: 'Required field'
                        },
                    })} />
                    <small className="text-danger">{errors.title?.message}</small>
                </div>
                <div className="form-group">
                    <input type="checkbox"
                        className="form-check-input"  {...register('completed')} />
                    <label className='form-check-label'>&nbsp; Completed</label>
                </div>
                <div className="form-group mt-2">
                    <input disabled={!isValid || !isDirty} type="submit" className={'btn btn-primary'}
                        value='Create' />
                </div>
            </form>
        </>
    );
}

export default TodoCreate;