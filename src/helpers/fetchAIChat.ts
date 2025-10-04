export default async function fetchAIChat(
  patientData: any[],
  userQuestion: string
) {
  const response = await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ patientData, userQuestion }),
  });
  if (!response.ok) throw new Error("AI chat failed");
  const data = await response.json();
  return data.aiResponse;
}
