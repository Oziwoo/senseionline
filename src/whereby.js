export async function createRoom() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const response = await fetch("https://api.whereby.dev/v1/meetings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_WHEREBY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      endDate: tomorrow.toISOString(),
      fields: ["hostRoomUrl"],
    }),
  });

  const data = await response.json();
  return {
    roomUrl: data.roomUrl,       // для студента
    hostRoomUrl: data.hostRoomUrl // для учителя
  };
}