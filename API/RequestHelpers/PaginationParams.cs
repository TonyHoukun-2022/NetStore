namespace API.RequestHelpers
{
  public class PaginationParams
    {
        //private field
        private const int MaxPageSize = 50;
        //property
        public int PageNumber {get; set;} = 1;
        private int _pageSize = 6;
        //property to access _pageSize
        public int PageSize {
          get => _pageSize;
          set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
    }
}