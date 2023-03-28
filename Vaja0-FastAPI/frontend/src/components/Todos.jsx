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
});

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8000/v2/list");
    const data = await response.json();
    setTodos(data); // update todos with the data
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <TodosContext.Provider value={{ todos, fetchTodos }}>
      <Stack spacing={5}>
        {todos &&
          todos.map((todo) => (
            <Box key={todo.id}>
              <b>{todo.task}</b>
            </Box>
          ))}
      </Stack>
    </TodosContext.Provider>
  );
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

