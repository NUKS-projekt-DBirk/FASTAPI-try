import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const TodosContext = React.createContext({
  todos: [],
  fetchTodos: () => {},
  addTodo: () => {},
  deleteTodo: () => {},
  editTodo: () => {},
});

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");

  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8000/v2/list");
    const data = await response.json();
    setTodos(data.reverse()); // update todos with the data in reverse order
  };

  const addTodo = async () => {
    await fetch("http://localhost:8000/v2/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: newTodo,
      }),
    });
    setNewTodo("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:8000/v2/delete/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };

  const editTodoFunc = async (id, newTask) => {
    await fetch(`http://localhost:8000/v2/change/${id}?new_task=${encodeURIComponent(newTask)}`, {
      method: "PUT",
    });
    setEditTodoText("");
    setEditTodo(null);
    fetchTodos();
  };
  

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider value={{ todos, fetchTodos, addTodo, deleteTodo, editTodo: editTodoFunc }}>
      <Flex direction="column" align="center">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Todos app made by David Birk
        </Text>
        <InputGroup mb={4} maxW="md">
          <Input
            placeholder="Enter new todo task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button colorScheme="blue" ml={2} onClick={addTodo}>
            Add
          </Button>
        </InputGroup>
        <Stack spacing={5} maxW="md">
          {todos &&
            todos.map((todo) => (
              <Box key={todo.id}>
                {editTodo === todo.id ? (
                  <InputGroup>
                    <Input
                      placeholder="Edit task"
                      value={editTodoText}
                      onChange={(e) => setEditTodoText(e.target.value)}
                    />
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => editTodoFunc(todo.id, editTodoText)}
                      ml={2}
                    >
                      Save
                    </Button>
                    <Button
                      colorScheme="gray"
                      size="sm"
                      onClick={() => {
                        setEditTodoText("");
                        setEditTodo(null);
                        fetchTodos();
                      }}
                      
                    
                    ml={2}
                    >
                    Cancel
                    </Button>
                    </InputGroup>
                    ) : (
                    <Flex justify="space-between" align="center">
                    <Text>{todo.task}</Text>
                    <Flex>
                    <Button size="sm" onClick={() => setEditTodoText(todo.task) || setEditTodo(todo.id)}>
                    Edit
                    </Button>
                    <Button colorScheme="red" size="sm" onClick={() => deleteTodo(todo.id)} ml={2}>
                    Delete
                    </Button>
                    </Flex>
                    </Flex>
                    )}
                    </Box>
                    ))}
                    </Stack>
                    <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Confirm delete</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>Are you sure you want to delete this todo?</ModalBody>
                    <ModalFooter>
                    <Button colorScheme="red" onClick={deleteTodo} mr={3}>
                    Delete
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                    Cancel
                    </Button>
                    </ModalFooter>
                    </ModalContent>
                    </Modal>
                    </Flex>
                    </TodosContext.Provider>
                    );
                    }                    

