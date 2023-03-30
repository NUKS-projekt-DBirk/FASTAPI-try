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
});

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTodo, setNewTodo] = useState("");

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

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider value={{ todos, fetchTodos, addTodo, deleteTodo }}>
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
                <b>{todo.task}</b>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  ml={2}
                >
                  Delete
                </Button>
              </Box>
            ))}
        </Stack>
      </Flex>
    </TodosContext.Provider>
  );
}
