# download and start an image .net 7
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
#specify working directory
WORKDIR /app
EXPOSE 8080

# copy csproj (dotnet packages file) and restore as distinct layers
#copy all packages from csproj to /app inside container
COPY *.csproj ./
# install all packages for project specified inside csproj
RUN dotnet restore

# copy everything else and build
# copu everyting inside current folder (./API) to /app inside container
COPY . ./
# production build with config Release, and output to out folder inside /app
RUN dotnet publish -c Release -o out

# build a runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "API.dll" ]