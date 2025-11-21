### Installing necessary packages:  
* `pip install fastapi`
* `pip install "uvicorn[standard]"`  
* `pip install sqlalchemy`  
* `pip install pymysql`
* `pip install pytest`
* `pip install pytest-mock`
* `pip install httpx`
* `pip install cryptography`
* `pip install "bcrypt==4.1.2"`
* `pip install "passlib[bcrypt]"`


### Ensure the password in the config file is changed to match your MySQL password.
### Run the server:
`uvicorn backend.main:app --reload`
### Test API by built-in docs:
[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
