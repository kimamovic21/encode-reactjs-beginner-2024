import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import ToDoItem from "./ToDoItem.jsx";

const ToDo = () => {
    const [text, setText] = useState("");
    const [todoList, setTodoList] = useState([]);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const TODO_STORAGE_KEY = 'toDoList';

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const addOrEditItem = () => {
        let newItem;
        if (isEditMode) {
            newItem = {
                ...itemToEdit,
                text
            }

            const itemToEditIndex = todoList.findIndex((item) => item.id === newItem.id);
            const todoListCopy = [...todoList];

            todoListCopy[itemToEditIndex] = newItem;

            localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todoListCopy));
            setTodoList(todoListCopy);
            setIsEditMode(false);
            setItemToEdit(null);
        } else {
            newItem = {
                id: uuidv4(),
                text, // ILI text: text
                isCompleted: false
            };
            // IMMEDIATE RETURN
            // setTodoList((prevState) => [...prevState, newItem])
            setTodoList((prevState) => {
                localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify([...prevState, newItem]));
                return [...prevState, newItem];
            });
        }

        setText("");
    };

    const handleCheckToDoItem = (itemId) => {
        const itemToCheckIndex = todoList.findIndex((item) => item.id === itemId);
        const todoListCopy = [...todoList];

        todoListCopy[itemToCheckIndex].isCompleted = true;

        localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todoListCopy));
        setTodoList(todoListCopy);
    };

    useEffect(() => {
        const toDos = localStorage.getItem(TODO_STORAGE_KEY);
        // null => falsy, [] => truthy
        if (toDos) {
            setTodoList(JSON.parse(toDos));
        }
    }, []);

    const onEdit = (item) => {
        setText(item.text);
        setItemToEdit(item);
        setIsEditMode(true);
    }

    const onDelete = (item) => {
        const todoListCopy = [...todoList];

        const itemToDeleteIndex = todoListCopy.findIndex((todo) => todo.id === item.id);

        todoListCopy.splice(itemToDeleteIndex, 1);

        localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todoListCopy));
        setTodoList(todoListCopy);

    }

    return (
        <div>
            <h2>TODO APP</h2>
            <div className="input-wrapper">
                <input type="text" className="input" onChange={(event) => handleChange(event)} value={text} />
                <button className="add-button" onClick={addOrEditItem} disabled={!text}>{isEditMode ? 'Update' : '+ Add'}</button>
            </div>
            <div>
                {todoList.map((todoItem) =>
                    <ToDoItem
                        todoItem={todoItem}
                        handleCheckToDoItem={handleCheckToDoItem}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                )}
            </div>
        </div>
    );
};

export default ToDo;