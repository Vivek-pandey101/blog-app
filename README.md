mern-blog-platform/
├── client/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── styles/
│   │   │   │   └── global.css
│   │   │   └── icons/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Loader.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── posts/
│   │   │   │   ├── PostCard.jsx
│   │   │   │   ├── PostForm.jsx
│   │   │   │   └── PostsList.jsx
│   │   │   └── comments/
│   │   │       ├── Comment.jsx
│   │   │       └── CommentForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── PostDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── NotFound.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── authSlice.js
│   │   │   │   └── authAPI.js
│   │   │   ├── posts/
│   │   │   │   ├── postSlice.js
│   │   │   │   └── postAPI.js
│   │   │   └── comments/
│   │   │       ├── commentSlice.js
│   │   │       └── commentAPI.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useForm.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── axiosInstance.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── routes.jsx
│   ├── .env.local
│   └── package.json
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── slugify.js
│   │   └── cloudinary.js
│   ├── validators/
│   │   ├── userValidator.js
│   │   ├── postValidator.js
│   │   └── commentValidator.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md