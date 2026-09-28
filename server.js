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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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



// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const connectMongo = require('connect-mongo');
// const passport = require('./config/passport');
// const connectDB = require('./config/db');

// // Safe CommonJS / ES module interop import for connect-mongo
// const MongoStore = connectMongo.default || connectMongo;

// // Restrict DNS override to local development (prevents network resolution issues on Vercel/AWS)
// if (process.env.NODE_ENV !== 'production') {
//   const dns = require('node:dns');
//   dns.setServers(['8.8.8.8', '8.8.4.4']);
// }

// const app = express();

// // 1. Trust reverse proxy (Required for secure HTTPS cookies behind Vercel)
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

// // 3. Request Logger (placed early to trace all requests)
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

// // 5. Distributed Session Store in MongoDB (prevents session drop across serverless instances)
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'secret',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGODB_URI,
//       collectionName: 'sessions',
//       ttl: 24 * 60 * 60, // 1 day in seconds
//     }),
//     cookie: {
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
//     },
//   })
// );

// // 6. Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // 7. Root Base Route (Fixes the "Route / not found" error when opening the root Vercel domain)
// app.get('/', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'HealthTracking Backend is running on Vercel 🚀',
//     environment: process.env.NODE_ENV || 'development',
//     endpoints: {
//       health: '/api/health',
//       auth: '/api/auth',
//       users: '/api/users',
//       fit: '/api/fit',
//       agenda: '/api/agenda',
//       hydration: '/api/hydration',
//       sleep: '/api/sleep',
//       diet: '/api/diet',
//     },
//   });
// });

// // 8. Health Check Route
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'MERN Auth API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development',
//   });
// });

// // 9. API Application Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/fit', require('./routes/fit'));
// app.use('/api/agenda', require('./routes/agenda'));
// app.use('/api/hydration', require('./routes/hydration'));
// app.use('/api/sleep', require('./routes/sleep'));
// app.use('/api/diet', require('./routes/dietRoutes'));

// // 10. 404 Route Not Found Handler (Catches any unregistered paths)
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

// // 11. Global Error Handler
// app.use((err, req, res, next) => {
//   console.error('Unhandled Server Error:', err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// });

// // 12. Local development listener (Vercel automatically wraps `app` in production)
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`\n🚀 Server running on http://localhost:${PORT}`);
//     console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//     console.log(`🔐 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured ✅' : 'Not configured ❌'}\n`);
//   });
// }

// // Export Express instance for Vercel serverless functions
// module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const passport = require('./config/passport');
const connectDB = require('./config/db');

// Safe CommonJS / ES module interop import for connect-mongo
const MongoStore = connectMongo.default || connectMongo;

// Restrict DNS override to local development
if (process.env.NODE_ENV !== 'production') {
  const dns = require('node:dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = express();

// 1. Trust proxy (Required for secure HTTPS cookies behind Vercel edge reverse proxies)
app.set('trust proxy', 1);

// 2. Dynamic CORS configuration (Allows localhost:5173 + any deployed frontend URL)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, Postman) or matched origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // Allows session cookies to pass between localhost and Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request Logger
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// 4. Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware failed:', err.message);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// 5. Distributed Session Store in MongoDB
// Cross-origin cookies (localhost -> vercel) require sameSite: 'none' and secure: true
const isProduction = process.env.NODE_ENV === 'production';

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
      secure: isProduction, // true on Vercel HTTPS
      sameSite: isProduction ? 'none' : 'lax', // 'none' allows localhost to receive Vercel cookies
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// 6. Passport Authentication Middleware
app.use(passport.initialize());
app.use(passport.session());

// 7. Base Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HealthTracking Backend is live on Vercel 🚀',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      fit: '/api/fit',
      agenda: '/api/agenda',
      hydration: '/api/hydration',
      sleep: '/api/sleep',
      diet: '/api/diet',
    },
  });
});

// 8. Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MERN Auth API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 9. API Application Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/fit', require('./routes/fit'));
app.use('/api/agenda', require('./routes/agenda'));
app.use('/api/hydration', require('./routes/hydration'));
app.use('/api/sleep', require('./routes/sleep'));
app.use('/api/diet', require('./routes/dietRoutes'));

// 10. 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// 11. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// 12. Local server execution
if (!isProduction) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;