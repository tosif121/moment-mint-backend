# Node.js Project: moment-mint-backend

## Description

Moment Mint is a revolutionary platform for sharing real-time moments and earning cryptocurrency. Here's what makes it special:

- **Real-time Sharing**: Capture and share exciting moments as they happen - be it a concert, a beautiful sunset, or any thrilling experience.
- **Earn Crypto**: Get rewarded with cryptocurrency for sharing your authentic moments.
- **Blockchain Verification**: We use blockchain technology to verify the authenticity of shared moments, ensuring genuine content.
- **NFT Creation**: Turn your most special moments into unique Non-Fungible Tokens (NFTs), creating digital collectibles that you exclusively own.

Experience the joy of sharing, earn rewards, and immortalize your memories in the digital world with Moment Mint!

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up this project on your local machine:

1. Ensure Node.js is installed (version 14.x or higher recommended)
2. Clone the repository:
   ```
   git clone https://github.com/tosif121/moment-mint-backend.git
   ```
3. Navigate to the project directory:
   ```
   cd moment-mint-backend
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in the required environment variables

## Usage

To start the server:

For both development and production:
```
npm start
```

## API Reference

### Authentication Routes
- `POST /verifyOtp`: Verify OTP
- `POST /checkMobileNumber`: Check mobile number

### Post Routes
- `POST /createPosts`: Create a new post (requires authentication and file upload)
- `GET /posts`: Get all posts (requires authentication)
- `GET /myPosts`: Get current user's posts (requires authentication)
- `GET /posts/:id`: Get a specific post by ID (requires authentication)
- `POST /posts/:id`: Update a specific post (requires authentication and file upload)
- `POST /posts/:id`: Delete a specific post (requires authentication)

### User Routes
- `POST /createUser`: Create a new user
- `GET /getAllUsers`: Get all users
- `GET /getUserById/:uid`: Get a specific user by ID
- `POST /updateUser/:id`: Update a specific user
- `POST /deleteUser/:id`: Delete a specific user

### Like Routes
- `POST /toggleLike`: Toggle like on a post (requires authentication)
- `GET /getLikes`: Get likes for a post (requires authentication)

### Follow Routes
- `POST /toggleFollow`: Toggle follow for a user (requires authentication)
- `GET /users/:userId/followers`: Get followers of a user (requires authentication)
- `GET /users/:userId/following`: Get users followed by a user (requires authentication)

### Comment Routes
- `POST /createComment`: Create a new comment (requires authentication)
- `GET /posts/:postId`: Get comments for a specific post (requires authentication)
- `POST /updateComment:id`: Update a specific comment (requires authentication)
- `POST /deleteComment:id`: Delete a specific comment (requires authentication)

Note: Routes marked with (requires authentication) need a valid authentication token to be accessed.

## Configuration

1. Environment Variables:
   - Set up all required variables in the `.env` file
   - Ensure sensitive information like API keys and database credentials are properly secured

2. WhatsApp Web Integration:
   - This project uses whatsapp-web.js for OTP verification
   - You'll need to scan a QR code to set up WhatsApp Web integration
   - Follow the console prompts when starting the server to complete this setup

## Contributing

We welcome contributions to Moment Mint! Here's how you can help:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-branch-name`
5. Submit a pull request

Please ensure your code adheres to our coding standards and include tests for new features.

## License

This project is licensed under the [specify your license type here, e.g., MIT License] - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

For questions or feedback, please contact [Your Name/Team Name] at [contact email].

---

Thank you for your interest in Moment Mint! We're excited to see the moments you'll share and the digital assets you'll create.