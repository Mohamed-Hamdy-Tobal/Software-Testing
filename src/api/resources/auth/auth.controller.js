const authService = require("./auth.service");

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "400 invalid request, name, email and password are required",
      });
    }

    const user = await authService.register({ email, password, name });

    return res.status(201).json({
      message: "User created successfully",
      data: { user },
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to create user" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "400 invalid request, email and password are required",
      });
    }

    const { user, token } = await authService.login({ email, password });

    return res.status(200).json({
      message: "User logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to log in user" });
  }
};

module.exports = {
  register,
  login,
};
