# Stage 1: Build the React application using CRACO
FROM node:18 AS react-build
WORKDIR /app
COPY .env .env
COPY ./frontend/package.json ./frontend/package-lock.json* ./
RUN npm install
COPY ./frontend .
ARG BACKEND_PORT_PROD
ARG BACKEND_URL_PROD
ENV REACT_APP_BACKEND_URL_PROD=$BACKEND_URL_PROD
ENV REACT_APP_BACKEND_PORT_PROD=$BACKEND_PORT_PROD
ENV BACKEND_URL_PROD=$BACKEND_URL_PROD
ENV BACKEND_PORT_PROD=$BACKEND_PORT_PROD
RUN npm run build


# Stage 2: Setup the Node.js server
FROM node:18
WORKDIR /app

# Copy .env
COPY .env .env

# Set environment variables based on the .env file provided
ENV NODE_ENV=prod
ENV MONGO_DB_URI_PROD=${MONGO_DB_URI_PROD}
ENV BACKEND_PORT_PROD=${FRONTEND_PORT_PROD}
ENV BACKEND_URL_PROD=${FRONTEND_PORT_PROD}
# ENV FRONTEND_PORT_PROD=${FRONTEND_PORT_PROD}
# ENV FRONTEND_URL_PROD=${FRONTEND_URL_PROD}

# Copy the built React app from the previous stage
COPY --from=react-build /app/build /app/frontend/build

# Set up the Node.js server
COPY ./backend/package.json ./backend/package-lock.json* ./
RUN npm install
COPY ./backend .

RUN ls -la


# Expose the port the server listens on
EXPOSE ${BACKEND_PORT_PROD} ${FRONTEND_PORT_PROD}

# Start the server
CMD ["node", "app.js"]
