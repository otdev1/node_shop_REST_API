This API implements some of the operations that are associated with a typical merchant shop and I built it to showcase my skills in API development. 
It is lightweight and uses the Mongoose object data modeling library to facilitate interaction with a MongoDB database. 
Requests and responses sent to and from it are in JSON format.

Sign Up As New User

HTTP request type: POST

Request URL: https://ot-node-rest-api.herokuapp.com/user/signup

Request data format:

{
    "email": "example@example.com",
    "password": "1234"
}

Success response data:

{
    "message": "User created"
}

