const query = `select p.productname, p.price, pt.typename as categories, p.description from products p 
join producttypes pt on pt.typeid = p.typeid 
left join transactions t on t.productid = p.productid 
where lower(p.productname) like lower(${sqlSearch}) and 
lower(pt.typename) like lower(${sqlCategories}) and ${price} 
group by pt.typename, p.productname, p.description, p.price 
order by ${sqlSort} ${sqlOrder} 
limit ${limit};`;

const { search, categories, minPrice, maxPrice, limit, sort } = queryParams;
const sqlSearch = search && search !== "" ? `'%${search}%'` : `'%%'`;
const sqlCategories =
  categories && categories !== "" ? `'%${categories}%'` : `'%%'`;
let price = "price is not null";
if (maxPrice && minPrice) price = `price between ${minPrice} and ${maxPrice}`;
if (!minPrice && maxPrice) price = `price <= ${maxPrice}`;
if (minPrice && !maxPrice) price = `price >= ${minPrice}`;
let sqlSort = "p.productname";
let sqlOrder = "asc";
if (sort) {
  if (sort.toLowerCase() === "price asc") sqlSort = "price";
  if (sort.toLowerCase() === "price desc") {
    sqlSort = "p.price";
    sqlOrder = "desc";
  }
  if (sort.toLowerCase() === "price desc") {
    sqlSort = "p.price";
    sqlOrder = "desc";
  }
  if (sort.toLowerCase() === "popular") {
    sqlSort = "count(t.productid)";
    sqlOrder = "desc";
  }
}
