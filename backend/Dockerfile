FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/API/MarangozEcommerce.API.csproj", "src/API/"]
COPY ["src/Application/MarangozEcommerce.Application.csproj", "src/Application/"]
COPY ["src/Domain/MarangozEcommerce.Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/MarangozEcommerce.Infrastructure.csproj", "src/Infrastructure/"]
RUN dotnet restore "src/API/MarangozEcommerce.API.csproj"
COPY . .
WORKDIR "/src/src/API"
RUN dotnet build "MarangozEcommerce.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MarangozEcommerce.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "MarangozEcommerce.API.dll"]
