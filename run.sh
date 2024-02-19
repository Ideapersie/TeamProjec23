# This script provides an easy way to run the full application (both servers)
# It assumes you've already setup a local postgres database

clear

printf "Setting up Restaurant CRM Web Application...\n\n"

# Prints system details + throws error if not found
printf "YOUR SYSTEM\n--------------------------------------\n"
printf "Python: "; python --version;
printf "Node: "; node --version;
printf "Npm: "; npm --version;
python -c "import platform; plat = platform.uname(); print('System:', plat.system);"
printf "\nChecking system configuration is valid... ✅ SUCCESS\n"

# Loading backend .env variables
set -a
source ./backend/.env
set +a
printf "Loading environment variables from ./backend/.env... ✅ SUCCESS\n"

# Checking + displaying database credentials
printf "\nYOUR DATABASE\n-----------------\n"

if [[ -z "${DATABASE_NAME}" ]]; then
  echo "Missing DATABASE_NAME in ./backend/.env"
  exit 1
else
  echo "Name: ${DATABASE_NAME}"
fi

if [[ -z "${DATABASE_USER}" ]]; then
  echo "Missing DATABASE_USER in ./backend/.env"
    exit 1
else
  echo "User: ${DATABASE_USER}"
fi

if [[ -z "${DATABASE_PASSWORD}" ]]; then
  echo "Missing DATABASE_PASSWORD in ./backend/.env"
    exit 1
else
  echo "Password: *************"
fi

if [[ -z "${DATABASE_HOST}" ]]; then
  echo "Missing DATABASE_HOST in ./backend/.env"
    exit 1
else
  echo "Host: ${DATABASE_HOST}"
fi

printf "\nChecking all required environment variables have been provided... ✅ SUCCESS\n"

# Creates a virtual environment
printf "Creating virtual environment for python dependencies... "
python -m venv ./backend/venv
printf "✅ SUCCESS\n"

# Activates virtual environment
source ./backend/venv/Scripts/activate
printf "Activating virtual environment... ✅ SUCCESS\n"

# Installing backend server dependencies
printf "\nInstalling backend server dependencies...\n\n"
pip install -r ./backend/resources/requirements.txt
printf "\nInstalling backend server dependencies ... ✅ SUCCESS\n"

# Installing frontend server dependencies
printf "\nInstalling frontend server dependencies...\n\n"
cd ./frontend && npm install
printf "\nInstalling frontend server dependencies ... ✅ SUCCESS\n"
cd ..

# Resets tables + populates with mock data
python ./backend/resources/query.py
printf "\nSet/reset tables (including, populating with mock data)... ✅ SUCCESS\n"

# Runs both frontend and backend servers
printf "\nStarting application...\n"
python ./backend/app.py & cd ./frontend || exit 1; npm run dev;