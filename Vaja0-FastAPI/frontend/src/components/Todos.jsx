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
import moment from "moment";

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
  const [activeTasksCount, setActiveTasksCount] = useState(0);

  const fetchActiveTasksCount = async () => {
    const response = await fetch('http://212.101.137.103/faas');
    const data = await response.text();
    setActiveTasksCount(data);
  };

  useEffect(() => {
    fetchActiveTasksCount();
  }, []);


  const fetchTodos = async () => {
    const response = await fetch("http://212.101.137.103/v2/list");
    const data = await response.json();
    setTodos(data.reverse()); // update todos with the data in reverse order
  };

  const fetchDeletedTodos = async () => {
    const response = await fetch("http://212.101.137.103/v2/list-deleted");
    const data = await response.json();
    setDeletedTodos(data.reverse()); // update deletedTodos with the data in reverse order
  };

  const addTodo = async () => {
    await fetch("http://212.101.137.103/v2/add", {
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
    setActiveTasksCount((prevCount) => parseInt(prevCount, 10) + 1); // Update active tasks count
  };

  const deleteTodo = async (id) => {
    await fetch(`http://212.101.137.103/v2/delete/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
    fetchDeletedTodos();
    setActiveTasksCount((prevCount) => parseInt(prevCount, 10) - 1); // Update active tasks count
  };

  const editTodoFunc = async (id, newTask) => {
    await fetch(`http://212.101.137.103/v2/change/${id}?new_task=${encodeURIComponent(newTask)}`, {
      method: "PUT",
    });
    setEditTodoText("");
    setEditTodo(null);
    fetchTodos();
  };

  const sendEmail = async () => {
    const email = prompt("Enter your email address:");
    if (email) {
      await fetch(`http://212.101.137.103/v2/send-email?to_email=${encodeURIComponent(email)}`, {
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
          To-Do app made by David Birk
        </Text>
        <div>
          <p>Active Tasks Count: {activeTasksCount}</p>
        </div>
        <InputGroup mb={4} maxW="md">
          <Input
            placeholder="Enter new ToDo task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button onClick={addTodo} colorScheme="blue" ml={2}>
            Add ToDo
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
                <Text textDecoration={todo.completed ? "line-through" : ""}>
                  {todo.task}
                </Text>
                <Flex alignItems="center">
                  <Text fontSize="sm" mr={2}>
                    Created:{" "}
                    {moment(todo.created_at).format("MMM DD, YYYY")}
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
                      colorScheme="green"
                    >
                      Done ✔
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          ))}
        </Stack>
        <Button onClick={sendEmail} colorScheme="blue" mt={4}>
          Email My ToDo List
        </Button>
        <Button onClick={onOpen} colorScheme="orange" mt={4}>
          View Done ToDos
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Done ToDos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={2}>
                {deletedTodos.map((todo) => (
                  <Box
                    key={todo.id}
                    bg="gray.100"
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                  >
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text textDecoration="line-through">{todo.task}</Text>
                      <Text fontSize="sm">
                        Deleted:{" "}
                        {moment(todo.deleted_at).format("MMM DD, YYYY")}
                      </Text>
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {editTodo && (
          <Box mt={4}>
            <InputGroup maxW="md">
              <Input
                placeholder="Enter new ToDo task"
                value={editTodoText}
                onChange={(e) => setEditTodoText(e.target.value)}
              />
              <Button onClick={() => editTodoFunc(editTodo, editTodoText)} colorScheme="blue" ml={2}>
                Save
              </Button>
            </InputGroup>
          </Box>
        )}
      </Flex>
    </TodosContext.Provider>
  );}