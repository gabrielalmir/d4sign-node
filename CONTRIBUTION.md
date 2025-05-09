# Contributing to the D4Sign Node.js Library

Thank you for considering contributing to the D4Sign Node.js Library! This guide will help you get started and ensure your contributions are valuable to the community.

## How to Contribute

1. **Fork the Repository**: Create a fork of this repository to your GitHub account.
2. **Clone the Repository**: Clone the repository to your local machine.
    ```bash
    git clone https://github.com/gabrielalmir/d4sign-node.git
    ```
3. **Create a Branch**: Create a branch for your contribution.
    ```bash
    git checkout -b my-contribution
    ```
4. **Make Your Changes**: Add or modify the code as needed.
5. **Test Your Changes**: Ensure all existing tests pass and add new tests if necessary.
    ```bash
    npm test
    ```
6. **Submit a Pull Request**: Submit your changes for review.

## Code Style

This project follows best practices for Node.js and TypeScript code style. Make sure to adhere to these guidelines:

- Use **TypeScript** for all code files.
- Name variables and functions clearly and descriptively.
- Use **comments** to explain complex parts of the code and to help library users understand how to use it.
- This project often uses comments to explain simple parts, but this is optional and should be used carefully.

### Code Style Example

```typescript
import { D4Sign } from 'd4sign-node';

// Create a new instance of the D4Sign client
const client = new D4Sign('your-api-key', 'your-crypt-key');

/**
 * Retrieves account information.
 * Ensure the API Key and Crypt Key are correctly configured.
 */
async function getAccountInfo() {
  try {
     const account = await client.getAccount();
     console.log('Account Information:', account);
  } catch (error) {
     console.error('Error retrieving account information:', error);
  }
}

getAccountInfo();
```

## Tests

- Use the **Jest** framework to write and run tests.
- Ensure all tests pass before submitting a Pull Request.
- Add tests for any new or fixed functionality.

## Communication

If you have questions or need help, feel free to open an **Issue** in the repository or contact the project maintainers.

Thank you for contributing!
