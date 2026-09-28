// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const passport = require('./config/passport');
// const connectDB = require('./config/db');
// const dns = require('node:dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Session middleware (required for Passport)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'secret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours
//     },
//   })
// );

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/fit', require('./routes/fit'));

// app.use('/api/agenda',require('./routes/agenda'));

// app.use('/api/hydration', require('./routes/hydration'))
// app.use('/api/sleep', require('./routes/sleep'))
// app.use('/api/diet', require('./routes/dietRoutes'));


// app.use((req, res, next) => {
//     console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
//     next();
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'MERN Auth API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured ✅' : 'Not configured ❌'}\n`);
// });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const connectMongo = require('connect-mongo');
// const passport = require('./config/passport');
// const connectDB = require('./config/db');

// // Safe CommonJS / ES module interop import for connect-mongo
// const MongoStore = connectMongo.default || connectMongo;

// // Restrict DNS override to local development (avoids network issues on AWS/Vercel)
// if (process.env.NODE_ENV !== 'production') {
//   const dns = require('node:dns');
//   dns.setServers(['8.8.8.8', '8.8.4.4']);
// }

// const app = express();

// // 1. Trust proxy (Required for secure HTTPS cookies behind Vercel's reverse proxy)
// app.set('trust proxy', 1);

// // 2. CORS configuration
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:5173',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 3. Request Logger (placed early so all calls are logged)
// app.use((req, res, next) => {
//   console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
//   next();
// });

// // 4. Ensure MongoDB connection is established before route handlers run
// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (err) {
//     console.error('Database connection middleware failed:', err.message);
//     res.status(500).json({ success: false, message: 'Database connection failed' });
//   }
// });

// // 5. Distributed Session Store in MongoDB (replaces in-memory storage)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'secret',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//       collectionName: 'sessions',
//       ttl: 24 * 60 * 60, // 1 day
//     }),
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// // 6. Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // 7. Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'MERN Auth API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV,
//   });
// });

// // 8. Application Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/fit', require('./routes/fit'));
// app.use('/api/agenda', require('./routes/agenda'));
// app.use('/api/hydration', require('./routes/hydration'));
// app.use('/api/sleep', require('./routes/sleep'));
// app.use('/api/diet', require('./routes/dietRoutes'));

// // 9. 404 Route Not Found handler
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
// });

// // 10. Global Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// });

// // 11. Listen locally; export the app for Vercel Serverless in production
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//     console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured ✅' : 'Not configured ❌'}\n`);
//   });
// }

// module.exports = app;







require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('./config/passport');
const connectDB = require('./config/db');

// Handle CommonJS / ES module interop for connect-mongo
const MongoStore = connectMongo.default || connectMongo;

// Restrict custom DNS to local development to prevent AWS/Vercel network timeouts
if (process.env.NODE_ENV !== 'production') {
  const dns = require('node:dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = express();

// Required for secure cookies behind Vercel reverse proxy
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Persistent session store for serverless instances
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Request logging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/fit', require('./routes/fit'));
app.use('/api/agenda', require('./routes/agenda'));
app.use('/api/hydration', require('./routes/hydration'));
app.use('/api/sleep', require('./routes/sleep'));
app.use('/api/diet', require('./routes/dietRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MERN Auth API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server locally; export app for Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;