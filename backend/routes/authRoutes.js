const express = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { signupValidation, loginValidation } = require('../validators/authSchemas');

const router = express.Router();

router.get('/', (req, res) => {
	return res.status(200).json({
		message: 'Auth API is running',
		endpoints: [
			'GET /api/auth',
			'GET /api/auth/signup',
			'GET /api/auth/login',
			'POST /api/auth/signup',
			'POST /api/auth/login',
		],
	});
});

router.get('/signup', (req, res) => {
	return res.status(200).json({
		message: 'Use POST /api/auth/signup with name, email, and password',
	});
});

router.get('/login', (req, res) => {
	return res.status(200).json({
		message: 'Use POST /api/auth/login with email and password',
	});
});

router.post('/signup', signupValidation, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: 'Validation failed',
			errors: errors.array().map((error) => error.msg),
		});
	}

	try {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
		if (existingUser) {
			return res.status(409).json({ message: 'Email already in use' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			name: name.trim(),
			email: email.toLowerCase().trim(),
			password: hashedPassword,
		});

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET || 'dev_secret_change_me',
			{ expiresIn: '7d' }
		);

		return res.status(201).json({
			message: 'Signup successful',
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: 'Server error during signup' });
	}
});


router.post('/login', loginValidation, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			message: 'Validation failed',
			errors: errors.array().map((error) => error.msg),
		});
	}

	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email: email.toLowerCase().trim() });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email },
			process.env.JWT_SECRET || 'dev_secret_change_me',
			{ expiresIn: '7d' }
		);

		return res.status(200).json({
			message: 'Login successful',
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		return res.status(500).json({ message: 'Server error during login' });
	}
});

module.exports = router;
