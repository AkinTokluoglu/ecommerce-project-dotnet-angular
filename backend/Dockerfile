FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Sadece proje dosyalarını (csproj) kopyalayalım (Restore işlemi için)
# Klasör yapılarını koruyarak kopyalıyoruz
COPY src/API/*.csproj ./src/API/
COPY src/Application/*.csproj ./src/Application/
COPY src/Domain/*.csproj ./src/Domain/
COPY src/Infrastructure/*.csproj ./src/Infrastructure/

# Doğrudan API projesi üzerinden restore yapalım
RUN dotnet restore src/API/MarangozEcommerce.API.csproj

# Tüm dosyaları kopyalayalım ve build alalım
COPY . .
RUN dotnet publish src/API/MarangozEcommerce.API.csproj -c Release -o out

# Çalıştırma aşaması (Final stage)
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .

# Yüklenen görseller için klasör oluştur (Render Disk kullanacaksanız burası önemli)
RUN mkdir -p wwwroot/uploads

# Render varsayılan port ayarı
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "MarangozEcommerce.API.dll"]
