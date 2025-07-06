export const addStudent = async (name) => {
  const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data.student;
};
