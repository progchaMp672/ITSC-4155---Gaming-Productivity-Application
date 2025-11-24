### Installing necessary packages:  
* `pip install fastapi`
* `pip install "uvicorn[standard]"`  
* `pip install sqlalchemy`  
* `pip install pymysql`
* `pip install pytest`
* `pip install pytest-mock`
* `pip install httpx`
* `pip install pydantic[email]`
* `pip install cryptography`
* `pip install "bcrypt==4.1.2"`
* `pip install "passlib[bcrypt]"`

### Run Locally:
- To run locally, change existing URL to local host in both the frontend and the backend
- Create a `.env`. file in the root of the project
- Ensure the password in the config file is changed to match your MySQL password.
- Continue onto MySQL and create a schema that matches the schema in the `backend/config.py`.

### Run the server:
`uvicorn backend.main:app --reload`
### Test API by built-in docs:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
### Test Frontend by running Live Server Extension on VS Code

### Live Website:
[https://progchamp672.github.io/ITSC-4155---Gaming-Productivity-Application/]