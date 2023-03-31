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
  const [deletedTodos, setDeletedTodos] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newTodo, setNewTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [editTodoText, setEditTodoText] = useState("");

  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8000/v2/list");
    const data = await response.json();
    setTodos(data.reverse()); // update todos with the data in reverse order
  };

  const fetchDeletedTodos = async () => {
    const response = await fetch("http://localhost:8000/v2/list-deleted");
    const data = await response.json();
    setDeletedTodos(data.reverse()); // update deletedTodos with the data in reverse order
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
    fetchDeletedTodos();
  };

  const editTodoFunc = async (id, newTask) => {
    await fetch(`http://localhost:8000/v2/change/${id}?new_task=${encodeURIComponent(newTask)}`, {
      method: "PUT",
    });
    setEditTodoText("");
    setEditTodo(null);
    fetchTodos();
  };

  const sendEmail = async () => {
    const email = prompt("Enter your email address:");
    if (email) {
      await fetch(`http://localhost:8000/v2/send-email?to_email=${encodeURIComponent(email)}`, {
        method: "POST",
      });
      alert(`TODO list sent to ${email}`);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchDeletedTodos();
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        deletedTodos,
        fetchTodos,
        addTodo,
        deleteTodo,
        editTodo: editTodoFunc,
      }}
    >
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
          <Button onClick={addTodo} colorScheme="blue" ml={2}>
            Add Todo
          </Button>
        </InputGroup>
        <Stack spacing={4} maxW="md">
          {todos.map((todo) => (
            <Box
              key={todo.id}
              bg="gray.100"
              p={4}
              borderRadius="md"
              boxShadow="md"
            >
              <Flex justifyContent="space-between" alignItems="center">
                {editTodo === todo.id ? (
                  <>
                    <Input
                      value={editTodoText}
                      onChange={(e) => setEditTodoText(e.target.value)}
                    />
                    <Button
                      onClick={() => editTodoFunc(todo.id, editTodoText)}
                      colorScheme="green"
                      ml={2}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Text textDecoration={todo.completed ? "line-through" : ""}>
                      {todo.task}
                    </Text>
                    <Flex>
                      <Button
                        onClick={() => {
                          setEditTodoText(todo.task);
                          setEditTodo(todo.id);
                        }}
                        colorScheme="yellow"
                        mr={2}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => deleteTodo(todo.id)}
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                    </Flex>
                  </>
                )}
              </Flex>
            </Box>
          ))}
        </Stack>
        <Button onClick={sendEmail} colorScheme="green" mt={4}>
          Email My Todo List
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Deleted Todos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={2}>
                {deletedTodos.map((todo) => (
                  <Text key={todo.id}>{todo.task}</Text>
                ))}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Button onClick={onOpen} colorScheme="orange" mt={4}>
          View Deleted Todos
        </Button>
      </Flex>
    </TodosContext.Provider>
  );}