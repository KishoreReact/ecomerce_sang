export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = req.body;

  return res.status(200).json({
    status: "Success",
    statusCode: 2000,
    message: "Login successful.",
    result: {
      userData: "[{\"UserId\":1027,\"LoginName\":\"TestAPI\"}]",
      accessToken:
        "\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdEFQSSIsInVuaXF1ZV9uYW1lIjoiVGVzdEFQSSIsIm5hbWVpZCI6IjEwMjciLCJDdXN0b21DbGFpbVR5cGUiOlsiRGF0YWJhc2VLZXkiLCJEYXRhYmFzZU5hbWUiLCJDaGFubmVsSWQiLCJMYW5ndWFnZUlkIl0sIkRhdGFiYXNlS2V5IjoiMSIsIkRhdGFiYXNlTmFtZSI6IlNhbmdFeERCX0dTRyIsIkNoYW5uZWxJZCI6IjEiLCJMYW5ndWFnZUlkIjoiMCIsIm5iZiI6MTc2MjYwNzE2NCwiZXhwIjoxNzYyNjIxNTY0LCJpYXQiOjE3NjI2MDcxNjR9.U3Eo9Oox7N9yojNb5uWswYSKAzAGy3b-TUO_f7ZI5eg\"",
      refreshToken:
        "\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVGVzdEFQSSIsInVuaXF1ZV9uYW1lIjoiVGVzdEFQSSIsIm5hbWVpZCI6IjEwMjciLCJDdXN0b21DbGFpbVR5cGUiOlsiRGF0YWJhc2VLZXkiLCJEYXRhYmFzZU5hbWUiLCJDaGFubmVsSWQiLCJMYW5ndWFnZUlkIl0sIkRhdGFiYXNlS2V5IjoiMSIsIkRhdGFiYXNlTmFtZSI6IlNhbmdFeERCX0dTRyIsIkNoYW5uZWxJZCI6IjEiLCJMYW5ndWFnZUlkIjoiMCIsIm5iZiI6MTc2MjYwNzE2NCwiZXhwIjoxNzYyNjI4NzY0LCJpYXQiOjE3NjI2MDcxNjR9.kE-sVeJmvn9PBIA1hgsOWr0H7OhZxTb2NK5ZfisSYCk\"",
      tokenExpiryMin: 240
    }
  });
}
