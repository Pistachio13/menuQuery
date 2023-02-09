import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios'
import './App.css';

const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    sortable: true,
    width: '100px'
  },
  {
    name: 'FoodName',
    selector: row => row.food_name,
    sortable: true
  },
  {
    name: 'Price',
    selector: row => row.price,
    sortable: true
  },
  {
    name: 'Description',
    selector: row => row.description,
  },

];


function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('');
  const [sortColumnDir, setSortColumnDir] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);

    let url = `http://localhost:5000/api/menu?page=${page}&per_page=${perPage}`
    
    if (search) {
      url += `&search=${search}`
    }
    if (sortColumn) {
      url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`
    }

    const response = await axios.get(url);

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = page => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };

  const handleSort = (column, sortDirection) => {
    console.log(column, sortDirection)
    setSortColumn(column.name)
    setSortColumnDir(sortDirection)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchData()
  }

  useEffect(() => {
    fetchData();

  }, [page, perPage, sortColumn, sortColumnDir]);

  return (
    <div>
      <form>
        <label onSubmit={handleSearchSubmit}>
          Search:
          <input type="text" name="search" onChange={handleSearchChange}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
      <DataTable
        title="Menu"
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSort={handleSort}
      />
    </div>
  );
}

export default App;
