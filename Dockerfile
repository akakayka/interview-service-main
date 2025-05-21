ARG POSTGRESQL_HOST="default_host_if_not_set"

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS publish
WORKDIR /src

COPY root.crt /usr/local/share/ca-certificates/yandex-mdb-ca.crt
RUN update-ca-certificates

COPY ./CodeRev/Core ./CodeRev/Core
COPY ./CodeRev/CompilerService ./CodeRev/CompilerService
COPY ./CodeRev/TrackerService ./CodeRev/TrackerService
COPY ./CodeRev/TrackerService.Contracts ./CodeRev/TrackerService.Contracts
COPY ./CodeRev/TrackerService.DataAccess ./CodeRev/TrackerService.DataAccess
COPY ./CodeRev/UserService ./CodeRev/UserService
COPY ./CodeRev/UserService.DAL ./CodeRev/UserService.DAL
COPY ./CodeRev/TaskTestsProvider ./CodeRev/TaskTestsProvider
WORKDIR /src/CodeRev/Core
RUN dotnet restore "Core.csproj"
RUN dotnet publish "Core.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:6.0
ARG POSTGRESQL_HOST="default_host_if_not_set"
RUN echo "Using PostgreSQL host: $POSTGRESQL_HOST"
EXPOSE 5001
ENV ASPNETCORE_URLS=http://*:5001/
ENV DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false
WORKDIR /app
COPY --from=publish /app/publish ./Core
COPY root.crt /certs/
WORKDIR /app/Core
ENV ASPNETCORE_ENVIRONMENT=Development
ENV POSTGRESQL_HOST=$POSTGRESQL_HOST
ENTRYPOINT ["dotnet", "Core.dll"]
