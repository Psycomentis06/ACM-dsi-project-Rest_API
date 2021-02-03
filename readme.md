### ACM DSI3 Project Backend ###

## Website

Backend is hosted with Heroku on https://aqueous-eyrie-60488.herokuapp.com/
REST API endpoints start with /api/v1/
`Exp: https://aqueous-eyrie-60488.herokuapp.com/api/v1/user/all?username=&limit=&offset=`

The structure is simple for the backend (MVC architecture based).

    - `models | controllers` : MVC.

    - `tests` : Where you can test some DB functions before implementing them to the app.

    - `libs` : For some configurations like mysql connection.

    - `middleware` : Experss middlewares.

**Setting up the project**

You have just to add mysql server cridentials and firebase api key json file in root folder
