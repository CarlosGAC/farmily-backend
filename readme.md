# Run server
## At first time
1. First at all, install all node modules with: npm install.
2. Set the **DATABASE_URL** and **PORT** in `.env` file.
3. Apply the [migrations](#apply).
4. Run the **seeders** using `npx prisma db seed`.
5. Use `npm run start` to run the server.
## Second time onwards
1. Only use `npm run start` command.

# Migrations
## Apply
Use the migrate deploy command to apply migrations:
`npx prisma migrate deploy`
## Create a new one and apply
Use the migrate dev command to generate and apply migrations:
`npx prisma migrate dev`
## Reset
To undo manual changes or db push experiments by running:
`npx prisma migrate reset`

# Urls
## Postman documentation
<https://www.postman.com/dcodeteammx/workspace/farmily/overview>
## Testing server
<https://farmily-backend.herokuapp.com/api/>