YC-Alumni-Verifier

#### Screenshots

![image](https://user-images.githubusercontent.com/30016242/236688224-a7208aac-c763-4686-92eb-7e1144d21d9d.png)

AlumVerify is a web application that simplifies and streamlines the verification process for YC alumni.
Built using ReclaimProtocol, React, Node.js with Express, and MongoDB, AlumVerify offers a robust platform for verifying and connecting with alumni.

#### Features

- Efficient Verification: AlumVerify provides a seamless and efficient process for verifying alumni credentials, ensuring accuracy and reliability.

- Secure Platform: Built on the ReclaimProtocol framework, AlumVerify prioritizes data security and privacy, safeguarding sensitive information.

- User-friendly Interface: The intuitive user interface of AlumVerify makes it easy for both alumni and institutions to navigate and utilize the platform effectively.

#### Installation

To run AlumVerify locally, follow these steps:

###### Clone the repository:

```bash

git clone git@github.com:Koushith/YC-Alumni-Verifier.git
```

##### Install dependencies for the frontend:

```bash

cd frontend
npm install

```

##### Install dependencies for the backend:

```bash

cd backend  //from the root
npm install

```

#### Set up the configuration file:

For the backend, rename .env.example to .env and update the necessary environment variables, such as database connection details and secret keys.
For the frontend, update the backend API endpoint in the .env file located at frontend/.env.

#### Start the server for the backend:

```bash
npm run start

//or

npm run dev // run on concurrent mode with nodemon
```

#### Start the development server for the frontend:

```bash

cd ../frontend
npm start
```

#### Open your browser and navigate to http://localhost:3000 to access AlumVerify.

#### Technologies Used

- React: A JavaScript library for building user interfaces.
- Node.js: A JavaScript runtime environment for server-side development.
- Express: A flexible web application framework for Node.js.
- MongoDB: A NoSQL database for efficient and scalable data storage.
- ReclaimProtocol: A blockchain-based framework for secure data management and verification.

#### Contributing

Contributions are welcome! To contribute to AlumVerify, please follow these steps:

- Fork the repository.
- Create a new branch for your feature/bug fix.
- Make your modifications.
- Commit and push your changes to your forked repository.
- Submit a pull request to the main repository.
- Please ensure that your code adheres to the existing coding standards and includes appropriate documentation.

#### Credits

- Original code was forked from QuestBook repo.

#### License

MIT License
