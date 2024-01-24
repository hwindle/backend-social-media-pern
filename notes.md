docker run --name sm-postgres -e POSTGRES_USER=postwoman -e POSTGRES_PASSWORD=89123 -p 5432:5432 -d postgres 

docker exec -ti sm-postgres bash