import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { PatientSummary } from "../definitions/PatientSummary";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const initialMessages: ChatMessage[] = [
  {
    id: "1",
    content:
      "Hello! I'm your AI medical assistant. I can help you with patient information, clinical guidance, and general medical queries. How can I assist you today?",
    sender: "ai",
    timestamp: new Date(),
  },
];

function patientSummaryToArray(summary: PatientSummary): any[] {
  const arr: any[] = [];
  if (summary.patient) arr.push(summary.patient);
  if (summary.conditions) arr.push(...summary.conditions);
  if (summary.allergies) arr.push(...summary.allergies);
  if (summary.medications) arr.push(...summary.medications);
  // Add other resource types as needed
  return arr;
}

export default function AIChat({
  patientSummary,
}: {
  patientSummary: PatientSummary;
}) {
  console.log("Patient Summary in AIChat:", patientSummary);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const patientData = patientSummaryToArray(patientSummary);
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientData,
          userQuestion: inputValue,
        }),
      });
      const data = await response.json();
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.aiResponse || "No response from AI.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Error contacting AI service.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
    setIsTyping(false);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24, zIndex: 1500 }}>
      {!isOpen && (
        <Tooltip title="Open AI Assistant">
          <IconButton
            color="primary"
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              boxShadow: 3,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onClick={() => setIsOpen(true)}
          >
            <Badge
              color="secondary"
              variant="dot"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <ChatIcon sx={{ fontSize: 32, color: "white" }} />
            </Badge>
          </IconButton>
        </Tooltip>
      )}

      {/* Chat Panel */}
      <Collapse in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            width: 380,
            maxWidth: "95vw",
            height: isMinimized ? 72 : 600,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 3,
            boxShadow: 6,
            animation: "slide-in-bottom 0.3s",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0, // Prevents shrinking
              zIndex: 1, // Ensures it's above scroll area if needed
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32 }}>
                <SmartToyIcon color="primary" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  AI Medical Assistant
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  AI makes mistakes
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Badge
                color="success"
                sx={{ mr: 1 }}
                badgeContent={<FiberManualRecordIcon sx={{ fontSize: 10 }} />}
              ></Badge>
              <IconButton
                size="small"
                onClick={() => setIsMinimized((m) => !m)}
                sx={{ color: "text.secondary" }}
              >
                <MinimizeIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: "text.secondary" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Content */}
          <Collapse in={!isMinimized} sx={{ flex: 1 }}>
            <Box
              ref={scrollRef}
              sx={{
                flex: 1,
                height: "380px", // Ensures flexbox works with overflow
                minHeight: 0,
                maxHeight: 420, // Adjust as needed (600 - header - input)
                overflowY: "auto",
                p: 2,
                bgcolor: "background.default",
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    flexDirection:
                      message.sender === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor:
                        message.sender === "user" ? "primary.main" : "grey.300",
                      width: 32,
                      height: 32,
                    }}
                  >
                    {message.sender === "user" ? (
                      <PersonIcon />
                    ) : (
                      <SmartToyIcon />
                    )}
                  </Avatar>
                  <Box
                    sx={{
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        message.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        fontSize: 15,
                        bgcolor:
                          message.sender === "user"
                            ? "primary.main"
                            : "grey.100",
                        color:
                          message.sender === "user"
                            ? "primary.contrastText"
                            : "text.primary",
                      }}
                    >
                      {message.content}
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {isTyping && (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <Avatar sx={{ bgcolor: "grey.300", width: 32, height: 32 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Box
                    sx={{
                      bgcolor: "grey.100",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontSize: 15,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "grey.400",
                          borderRadius: "50%",
                          animation: "bounce 1s infinite",
                        }}
                      />
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "grey.400",
                          borderRadius: "50%",
                          animation: "bounce 1s infinite 0.2s",
                        }}
                      />
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: "grey.400",
                          borderRadius: "50%",
                          animation: "bounce 1s infinite 0.4s",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #eee",
                bgcolor: "background.paper",
                display: "flex",
                gap: 1,
                alignItems: "flex-end", // Ensures input and button are bottom-aligned
              }}
            >
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                maxRows={4} // Prevents input from growing too much
                placeholder="Ask about patient data, medications..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isTyping}
                sx={{
                  overflow: "auto",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                sx={{ minWidth: 48 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Collapse>
        </Paper>
      </Collapse>
    </Box>
  );
}
