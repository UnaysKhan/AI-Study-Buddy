import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  useToast,
  Container,
  Divider,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
} from '@chakra-ui/react';
import { FaRobot, FaQuestionCircle } from 'react-icons/fa';
import API_BASE_URL from './config';

/* =========================
   API FUNCTIONS
========================= */
async function sendChatMessage(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: message }),
  });
  return response.json();
}

async function generateQuiz(topic, difficulty) {
  const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty }),
  });
  return response.json();
}

/* =========================
   APP COMPONENT
========================= */
function App() {
  const toast = useToast();

  // Chat states
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Quiz states
  const [quizTopic, setQuizTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [quiz, setQuiz] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // Quiz interaction states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  /* =========================
     CHAT HANDLER
  ========================= */
  const handleAsk = async () => {
    if (!question.trim()) {
      toast({
        title: 'Please enter a question.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoadingChat(true);
      setResponse('Thinking...');
      const data = await sendChatMessage(question);
      setResponse(data.response);
    } catch {
      setResponse('Error fetching response.');
    } finally {
      setLoadingChat(false);
    }
  };

  /* =========================
     QUIZ HANDLERS
  ========================= */
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) {
      toast({
        title: 'Please enter a quiz topic.',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoadingQuiz(true);
      setQuiz([]);
      setSelectedAnswers({});
      setSubmitted(false);
      setScore(0);

      const data = await generateQuiz(quizTopic, difficulty);
      setQuiz(data.quiz || []);
    } catch {
      toast({
        title: 'Error generating quiz.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleOptionSelect = (qIndex, option) => {
    if (submitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  const handleSubmitQuiz = () => {
    let total = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        total++;
      }
    });
    setScore(total);
    setSubmitted(true);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <Box bg="gray.900" color="white" minH="100vh" py={10}>
      <Container maxW="2xl">
        <Tabs variant="enclosed" colorScheme="teal">
          <TabList>
            <Tab>
              <FaRobot style={{ marginRight: '8px' }} /> Chatbot
            </Tab>
            <Tab>
              <FaQuestionCircle style={{ marginRight: '8px' }} /> Quiz Generator
            </Tab>
          </TabList>

          <TabPanels>
            {/* ================= CHATBOT ================= */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Heading size="lg">AI Study Buddy</Heading>

                <Box
                  bg="gray.800"
                  p={5}
                  borderRadius="md"
                  minH="180px"
                  maxH="300px"
                  overflowY="auto"
                >
                  {response ? (
                    <Text whiteSpace="pre-line">{response}</Text>
                  ) : (
                    <Text color="gray.500">Your chat will appear here...</Text>
                  )}
                </Box>

                <Input
                  placeholder="Ask me anything..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                  bg="gray.700"
                />

                <Button
                  colorScheme="teal"
                  onClick={handleAsk}
                  isLoading={loadingChat}
                >
                  Ask AI
                </Button>
              </VStack>
            </TabPanel>

            {/* ================= QUIZ ================= */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Heading size="lg">Quiz Generator</Heading>

                <Input
                  placeholder="Enter topic"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  bg="gray.700"
                />

                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  bg="gray.700"
                  color="black"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>

                <Button
                  colorScheme="yellow"
                  onClick={handleGenerateQuiz}
                  isLoading={loadingQuiz}
                >
                  Generate Quiz
                </Button>

                <Divider />

                {/* SCORE */}
                {submitted && (
                  <Box bg="gray.700" p={3} borderRadius="md">
                    <Text fontSize="lg" fontWeight="bold">
                      Score: {score} / {quiz.length}
                    </Text>
                  </Box>
                )}

                {/* QUESTIONS */}
                {quiz.map((q, index) => (
                  <Box key={index} bg="gray.800" p={4} borderRadius="md">
                    <Text fontWeight="bold" mb={2}>
                      Q{index + 1}: {q.question}
                    </Text>

                    <VStack align="stretch">
                      {q.options.map((opt, i) => {
                        const isSelected = selectedAnswers[index] === opt;
                        const isCorrect = opt === q.answer;

                        let bg = 'gray.700';
                        if (submitted) {
                          if (isCorrect) bg = 'green.500';
                          else if (isSelected) bg = 'red.500';
                        } else if (isSelected) {
                          bg = 'teal.600';
                        }

                        return (
                          <Box
                            key={i}
                            p={2}
                            borderRadius="md"
                            cursor={submitted ? 'not-allowed' : 'pointer'}
                            bg={bg}
                            onClick={() => handleOptionSelect(index, opt)}
                          >
                            {opt}
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                ))}

                {/* SUBMIT BUTTON */}
                {quiz.length > 0 && !submitted && (
                  <Button colorScheme="teal" onClick={handleSubmitQuiz}>
                    Submit Quiz
                  </Button>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default App;
