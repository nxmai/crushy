const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "Email already exists" });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      //password encryption
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      const saveUser = await newUser.save();

      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: 'user/refresh_token',
        maxAge: 7*24*60*60*1000
      })

      res.json({accessToken});

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      //login success => create access token and refresh token
      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: 'user/refresh_token',
        maxAge: 7*24*60*60*1000
      })

      res.json({ accessToken });
      // res.header('auth-token', accesstoken).send(accesstoken);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  refreshToken: (req, res) => {
    try {
      const refreshToken = req.cookies['refreshtoken'];
      console.log('refreshtoken', refreshToken );

      if (!refreshToken) return res.status(400).json({ msg: "Please Login or Register" });

      jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) return res.status(400).json({ msg: "Please Login or Register fail" });

          const accessToken = createAccessToken({ id: user.id });

          res.json({ accessToken });
        }
      );
    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  },

  logout: (req, res) => {
    try {
     res.clearCookie('refreshtoken', {path: 'user/refresh_token'})
      return res.json({msg: "Logged out"})

    } catch(error){
      return res.status(500).json({msg: error.message})
    }
  },

  addCart: (req, res) => {
    res.json({
      cart: {
        title: "cart",
        status: "success",
      },
    });
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
      if(!user) return res.status(400).json({msg: "User does not exist."})

      res.json(user)

    } catch (error) {
      return res.status(500).json({msg: error.message})
    }
  }
};

module.exports = userCtrl;