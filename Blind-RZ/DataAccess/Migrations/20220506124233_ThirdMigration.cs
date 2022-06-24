using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    public partial class ThirdMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Command_Accounts_AccountIdRef",
                table: "Command");

            migrationBuilder.RenameColumn(
                name: "AccountIdRef",
                table: "Command",
                newName: "AccountId");

            migrationBuilder.RenameIndex(
                name: "IX_Command_AccountIdRef",
                table: "Command",
                newName: "IX_Command_AccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_Command_Accounts_AccountId",
                table: "Command",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Command_Accounts_AccountId",
                table: "Command");

            migrationBuilder.RenameColumn(
                name: "AccountId",
                table: "Command",
                newName: "AccountIdRef");

            migrationBuilder.RenameIndex(
                name: "IX_Command_AccountId",
                table: "Command",
                newName: "IX_Command_AccountIdRef");

            migrationBuilder.AddForeignKey(
                name: "FK_Command_Accounts_AccountIdRef",
                table: "Command",
                column: "AccountIdRef",
                principalTable: "Accounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
