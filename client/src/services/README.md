# Client-Side Database Access Solution

This folder contains a temporary solution for accessing database data directly from the client-side, bypassing server API calls.

## Important Security Note

**This is a development-only solution and is not recommended for production use.** 
Directly accessing the database from the client exposes your database credentials and can lead to security vulnerabilities.

## How It Works

1. **databaseService.js** - Connects directly to the Supabase REST API to fetch data from various tables
2. **apiClient.js** - Intercepts all API calls made by the application and routes them to the database service
3. **queryClient.ts** - Modified to use the apiClient instead of making direct fetch calls

## Flow

1. The application makes a request to an API endpoint (e.g., `/api/datasets/singles`)
2. The request is intercepted by `apiClient.js`
3. Instead of making an HTTP request, the apiClient routes the request to the appropriate method in `databaseService.js`
4. The databaseService makes a direct call to the Supabase REST API
5. The data is returned to the application

## Benefits

- No server-side code required
- All data is fetched directly from the database
- Application functions normally without modifications to components

## Long-term Solution

For a production environment, you should:

1. Set up a proper server-side API
2. Remove client-side database access
3. Use proper authentication and authorization for API endpoints

This solution is intended as a temporary workaround to get the application functioning. 