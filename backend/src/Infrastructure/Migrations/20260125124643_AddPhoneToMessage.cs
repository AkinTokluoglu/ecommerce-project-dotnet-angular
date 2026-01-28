using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarangozEcommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPhoneToMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Messages",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Messages");
        }
    }
}
