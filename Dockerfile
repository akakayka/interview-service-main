
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS publish
WORKDIR /src
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

EXPOSE 5001
ENV ASPNETCORE_URLS=http://*:5001/
ENV DOTNET_HOSTBUILDER__RELOADCONFIGONCHANGE=false
WORKDIR /app
COPY --from=publish /app/publish ./Core
WORKDIR /app/Core
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT ["dotnet", "Core.dll"]