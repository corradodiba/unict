if [ ! -f ".env" ]
  then
    echo "SETTING ENV VARIABLES: Start"
    touch .env
    echo 'CODECOV_TOKEN=3c4e7842-11c1-4d90-ab84-13cfa22d4e4f' > .env
    echo "SETTING ENV VARIABLES: End"
  fi
    rm -rf .env
    echo "SETTING ENV VARIABLES: Start"
    touch .env
    echo 'CODECOV_TOKEN=3c4e7842-11c1-4d90-ab84-13cfa22d4e4f' > .env
    echo "SETTING ENV VARIABLES: End"