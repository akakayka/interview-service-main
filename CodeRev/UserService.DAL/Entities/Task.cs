using UserService.DAL.Models.Enums;

namespace UserService.DAL.Entities
{
    public class Task : BaseEntity
    {
        public bool IsDeleted { get; set; }
        public string TaskText { get; set; }
        public string StartCode { get; set; }
        public string Name { get; set; }
        public string TestsCode { get; set; }
        public int RunAttempts { get; set; }
        public ProgrammingLanguage ProgrammingLanguage { get; set; }
    }
}