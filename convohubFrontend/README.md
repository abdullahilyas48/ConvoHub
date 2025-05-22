"# Frontend Repository" 
ConvoHub

General Intructions to run project:

npm install (Run this command in VS Code for your project where package.json is located) 

(virtual environment folder in the folder: env\Scripts\Activate -activate the virtual environment everytime)

clone a repository

type ‘cmd’ in cloned repository folder
run in terminal:
python -m venv env

env\Scripts\activate
cd tab -cd backend
pip install -r requirements.txt : downloads all python modules
in terminal- code . //opens vs code
go to API usage

go to pgadmin servers->create new server
open server
create database
restore (Terminal command to restore file: psql -h localhost -p 5432 -U postgres -d your_database_name -f "/path/to/backup_file.sql"
dont forget file name in path)
No need to restore file in pgadmin though
drop sql file from convohub 

settings.py- databases string copy and comment (Change db name & pw)
name-convohub
user-postgres
-password
host-localhost
port-5432

(PYTHON MANAGE.PY MAKEMIGRATIONS)- one time command tho
python manage.py migrate
you may have to run individual migrations, remember total 9 migrations, check from installed apps in settings.py

test api:
python manage.py runserver

postman extension on vs code for api testing
allowed type- post
localhost:8000/auth/signup

when new push:
git pull in terminal- change settings.py run migrations

access tokens in logins and APIs
send access token in body. relogin when session expires

On backend terminal run this command
python manage.py createsuperuser
Fill all info
Then open localhost:8000/admin
[Login there with the credentials you have just created
